<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('production_progresses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_item_id')
                ->constrained('order_items')
                ->cascadeOnDelete();

            $table->enum('stage', [
                'cutting',
                'sewing',
                'qc',
                'finishing',
                'packing',
            ]);

            $table->unsignedInteger('quantity')->default(0);

            $table->unsignedInteger('good_quantity')->default(0);

            $table->unsignedInteger('reject_quantity')->default(0);

            $table->timestamps();

            $table->unique(['order_item_id', 'stage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_progresses');
    }
};
