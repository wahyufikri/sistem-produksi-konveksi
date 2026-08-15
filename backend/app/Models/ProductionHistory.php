<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionHistory extends Model
{
    protected $fillable = [
        'order_item_id',
        'created_by',
        'stage',
        'quantity',
        'good_quantity',
        'reject_quantity',
        'action',
        'notes',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
