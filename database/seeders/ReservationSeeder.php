<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $reservations = [
            [
                'client_id' => 1,
                'car_id' => 1,
                'start_date' => '2024-12-01',
                'end_date' => '2024-12-07',
                'status' => 'confirmed',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'client_id' => 2,
                'car_id' => 2,
                'start_date' => '2024-12-10',
                'end_date' => '2024-12-15',
                'status' => 'pending',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'client_id' => 3,
                'car_id' => 3,
                'start_date' => '2024-12-12',
                'end_date' => '2024-12-18',
                'status' => 'confirmed',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($reservations as $reservation) {
            DB::table('reservations')->insert($reservation);
        }
    }
}
