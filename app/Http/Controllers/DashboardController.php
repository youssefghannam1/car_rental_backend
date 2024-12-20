<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Car;
use App\Models\Invoice;
use App\Events\CompletedBooking;
use App\Models\Revenue;
use App\Models\Reservation;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    // Get all revenues and return data for the frontend
    public function getRevenues()
    {
        // Eager loading to reduce queries (assuming 'car' is a relation on Invoice)
        $revenues = Invoice::all();
        event(new CompletedBooking("Hello Guys"));

        $totalRevenue = $revenues->sum('amount');

        $revenues = DB::table('invoices')
            ->select(DB::raw('SUM(amount) as total, AVG(amount) as avg, MONTH(date_issued) as month'))
            ->groupBy('month')
            ->orderBy('month', 'asc') 
            ->get();

            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $totalRevenueData = array_fill_keys($months, 0);

            foreach ($revenues as $revenue) {
                $totalRevenueData[$months[$revenue->month - 1]] = $revenue->total;
            }
            $totalReservations = array_sum($totalRevenueData);
            $nonZeroMonths = count(array_filter($totalRevenueData, function ($value) {
                return $value;
            }));
            $averageRevenues = $totalReservations / $nonZeroMonths;

        $data = [
            'categories' => $revenues->pluck('period'),
            'series' => array_values($totalRevenueData),
            'total' => $totalRevenue,
            'avg' => $averageRevenues
        ];

        return response()->json($data);
    }

    public function getUpcomingReservations()
    {
        $reservations = DB::table('reservations')
            ->select(DB::raw('COUNT(*) as total, MONTH(start_date) as month'))
            ->groupBy('month')
            ->orderBy('month', 'asc') 
            ->get();

            $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            $currentMonthFull = Carbon::now()->format('F');
            $previousMonthFull = Carbon::now()->subMonth()->format('F');
            $currentMonthIndex = array_search($currentMonthFull, $months);
            $previousMonthIndex = array_search($previousMonthFull, $months);


            $totalReservedData = array_fill_keys($months, 0);

            foreach ($reservations as $reservation) {
                $totalReservedData[$months[$reservation->month - 1]] = $reservation->total;
            }
            $totalReservations = array_sum($totalReservedData);
            $nonZeroMonths = count(array_filter($totalReservedData, function ($value) {
                return $value > 0;
            }));
            if ($totalReservations[$previousMonthIndex] > 0) {
                $averageReservations = ($totalReservations[$currentMonthIndex] - $totalReservations[$previousMonthIndex]) * 100 / $totalReservations[$previousMonthIndex];
            } else {
                $averageReservations = 0;
            }
        return response()->json([
            'total' => $reservations->count(),
            'series' => array_values($totalReservedData),
            'avg' => $averageReservations
        ]);
    }

    public function getUpcomingMaintenances()
    {
        $maintenances = Maintenance::whereYear('maintenance_date', Carbon::now()->year)->get();

        $monthlyAmounts = $this->processMonthlyData($maintenances, 'maintenance_date', 'amount');

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $series = [];
        foreach ($months as $month) {
            $series[] = $monthlyAmounts[$month] ?? 0;
        }

        return response()->json([
            'total' => $maintenances->sum('amount'),
            'categories' => $months,
            'series' => $series,
        ]);
    }

    public function getRevenueByCategory()
    {
        $revenues = DB::table('cars')
            ->join('invoices', 'cars.id', '=', 'invoices.car_id')  // Assuming 'car_id' is used in 'invoices'
            ->select('cars.category', DB::raw('SUM(invoices.amount) as total'))
            ->groupBy('cars.category')
            ->get();

        $chartData = $revenues->map(function ($revenue) {
            return [
                'label' => $this->formatCategoryLabel($revenue->category),
                'value' => (float) $revenue->total,
            ];
        });

        return response()->json([
            'chart' => [
                'series' => $chartData,
            ],
        ]);
    }

    public function getRevenuesAndLosses()
{
    // Get revenue data for all months (remove whereMonth for global months)
    $revenues = DB::table('invoices')
        ->select(DB::raw('SUM(amount) as total, MONTH(date_issued) as month'))
        ->groupBy('month')
        ->orderBy('month', 'asc') // Sorting months in ascending order
        ->get();

    // Get loss data for all months (same here, remove whereMonth)
    $losses = DB::table('maintenances')
        ->select(DB::raw('SUM(cost) as total, MONTH(maintenance_date) as month'))
        ->groupBy('month')
        ->orderBy('month', 'asc') // Sorting months in ascending order
        ->get();

    // Array for the 12 months of the year
    $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize revenue and loss data with 0 values for each month
    $revenueData = array_fill_keys($months, 0); // Default 0 for each month
    $lossData = array_fill_keys($months, 0); // Default 0 for each month

    // Populate the revenueData array with actual revenue values
    foreach ($revenues as $revenue) {
        $revenueData[$months[$revenue->month - 1]] = $revenue->total; // Adjust for 0-indexed array
    }

    // Populate the lossData array with actual loss values
    foreach ($losses as $loss) {
        $lossData[$months[$loss->month - 1]] = $loss->total; // Adjust for 0-indexed array
    }

    // Return the JSON response with the populated data
    return response()->json([
        'categories' => $months, // Months (categories)
        'series' => [
            [
                'name' => 'Revenus',
                'data' => array_values($revenueData), // Array of revenue data for all months
            ],
            [
                'name' => 'Pertes',
                'data' => array_values($lossData),
            ],
        ],
    ]);
}

    // Helper function to process monthly data
    private function processMonthlyData($items, $dateColumn, $amountColumn)
    {
        $monthlyData = [];

        // Process data using collections
        foreach ($items as $item) {
            $month = Carbon::parse($item->{$dateColumn})->format('M');
            if (!isset($monthlyData[$month])) {
                $monthlyData[$month] = 0;
            }
            $monthlyData[$month] += $item->{$amountColumn};
        }

        return $monthlyData;
    }

    // Helper function to format category labels
    private function formatCategoryLabel($category)
    {
        $translations = [
            'Economy' => 'Voitures Économiques',
            'SUV' => 'SUVs',
            'Luxury' => 'Voitures de Luxe',
            'Van' => 'Vans',
            'Sedan' => 'Berlines',
            'Coupe' => 'Coupés',
        ];

        return $translations[$category] ?? $category;
    }

    public function totalClients() 
    {
    $clients = DB::table('clients')
    ->select(DB::raw('COUNT(*) as total, MONTH(DATE_FORMAT(created_at, "%Y-%m-%d")) as month'))
    ->groupBy('month')
    ->orderBy('month', 'asc') 
    ->get();

    $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $currentMonthFull = Carbon::now()->format('F');
    $previousMonthFull = Carbon::now()->subMonth()->format('F');
    $totalReservedData = array_fill_keys($months, 0);

    foreach ($clients as $client) {
        $totalReservedData[$months[$client->month - 1]] = $client->total;
    }
    if ($totalReservedData[$previousMonthFull] > 0) {
        $averageReservations = ($totalReservedData[$currentMonthFull] - $totalReservedData[$previousMonthFull]) 
        * 100 / $totalReservedData[$previousMonthFull];
    } else {
        $averageReservations = 0;
    }

        return response()->json([
            'total' => array_sum($totalReservedData),
            'data' => array_values($totalReservedData),
            'avg' => $averageReservations
        ]);
    }

    private function cacheRevenueData()
    {
        return Cache::remember('revenues_by_category', 60, function () {
            return DB::table('cars')
                ->join('invoices', 'cars.id', '=', 'invoices.car_id')
                ->select('cars.category', DB::raw('SUM(invoices.amount) as total'))
                ->groupBy('cars.category')
                ->get();
        });
    }
}