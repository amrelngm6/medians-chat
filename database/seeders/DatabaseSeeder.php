<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Database\Seeders\PersonalContentSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // You can call multiple seeders too
        $this->call([
            UserSeeder::class,
            PersonalContentSeeder::class,
            SettingsSeeder::class,
        ]);

    }
}
