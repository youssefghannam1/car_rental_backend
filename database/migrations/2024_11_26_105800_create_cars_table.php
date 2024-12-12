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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('model')->nullable();
            $table->string('brand')->nullable();
            $table->string('color');
            $table->integer('mileage')->nullable();
            $table->enum('fuel_type', ['essence', 'diesel', 'électrique', 'hybride']);
            $table->string('fuel_level')->nullable();
            $table->enum('transmission',['automatique', 'manuelle']);
            $table->string('location')->nullable();
            $table->year('year')->nullable();
            $table->string('matricule')->unique()->nullable();;
            $table->decimal('price_per_day');
            $table->enum('category', ['Economy', 'SUV', 'Luxury', 'Sedan', 'Van', 'Coupe'])->nullable();
            $table->enum('status', ['disponible', 'pas disponible', 'maintenance']);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
