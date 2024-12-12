<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ClientSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $fullnames = [
            'Billy Stoltenberg',
            'Eloise Ebert',
            'Teresa Luettgen',
            'Salvador Mayert',
            'Dr. Guadalupe Rath',
            'Kelvin Pouros',
            'Thelma Langworth',
            'Kristen Wunsch',
            'Steve Welch',
            'Brian Jacobs',
            'Lillie Schultz',
            'Mr. Conrad Spinka',
            'Charlene Krajcik',
            'Kerry Kuhlman',
            'Betty Hammes',
            'Tony Paucek PhD',
            'Sherri Davis',
            'Angel Rolfson-Kulas',
            'Dr. Lee Doyle-Grant',
            'Cheryl Romaguera',
            'Billy Braun',
            'Adam Trantow',
            'Brandon Von',
            'Willis Ankunding',
        ];

        $ages = [
            25, 40, 31, 27, 30, 39, 37, 43, 29, 26,
            31, 28, 41, 34, 40, 33, 36, 42, 35, 39,
            27, 28, 32, 41
        ];

        $telephones = [
            '0612345678', '0623456789', '0634567890', '0645678901',
            '0656789012', '0667890123', '0678901234', '0689012345',
            '0690123456', '0601234567', '0612345679', '0623456780',
            '0634567891', '0645678902', '0656789013', '0667890124',
            '0678901235', '0689012346', '0690123457', '0601234568',
            '0612345670', '0623456781', '0634567892', '0645678903'
        ];

        $cins = [
            'AB123456', 'BC234567', 'CD345678', 'DE456789',
            'EF567890', 'FG678901', 'GH789012', 'HI890123',
            'IJ901234', 'JK012345', 'KL123456', 'LM234567',
            'MN345678', 'NO456789', 'OP567890', 'PQ678901',
            'QR789012', 'RS890123', 'ST901234', 'TU012345',
            'UV123456', 'WX234567', 'XY345678', 'YZ456789'
        ];

        foreach ($fullnames as $index => $fullname) {
            Client::create([
                'full_name' => $fullname,
                'age' => $ages[$index],
                'days' => 2,
                'date_debut' => $now,
                'total_price' => 100002,
                'date_fin' => $now,
                'telephone' => $telephones[$index],
                'cin' => $cins[$index],
                'status' => 'en attente',
            ]);
        }
        DB::table('client_car')->insert([
            'client_id' => 1,
            'car_id' => 2
        ]); 
        DB::table('client_car')->insert([
            'client_id' => 1,
            'car_id' => 1
        ]);
    }
}
