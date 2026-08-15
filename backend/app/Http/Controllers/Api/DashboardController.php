<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\ProductionProgress;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = now()->toDateString();

        $totalCustomer = Customer::count();

        $totalOrder = Order::count();

        $orderBerjalan = Order::where(
            'status',
            'in_progress'
        )->count();

        $orderSelesai = Order::where(
            'status',
            'completed'
        )->count();

        $orderTerlambat = Order::where(
            'deadline',
            '<',
            $today
        )
        ->whereNotIn('status', [
            'completed',
            'cancelled',
        ])
        ->count();

        $productionStages = [
            'cutting',
            'sewing',
            'qc',
            'finishing',
            'packing',
            'completed',
        ];

        $production = [];

        foreach ($productionStages as $stage) {

            $data = ProductionProgress::where(
                'stage',
                $stage
            )->selectRaw('
                COUNT(*) as total_items,
                COALESCE(SUM(quantity), 0) as total_quantity,
                COALESCE(SUM(good_quantity), 0) as total_good_quantity,
                COALESCE(SUM(reject_quantity), 0) as total_reject_quantity
            ')
            ->first();

            $production[$stage] = [
                'total_items' => (int) $data->total_items,
                'quantity' => (int) $data->total_quantity,
                'good_quantity' => (int) $data->total_good_quantity,
                'reject_quantity' => (int) $data->total_reject_quantity,
            ];
        }

        return response()->json([
            'data' => [
                'summary' => [
                    'total_customer' => $totalCustomer,
                    'total_order' => $totalOrder,
                    'order_berjalan' => $orderBerjalan,
                    'order_selesai' => $orderSelesai,
                    'order_terlambat' => $orderTerlambat,
                ],

                'production' => $production,

                'generated_at' => now()->toISOString(),
            ],
        ]);
    }

    public function overdueOrders()
{
    $orders = Order::with([
        'customer',
        'items.product',
    ])
    ->where(
        'deadline',
        '<',
        now()->toDateString()
    )
    ->whereNotIn('status', [
        'completed',
        'cancelled',
    ])
    ->latest('deadline')
    ->paginate(10);

    return \App\Http\Resources\OrderResource::collection($orders);
}
}
