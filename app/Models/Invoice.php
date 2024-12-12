<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    // Other properties and methods

    // Define the relationship with the Client model
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
