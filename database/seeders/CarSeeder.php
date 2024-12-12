<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CarSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $cars = [
            [
                'model' => 'Corolla',
                'brand' => 'Toyota',
                'color' => 'Red',
                'mileage' => 20000,
                'fuel_type' => 'essence',
                'fuel_level' => 'Full',
                'transmission' => 'automatique',
                'location' => 'New York',
                'year' => 2020,
                'matricule' => 'ABC1234',
                'price_per_day' => 25.00,
                'category' => 'Economy',
                'status' => 'disponible',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'model' => 'Focus',
                'brand' => 'Ford',
                'color' => 'Blue',
                'mileage' => 15000,
                'fuel_type' => 'diesel',
                'fuel_level' => 'Half',
                'transmission' => 'manuelle',
                'location' => 'Chicago',
                'year' => 2019,
                'matricule' => 'XYZ5678',
                'price_per_day' => 30.00,
                'category' => 'SUV',
                'status' => 'disponible',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'model' => 'Civic',
                'brand' => 'Honda',
                'color' => 'Black',
                'mileage' => 10000,
                'fuel_type' => 'électrique',
                'fuel_level' => 'Full',
                'transmission' => 'automatique',
                'location' => 'Los Angeles',
                'year' => 2021,
                'matricule' => 'LMN9012',
                'price_per_day' => 55.00,
                'category' => 'Luxury',
                'status' => 'disponible',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'model' => 'Camry',
                'brand' => 'Toyota',
                'color' => 'White',
                'mileage' => 5000,
                'fuel_type' => 'hybride',
                'fuel_level' => 'Low',
                'transmission' => 'automatique',
                'location' => 'Miami',
                'year' => 2022,
                'matricule' => 'DEF3456',
                'price_per_day' => 65.00,
                'category' => 'Sedan',
                'status' => 'disponible',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'model' => 'X5',
                'brand' => 'BMW',
                'color' => 'Silver',
                'mileage' => 40000,
                'fuel_type' => 'diesel',
                'fuel_level' => 'Full',
                'transmission' => 'manuelle',
                'location' => 'Dallas',
                'year' => 2018,
                'matricule' => 'GHI7890',
                'price_per_day' => 70.00,
                'category' => 'Van',
                'status' => 'disponible',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
        foreach ($cars as $car) {
            DB::table('cars')->insert($car);
        }
    }
}