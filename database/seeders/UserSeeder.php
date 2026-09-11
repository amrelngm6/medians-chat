<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@domain.com'],
            [
                'password_hash' => bcrypt('Admin123'),
                'first_name' => 'Admin',
                'last_name' => 'User',
                'status' => 'active'
            ]
        );
    }
}
