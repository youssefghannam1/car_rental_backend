<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Inserting 10 tasks
        DB::table('tasks')->insert([
            ['name' => 'Task 1'],
            ['name' => 'Task 2'],
            ['name' => 'Task 3'],
            ['name' => 'Task 4'],
            ['name' => 'Task 5'],
            ['name' => 'Task 6'],
            ['name' => 'Task 7'],
            ['name' => 'Task 8'],
            ['name' => 'Task 9'],
            ['name' => 'Task 10'],
        ]);
    }
}
