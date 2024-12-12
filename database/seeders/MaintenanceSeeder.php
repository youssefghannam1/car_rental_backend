<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MaintenanceSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $maintenances = [
            [
                'car_id' => 1,
                'maintenance_date' => '2024-11-15',
                'details' => 'Oil change and tire rotation',
                'amount' => 100 ,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'car_id' => 2,
                'maintenance_date' => '2024-11-20',
                'details' => 'Brake pad replacement',
                'amount' => 200 ,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'car_id' => 3,
                'maintenance_date' => '2024-11-25',
                'details' => 'Full engine check and fluid top-up',
                'amount' => 150 ,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($maintenances as $maintenance) {
            DB::table('maintenances')->insert($maintenance);
        }
    }
}
