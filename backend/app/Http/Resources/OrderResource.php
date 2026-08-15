<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,

            'customer' => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'phone' => $this->customer->phone,
            ],

            'order_date' => $this->order_date?->format('Y-m-d'),
            'deadline' => $this->deadline?->format('Y-m-d'),
            'status' => $this->status,

            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'product_code' => $item->product->product_code,
                        'name' => $item->product->name,
                        'type' => $item->product->type,
                        'color' => $item->product->color,
                        'size' => $item->product->size,
                    ],
                    'quantity' => $item->quantity,
                ];
            }),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
