<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display orders.
     */
    public function index(Request $request)
    {
        $orders = Order::with([
                'customer',
                'items.product',
            ])
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(
                    'order_number',
                    'like',
                    '%' . $request->search . '%'
                );
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    /**
     * Store order with items.
     */
    public function store(StoreOrderRequest $request)
    {
        $order = DB::transaction(function () use ($request) {

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_id' => $request->customer_id,
                'order_date' => $request->order_date,
                'deadline' => $request->deadline,
                'status' => 'pending',
            ]);

            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $order;
        });

        $order->load([
            'customer',
            'items.product',
        ]);

        return response()->json([
            'message' => 'Order berhasil dibuat.',
            'data' => new OrderResource($order),
        ], 201);
    }

    /**
     * Display order detail.
     */
    public function show(Order $order)
    {
        $order->load([
            'customer',
            'items.product',
            'items.productionProgresses',
        ]);

        return new OrderResource($order);
    }

    /**
     * Update order.
     */
    public function update(
        UpdateOrderRequest $request,
        Order $order
    ) {
        $order = DB::transaction(function () use ($request, $order) {

            $order->update([
                'customer_id' => $request->customer_id,
                'order_date' => $request->order_date,
                'deadline' => $request->deadline,
                'status' => $request->status,
            ]);

            $order->items()->delete();

            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $order;
        });

        $order->load([
            'customer',
            'items.product',
        ]);

        return response()->json([
            'message' => 'Order berhasil diperbarui.',
            'data' => new OrderResource($order),
        ]);
    }

    /**
     * Delete order.
     */
    public function destroy(Order $order)
    {
        if ($order->status !== 'pending') {
            return response()->json([
                'message' =>
                    'Order yang sudah diproses tidak dapat dihapus.',
            ], 409);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order berhasil dihapus.',
        ]);
    }

    /**
     * Generate order number.
     */
    private function generateOrderNumber(): string
    {
        $lastOrder = Order::latest('id')->first();

        $nextNumber = $lastOrder
            ? $lastOrder->id + 1
            : 1;

        return 'ORD-' . str_pad(
            $nextNumber,
            3,
            '0',
            STR_PAD_LEFT
        );
    }
}
