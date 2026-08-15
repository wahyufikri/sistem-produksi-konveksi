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
        Schema::create('production_histories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_item_id')
                ->constrained('order_items')
                ->cascadeOnDelete();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->enum('stage', [
                'cutting',
                'sewing',
                'qc',
                'finishing',
                'packing',
            ]);

            $table->unsignedInteger('quantity');

            $table->unsignedInteger('good_quantity')->default(0);

            $table->unsignedInteger('reject_quantity')->default(0);

            $table->enum('action', [
                'process',
                'rework',
            ])->default('process');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_histories');
    }
};
