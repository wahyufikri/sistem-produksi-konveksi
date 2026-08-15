<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        Customer::create([
            'name' => 'PT ABC',
            'phone' => '081234567890',
            'address' => 'Jl. Industri No. 10, Padang',
        ]);

        Customer::create([
            'name' => 'PT XYZ',
            'phone' => '082345678901',
            'address' => 'Jl. Raya Produksi No. 25, Jakarta',
        ]);

        Customer::create([
            'name' => 'CV Maju Bersama',
            'phone' => '083456789012',
            'address' => 'Jl. Merdeka No. 15, Bandung',
        ]);
    }
}
