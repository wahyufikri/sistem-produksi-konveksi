<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionProgress extends Model
{
    protected $table = 'production_progresses';
    protected $fillable = [
        'order_item_id',
        'stage',
        'quantity',
        'good_quantity',
        'reject_quantity',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
