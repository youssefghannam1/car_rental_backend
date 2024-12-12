<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use Carbon\Carbon;
use App\Models\Client;
use App\Models\Car;

class InvoiceSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        // Sample invoice data
        $clients = Client::all();
        $cars = Car::all();

        $amounts = [
            100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
            1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000
        ];

        $statuses = ['paid', 'unpaid'];

        foreach ($clients as $index => $client) {
            Invoice::create([
                'client_id' => $client->id,
                'car_id' => $cars->random()->id,  // Randomly assign a car
                'amount' => $amounts[$index % count($amounts)], // Cycle through the amounts
                'date_issued' => $now,
                'due_date' => $now->addWeeks(1),  // 1 week from today
                'status' => $statuses[array_rand($statuses)], // Randomly select status
            ]);
        }
    }
}
