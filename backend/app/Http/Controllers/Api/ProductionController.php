<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductionProgressRequest;
use App\Http\Resources\ProductionProgressResource;
use App\Models\OrderItem;
use App\Models\ProductionHistory;
use App\Models\ProductionProgress;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Http\Requests\ReworkProductionRequest;

class ProductionController extends Controller
{
    /**
     * Get production progress for an order item.
     */
    public function show(OrderItem $orderItem)
    {
        $orderItem->load([
            'order.customer',
            'product',
            'productionProgresses',
        ]);

        return response()->json([
            'data' => [
                'order_item' => [
                    'id' => $orderItem->id,
                    'order_number' => $orderItem->order->order_number,
                    'product' => [
                        'id' => $orderItem->product->id,
                        'code' => $orderItem->product->product_code,
                        'name' => $orderItem->product->name,
                    ],
                    'order_quantity' => $orderItem->quantity,
                ],

                'progress' => ProductionProgressResource::collection(
                    $orderItem->productionProgresses
                ),
            ],
        ]);
    }

    /**
     * Update production progress.
     */
    public function update(
        UpdateProductionProgressRequest $request,
        OrderItem $orderItem
    ) {
        $data = $request->validated();

        $progress = DB::transaction(function () use (
            $request,
            $orderItem,
            $data
        ) {

            $progress = ProductionProgress::updateOrCreate(
                [
                    'order_item_id' => $orderItem->id,
                    'stage' => $data['stage'],
                ],
                [
                    'quantity' => $data['quantity'],
                    'good_quantity' => $data['good_quantity'],
                    'reject_quantity' => $data['reject_quantity'],
                ]
            );

            ProductionHistory::create([
                'order_item_id' => $orderItem->id,
                'created_by' => $request->user()->id,
                'stage' => $data['stage'],
                'quantity' => $data['quantity'],
                'good_quantity' => $data['good_quantity'],
                'reject_quantity' => $data['reject_quantity'],
                'notes' => $data['notes'] ?? null,

            ]);

            $this->updateOrderStatus($orderItem);

            return $progress;
        });

        return response()->json([
            'message' => 'Progress produksi berhasil diperbarui.',
            'data' => new ProductionProgressResource($progress),
        ]);
    }

    /**
     * Update order status based on production.
     */
    private function updateOrderStatus(OrderItem $orderItem): void
    {
        $order = $orderItem->order;

        $totalItems = $order->items()->count();

        $completedItems = $order->items()
            ->whereHas('productionProgresses', function ($query) {
                $query->where('stage', 'completed')
                    ->whereColumn(
                        'good_quantity',
                        'quantity'
                    );
            })
            ->count();

        if ($completedItems === $totalItems) {
            $order->update([
                'status' => 'completed',
            ]);

            return;
        }

        $hasProgress = $order->items()
            ->whereHas('productionProgresses')
            ->exists();

        if ($hasProgress) {
            $order->update([
                'status' => 'in_progress',
            ]);
        }
    }

    public function orders()
{
    $orders = Order::with([
        'customer',
        'items.product',
        'items.productionProgresses',
    ])
    ->where('status', 'in_progress')
    ->latest()
    ->paginate(10);

    return \App\Http\Resources\OrderResource::collection($orders);
}
public function rework(
    ReworkProductionRequest $request,
    OrderItem $orderItem
) {
    $data = $request->validated();

    $result = DB::transaction(function () use (
        $request,
        $orderItem,
        $data
    ) {

        // Cari progress dari tahap asal
        $sourceProgress = ProductionProgress::where(
            'order_item_id',
            $orderItem->id
        )
        ->where('stage', $data['from_stage'])
        ->first();

        if (!$sourceProgress) {
            abort(422, 'Progress tahap asal belum tersedia.');
        }

        // Pastikan quantity reject mencukupi
        if ($data['quantity'] > $sourceProgress->reject_quantity) {
            abort(
                422,
                'Quantity rework melebihi quantity reject yang tersedia.'
            );
        }

        // Kurangi reject yang masih tersedia
        $sourceProgress->decrement(
            'reject_quantity',
            $data['quantity']
        );

        // Simpan histori rework
        $history = ProductionHistory::create([
            'order_item_id' => $orderItem->id,
            'created_by' => $request->user()->id,

            'type' => 'rework',

            'stage' => $data['to_stage'],

            'from_stage' => $data['from_stage'],
            'to_stage' => $data['to_stage'],

            'quantity' => $data['quantity'],

            'good_quantity' => 0,
            'reject_quantity' => 0,

            'notes' => $data['notes'] ?? null,


        ]);

        return $history;
    });

    return response()->json([
        'message' => 'Rework berhasil dicatat.',
        'data' => [
            'id' => $result->id,
            'type' => $result->type,
            'from_stage' => $result->from_stage,
            'to_stage' => $result->to_stage,
            'quantity' => $result->quantity,
            'notes' => $result->notes,

        ],
    ], 201);
}

public function history(OrderItem $orderItem)
{
    $histories = ProductionHistory::where(
        'order_item_id',
        $orderItem->id
    )
    ->with('user:id,name')
    
    ->get();

    return response()->json([
        'data' => $histories->map(function ($history) {
            return [
                'id' => $history->id,
                'type' => $history->type,
                'stage' => $history->stage,
                'from_stage' => $history->from_stage,
                'to_stage' => $history->to_stage,
                'quantity' => $history->quantity,
                'good_quantity' => $history->good_quantity,
                'reject_quantity' => $history->reject_quantity,
                'notes' => $history->notes,
                'processed_by' => $history->user?->name,
            ];
        }),
    ]);
}
}
