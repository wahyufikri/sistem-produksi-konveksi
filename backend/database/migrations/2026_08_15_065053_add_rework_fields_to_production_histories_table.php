<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('production_histories', function (Blueprint $table) {
            $table->enum('type', [
                'production',
                'rework',
            ])->default('production')->after('created_by');

            $table->string('from_stage')->nullable()->after('type');

            $table->string('to_stage')->nullable()->after('from_stage');
        });
    }

    public function down(): void
    {
        Schema::table('production_histories', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'from_stage',
                'to_stage',
            ]);
        });
    }
};
