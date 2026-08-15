<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionHistory extends Model
{
    protected $table = 'production_histories';

    protected $fillable = [
        'order_item_id',
        'created_by',
        'type',
        'stage',
        'from_stage',
        'to_stage',
        'quantity',
        'good_quantity',
        'reject_quantity',
        'notes',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
