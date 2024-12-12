<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RevenueSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $revenues = [
            [
                'amount' => 1500.00,
                'period' => 'January 2024',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'amount' => 1750.00,
                'period' => 'February 2024',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'amount' => 2000.00,
                'period' => 'March 2024',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($revenues as $revenue) {
            DB::table('revenues')->insert($revenue);
        }
    }
}
