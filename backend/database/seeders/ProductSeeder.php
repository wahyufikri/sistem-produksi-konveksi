<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'product_code' => 'PRD-001',
            'name' => 'Kaos Oversize',
            'type' => 'Kaos',
            'color' => 'Hitam',
            'size' => 'XL',
        ]);

        Product::create([
            'product_code' => 'PRD-002',
            'name' => 'Hoodie',
            'type' => 'Hoodie',
            'color' => 'Hitam',
            'size' => 'L',
        ]);

        Product::create([
            'product_code' => 'PRD-003',
            'name' => 'Polo Shirt',
            'type' => 'Polo',
            'color' => 'Putih',
            'size' => 'L',
        ]);

        Product::create([
            'product_code' => 'PRD-004',
            'name' => 'Kaos Regular',
            'type' => 'Kaos',
            'color' => 'Putih',
            'size' => 'M',
        ]);

        Product::create([
            'product_code' => 'PRD-005',
            'name' => 'Jaket Bomber',
            'type' => 'Jaket',
            'color' => 'Navy',
            'size' => 'XL',
        ]);
    }
}
