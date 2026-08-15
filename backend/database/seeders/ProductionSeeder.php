<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use App\Models\ProductionHistory;
use App\Models\ProductionProgress;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $productionUser = User::where('role', 'production')->first();

        $orderItem = OrderItem::with('product')
            ->whereHas('order', function ($query) {
                $query->where('order_number', 'ORD-001');
            })
            ->whereHas('product', function ($query) {
                $query->where('product_code', 'PRD-001');
            })
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Current Production Progress
        |--------------------------------------------------------------------------
        */

        $progresses = [
            [
                'stage' => 'cutting',
                'quantity' => 500,
                'good_quantity' => 500,
                'reject_quantity' => 0,
            ],
            [
                'stage' => 'sewing',
                'quantity' => 450,
                'good_quantity' => 450,
                'reject_quantity' => 0,
            ],
            [
                'stage' => 'qc',
                'quantity' => 400,
                'good_quantity' => 360,
                'reject_quantity' => 40,
            ],
            [
                'stage' => 'finishing',
                'quantity' => 380,
                'good_quantity' => 380,
                'reject_quantity' => 0,
            ],
            [
                'stage' => 'packing',
                'quantity' => 300,
                'good_quantity' => 300,
                'reject_quantity' => 0,
            ],
        ];

        foreach ($progresses as $progress) {
            ProductionProgress::create([
                'order_item_id' => $orderItem->id,
                'stage' => $progress['stage'],
                'quantity' => $progress['quantity'],
                'good_quantity' => $progress['good_quantity'],
                'reject_quantity' => $progress['reject_quantity'],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Production History
        |--------------------------------------------------------------------------
        */

        ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $productionUser->id,
            'stage' => 'cutting',
            'quantity' => 500,
            'good_quantity' => 500,
            'reject_quantity' => 0,
            'action' => 'process',
            'notes' => 'Proses cutting sebanyak 500 pcs.',
        ]);

        ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $productionUser->id,
            'stage' => 'sewing',
            'quantity' => 450,
            'good_quantity' => 450,
            'reject_quantity' => 0,
            'action' => 'process',
            'notes' => 'Proses sewing sebanyak 450 pcs.',
        ]);

        ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $productionUser->id,
            'stage' => 'qc',
            'quantity' => 400,
            'good_quantity' => 360,
            'reject_quantity' => 40,
            'action' => 'process',
            'notes' => 'QC menemukan 40 pcs reject.',
        ]);

        ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $productionUser->id,
            'stage' => 'sewing',
            'quantity' => 40,
            'good_quantity' => 40,
            'reject_quantity' => 0,
            'action' => 'rework',
            'notes' => 'Rework 40 pcs reject dari proses QC.',
        ]);

        ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $productionUser->id,
            'stage' => 'finishing',
            'quantity' => 380,
            'good_quantity' => 380,
            'reject_quantity' => 0,
            'action' => 'process',
            'notes' => 'Proses finishing sebanyak 380 pcs.',
        ]);

        ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $productionUser->id,
            'stage' => 'packing',
            'quantity' => 300,
            'good_quantity' => 300,
            'reject_quantity' => 0,
            'action' => 'process',
            'notes' => 'Proses packing sebanyak 300 pcs.',
        ]);
    }
}
