<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('sku')->nullable()->unique();
            $table->decimal('price', 14, 2)->default(0);
            $table->decimal('sale_price', 14, 2)->nullable();
            $table->string('ram')->nullable();
            $table->string('rom')->nullable();
            $table->string('badge')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('status')->default('active')->index();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_variants');
    }
};
