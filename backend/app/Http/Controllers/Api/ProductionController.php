<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductionProgressRequest;
use App\Http\Requests\ReworkProductionRequest;
use App\Http\Requests\ProcessReworkRequest;
use App\Http\Resources\ProductionProgressResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductionHistory;
use App\Models\ProductionProgress;
use Illuminate\Support\Facades\DB;

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

        /*
        |--------------------------------------------------------------------------
        | Hitung barang yang sudah dikirim ke rework
        |--------------------------------------------------------------------------
        */

        $sentToRework = ProductionHistory::where(
            'order_item_id',
            $orderItem->id
        )
            ->where('type', 'rework')
            ->where('action', 'send_to_rework')
            ->where('from_stage', 'qc')
            ->where('to_stage', 'sewing')
            ->sum('quantity');

        /*
        |--------------------------------------------------------------------------
        | Hitung barang yang sudah diproses kembali di Sewing
        |--------------------------------------------------------------------------
        */

        $processedRework = ProductionHistory::where(
            'order_item_id',
            $orderItem->id
        )
            ->where('type', 'rework')
            ->where('action', 'process_rework')
            ->where('stage', 'sewing')
            ->sum('quantity');

        /*
        |--------------------------------------------------------------------------
        | Barang yang masih menunggu rework
        |--------------------------------------------------------------------------
        */

        $pendingRework = max(
            0,
            $sentToRework - $processedRework
        );

        return response()->json([
            'data' => [

                /*
                |--------------------------------------------------------------------------
                | Order Item
                |--------------------------------------------------------------------------
                */

                'order_item' => [
                    'id' => $orderItem->id,

                    'order_number' =>
                        $orderItem->order->order_number,

                    'product' => [
                        'id' => $orderItem->product->id,

                        'code' =>
                            $orderItem->product->product_code,

                        'name' =>
                            $orderItem->product->name,
                    ],

                    'order_quantity' =>
                        $orderItem->quantity,
                ],

                /*
                |--------------------------------------------------------------------------
                | Progress Produksi
                |--------------------------------------------------------------------------
                */

                'progress' =>
                    ProductionProgressResource::collection(
                        $orderItem->productionProgresses
                    ),

                /*
                |--------------------------------------------------------------------------
                | Rework
                |--------------------------------------------------------------------------
                */

                'pending_rework' => $pendingRework,

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

        $previousStage = $this->getPreviousStage(
            $data['stage']
        );

        /*
        |--------------------------------------------------------------------------
        | Validasi tahap sebelumnya
        |--------------------------------------------------------------------------
        */

        if ($previousStage) {

            $previousProgress = ProductionProgress::where(
                'order_item_id',
                $orderItem->id
            )
                ->where(
                    'stage',
                    $previousStage
                )
                ->first();

            if (!$previousProgress) {

                return response()->json([
                    'message' =>
                        "Tahap {$previousStage} belum diproses."
                ], 422);
            }

            if (
                $data['quantity'] >
                $previousProgress->good_quantity
            ) {

                return response()->json([
                    'message' =>
                        "Quantity tidak boleh melebihi good quantity dari tahap {$previousStage}."
                ], 422);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Validasi Cutting
        |--------------------------------------------------------------------------
        */

        if ($data['stage'] === 'cutting') {

            if (
                $data['quantity'] >
                $orderItem->quantity
            ) {

                return response()->json([
                    'message' =>
                        'Quantity cutting tidak boleh melebihi quantity order.'
                ], 422);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Validasi Good + Reject
        |--------------------------------------------------------------------------
        */

        if (
            (
                (int) $data['good_quantity'] +
                (int) $data['reject_quantity']
            )
            !==
            (int) $data['quantity']
        ) {

            return response()->json([
                'message' =>
                    'Good + Reject harus sama dengan Quantity.'
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Simpan Progress + History
        |--------------------------------------------------------------------------
        */

        $progress = DB::transaction(function () use (
            $request,
            $orderItem,
            $data,
            $previousStage
        ) {

            /*
            |--------------------------------------------------------------------------
            | Production Progress
            |--------------------------------------------------------------------------
            */

            $progress = ProductionProgress::updateOrCreate(
                [
                    'order_item_id' =>
                        $orderItem->id,

                    'stage' =>
                        $data['stage'],
                ],
                [
                    'quantity' =>
                        $data['quantity'],

                    'good_quantity' =>
                        $data['good_quantity'],

                    'reject_quantity' =>
                        $data['reject_quantity'],
                ]
            );

            /*
            |--------------------------------------------------------------------------
            | Production History
            |--------------------------------------------------------------------------
            */

            ProductionHistory::create([
                'order_item_id' =>
                    $orderItem->id,

                'created_by' =>
                    $request->user()->id,

                'type' =>
                    'production',

                'from_stage' =>
                    $previousStage,

                'to_stage' =>
                    $data['stage'],

                'stage' =>
                    $data['stage'],

                'quantity' =>
                    $data['quantity'],

                'good_quantity' =>
                    $data['good_quantity'],

                'reject_quantity' =>
                    $data['reject_quantity'],

                /*
                |--------------------------------------------------------------------------
                | PENTING
                |--------------------------------------------------------------------------
                */

                'action' =>
                    'process',

                'notes' =>
                    $data['notes'] ?? null,
            ]);

            $this->updateOrderStatus($orderItem);

            return $progress;
        });

        return response()->json([
            'message' =>
                'Progress produksi berhasil diperbarui.',

            'data' =>
                new ProductionProgressResource($progress),
        ]);
    }


    /**
     * Update order status based on production.
     */
    private function updateOrderStatus(
        OrderItem $orderItem
    ): void {

        $order = $orderItem->order;

        $totalItems =
            $order->items()->count();

        $completedItems =
            $order->items()
                ->whereHas(
                    'productionProgresses',
                    function ($query) {

                        $query
                            ->where(
                                'stage',
                                'completed'
                            )
                            ->whereColumn(
                                'good_quantity',
                                'quantity'
                            );
                    }
                )
                ->count();

        if (
            $completedItems ===
            $totalItems
        ) {

            $order->update([
                'status' => 'completed',
            ]);

            return;
        }

        $hasProgress =
            $order->items()
                ->whereHas(
                    'productionProgresses'
                )
                ->exists();

        if ($hasProgress) {

            $order->update([
                'status' => 'in_progress',
            ]);
        }
    }


    /**
     * Get production orders.
     */
    public function orders()
    {
        $orders = Order::with([
            'customer',
            'items.product',
            'items.productionProgresses',
        ])
            ->where(
                'status',
                'in_progress'
            )
            ->latest()
            ->paginate(10);

        return \App\Http\Resources\OrderResource::collection(
            $orders
        );
    }


    /**
     * Send rejected goods to rework.
     *
     * IMPORTANT:
     * Method ini TIDAK mengurangi reject_quantity
     * pada ProductionProgress.
     *
     * ProductionProgress tetap menyimpan hasil
     * aktual dari proses QC.
     */
    public function rework(
        ReworkProductionRequest $request,
        OrderItem $orderItem
    ) {

        $data = $request->validated();

        $result = DB::transaction(
            function () use (
                $request,
                $orderItem,
                $data
            ) {

                /*
                |--------------------------------------------------------------------------
                | Cari progress tahap asal
                |--------------------------------------------------------------------------
                */

                $sourceProgress =
                    ProductionProgress::where(
                        'order_item_id',
                        $orderItem->id
                    )
                        ->where(
                            'stage',
                            $data['from_stage']
                        )
                        ->first();

                if (!$sourceProgress) {

                    abort(
                        422,
                        'Progress tahap asal belum tersedia.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Pastikan quantity tidak melebihi reject QC
                |--------------------------------------------------------------------------
                */

                if (
                    $data['quantity'] >
                    $sourceProgress->reject_quantity
                ) {

                    abort(
                        422,
                        'Quantity rework melebihi quantity reject yang tersedia.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Simpan history pengiriman ke rework
                |--------------------------------------------------------------------------
                |
                | TIDAK melakukan decrement reject_quantity.
                |
                */

                return ProductionHistory::create([
                    'order_item_id' =>
                        $orderItem->id,

                    'created_by' =>
                        $request->user()->id,

                    'type' =>
                        'rework',

                    'stage' =>
                        $data['to_stage'],

                    'from_stage' =>
                        $data['from_stage'],

                    'to_stage' =>
                        $data['to_stage'],

                    'quantity' =>
                        $data['quantity'],

                    'good_quantity' =>
                        0,

                    'reject_quantity' =>
                        0,

                    'action' =>
                        'send_to_rework',

                    'notes' =>
                        $data['notes'] ?? null,
                ]);
            }
        );

        return response()->json([
            'message' =>
                'Rework berhasil dicatat.',

            'data' => [
                'id' =>
                    $result->id,

                'type' =>
                    $result->type,

                'from_stage' =>
                    $result->from_stage,

                'to_stage' =>
                    $result->to_stage,

                'quantity' =>
                    $result->quantity,

                'action' =>
                    $result->action,

                'notes' =>
                    $result->notes,
            ],
        ], 201);
    }


    /**
     * Get production history.
     */
    public function history(OrderItem $orderItem)
    {
        $histories =
            ProductionHistory::where(
                'order_item_id',
                $orderItem->id
            )
                ->with('user:id,name')
                ->latest()
                ->get();

        return response()->json([
            'data' =>
                $histories->map(
                    function ($history) {

                        return [

                            'id' =>
                                $history->id,

                            'type' =>
                                $history->type,

                            'stage' =>
                                $history->stage,

                            'from_stage' =>
                                $history->from_stage,

                            'to_stage' =>
                                $history->to_stage,

                            'quantity' =>
                                $history->quantity,

                            'good_quantity' =>
                                $history->good_quantity,

                            'reject_quantity' =>
                                $history->reject_quantity,

                            'action' =>
                                $history->action,

                            'notes' =>
                                $history->notes,

                            'processed_by' =>
                                $history->user?->name,
                        ];
                    }
                ),
        ]);
    }


    /**
     * Get previous production stage.
     */
    private function getPreviousStage(
        string $stage
    ): ?string {

        $stages = [
            'cutting',
            'sewing',
            'qc',
            'finishing',
            'packing',
        ];

        $index =
            array_search(
                $stage,
                $stages
            );

        if (
            $index === false ||
            $index === 0
        ) {

            return null;
        }

        return $stages[$index - 1];
    }


    /**
     * Process rejected goods in Sewing.
     *
     * IMPORTANT:
     *
     * Method ini TIDAK mengubah:
     *
     * - ProductionProgress Sewing
     * - ProductionProgress QC
     *
     * Semua proses rework hanya dicatat
     * melalui ProductionHistory.
     */
    public function processRework(
        ProcessReworkRequest $request,
        OrderItem $orderItem
    ) {

        $data = $request->validated();

        $quantity =
            (int) $data['quantity'];

        $goodQuantity =
            (int) $data['good_quantity'];

        $rejectQuantity =
            (int) $data['reject_quantity'];

        /*
        |--------------------------------------------------------------------------
        | Validasi Good + Reject
        |--------------------------------------------------------------------------
        */

        if (
            (
                $goodQuantity +
                $rejectQuantity
            )
            !==
            $quantity
        ) {

            return response()->json([
                'message' =>
                    'Good + Reject harus sama dengan Quantity Rework.'
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Total barang yang dikirim ke rework
        |--------------------------------------------------------------------------
        */

        $sentToRework =
            ProductionHistory::where(
                'order_item_id',
                $orderItem->id
            )
                ->where(
                    'type',
                    'rework'
                )
                ->where(
                    'action',
                    'send_to_rework'
                )
                ->where(
                    'from_stage',
                    'qc'
                )
                ->where(
                    'to_stage',
                    'sewing'
                )
                ->sum('quantity');

        /*
        |--------------------------------------------------------------------------
        | Total barang yang sudah diproses kembali
        |--------------------------------------------------------------------------
        */

        $processedRework =
            ProductionHistory::where(
                'order_item_id',
                $orderItem->id
            )
                ->where(
                    'type',
                    'rework'
                )
                ->where(
                    'action',
                    'process_rework'
                )
                ->where(
                    'stage',
                    'sewing'
                )
                ->sum('quantity');

        /*
        |--------------------------------------------------------------------------
        | Hitung pending rework
        |--------------------------------------------------------------------------
        */

        $pending =
            max(
                0,
                $sentToRework -
                $processedRework
            );

        /*
        |--------------------------------------------------------------------------
        | Validasi quantity
        |--------------------------------------------------------------------------
        */

        if (
            $quantity >
            $pending
        ) {

            return response()->json([
                'message' =>
                    "Quantity melebihi barang yang menunggu rework. Sisa {$pending} pcs."
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Simpan proses rework
        |--------------------------------------------------------------------------
        */

        $history =
            DB::transaction(
                function () use (
                    $request,
                    $orderItem,
                    $quantity,
                    $goodQuantity,
                    $rejectQuantity
                ) {

                    return ProductionHistory::create([

                        'order_item_id' =>
                            $orderItem->id,

                        'created_by' =>
                            $request->user()->id,

                        'type' =>
                            'rework',

                        'stage' =>
                            'sewing',

                        'from_stage' =>
                            'sewing',

                        'to_stage' =>
                            'sewing',

                        'quantity' =>
                            $quantity,

                        'good_quantity' =>
                            $goodQuantity,

                        'reject_quantity' =>
                            $rejectQuantity,

                        'action' =>
                            'process_rework',

                        'notes' =>
                            'Proses perbaikan barang reject di Sewing.',
                    ]);
                }
            );

        return response()->json([
            'message' =>
                'Proses rework Sewing berhasil dicatat.',

            'data' =>
                $history,
        ], 201);
    }
}
