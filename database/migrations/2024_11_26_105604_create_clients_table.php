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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->integer('age')->nullable();
            $table->string('telephone')->nullable();
            $table->string('cin')->nullable()->unique();
            $table->integer('days');
            $table->decimal('total_price');
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->enum('status', ['retournée', 'en attente'])->default('en attente');
            $table->timestamps(); 
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
