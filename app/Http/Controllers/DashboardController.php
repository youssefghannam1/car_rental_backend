<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Car;
use App\Models\Revenue;
use App\Models\Reservation;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Carbon\Carbon;


class DashboardController extends Controller
{
    public function getRevenues()
    {
        $revenues = Revenue::all();

        $totalRevenue = $revenues->sum('amount');

        $data = [
            'categories' => $revenues->pluck('period'),
            'series' => $revenues->pluck('amount'),
            'total' => $totalRevenue,
        ];

        return response()->json($data);
    }
    public function getUpcomingReservations()
    {
        $reservations = Reservation::where('status', 'confirmed')
            ->whereDate('start_date', '>', Carbon::now())
            ->get();

        $totalRevenue = $reservations->sum('price');

        $monthlyRevenue = [];

        foreach ($reservations as $reservation) {
            $month = Carbon::parse($reservation->start_date)->format('M');

            if (!isset($monthlyRevenue[$month])) {
                $monthlyRevenue[$month] = 0;
            }

            $monthlyRevenue[$month] += $reservation->price;
        }

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        $series = [];
        foreach ($months as $month) {
            $series[] = isset($monthlyRevenue[$month]) ? $monthlyRevenue[$month] : 0;
        }

        return response()->json([
            'total' => $totalRevenue,
            'categories' => $months,
            'series' => $series
        ]);
    }
    public function getUpcomingMaintenances()
    {
        $maintenances = Maintenance::whereYear('maintenance_date', Carbon::now()->year)
        ->get();
        $totalAmount = $maintenances->sum('amount');

        $monthlyAmounts = [];
    foreach ($maintenances as $maintenance) {
        $month = Carbon::parse($maintenance->maintenance_date)->format('M');
        if (!isset($monthlyAmounts[$month])) {
            $monthlyAmounts[$month] = 0;
        }
        $monthlyAmounts[$month] += $maintenance->amount;
    }

    $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $series = [];
    foreach ($months as $month) {
        $series[] = $monthlyAmounts[$month] ?? 0;
    }

    return response()->json([
        'total' => $totalAmount,
        'categories' => $months,
        'series' => $series,
    ]);
}


public function getRevenueByCategory()
{
    $revenues = DB::table('cars')
        ->join('revenues', 'cars.id', '=', 'revenues.id') 
        ->select('cars.category', DB::raw('SUM(revenues.amount) as total'))
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
public function getRevenuesAndLosses()
{
    $revenues = DB::table('revenues')
        ->select(DB::raw("SUM(amount) as total"), DB::raw("DATE_FORMAT(period, '%b') as month"))
        ->groupBy('month')
        ->orderBy(DB::raw("STR_TO_DATE(month, '%b')"), 'asc')
        ->get();

    $losses = DB::table('maintenances')
        ->select(DB::raw("SUM(amount) as total"), DB::raw("DATE_FORMAT(maintenance_date, '%b') as month"))
        ->groupBy('month')
        ->orderBy(DB::raw("STR_TO_DATE(month, '%b')"), 'asc')
        ->get();

    $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $revenueData = array_fill_keys($months, 0);
    foreach ($revenues as $revenue) {
        $revenueData[$revenue->month] = $revenue->total;
    }

    $lossData = array_fill_keys($months, 0);
    foreach ($losses as $loss) {
        $lossData[$loss->month] = $loss->total;
    }

    return response()->json([
        'categories' => $months,
        'series' => [
            ['name' => 'Revenus', 'data' => array_values($revenueData)],
            ['name' => 'Pertes', 'data' => array_values($lossData)],
        ],
    ]);
}

}
