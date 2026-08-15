<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = Customer::where('name', 'PT ABC')->first();

        $kaos = Product::where('product_code', 'PRD-001')->first();
        $hoodie = Product::where('product_code', 'PRD-002')->first();
        $polo = Product::where('product_code', 'PRD-003')->first();

        $order = Order::create([
            'order_number' => 'ORD-001',
            'customer_id' => $customer->id,
            'order_date' => '2026-08-07',
            'deadline' => '2026-08-20',
            'status' => 'in_progress',
        ]);

        $order->items()->createMany([
            [
                'product_id' => $kaos->id,
                'quantity' => 500,
            ],
            [
                'product_id' => $hoodie->id,
                'quantity' => 300,
            ],
            [
                'product_id' => $polo->id,
                'quantity' => 200,
            ],
        ]);
    }
}
