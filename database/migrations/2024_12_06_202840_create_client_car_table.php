<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientCarTable extends Migration
{
    public function up()
    {
        Schema::create('client_car', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('car_id'); 
            // $table->integer("days");
            // $table->date('start_date');
            // $table->date('end_date');
            $table->timestamps();
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->foreign('car_id')->references('id')->on('cars')->onDelete('cascade');
            $table->unique(['client_id', 'car_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('client_car');
    }
}
