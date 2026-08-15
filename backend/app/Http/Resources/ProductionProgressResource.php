<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionProgressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stage' => $this->stage,
            'quantity' => $this->quantity,
            'good_quantity' => $this->good_quantity,
            'reject_quantity' => $this->reject_quantity,

            'status' => $this->getStatus(),

            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    private function getStatus(): string
    {
        if ($this->stage === 'completed') {
            return 'completed';
        }

        if ($this->reject_quantity > 0) {
            return 'has_reject';
        }

        return 'completed';
    }
}
