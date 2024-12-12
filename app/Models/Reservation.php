<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'car_id', 'start_date', 'end_date', 'status', 'price'];

     public function client()
    {
        return $this->belongsTo(Client::class);
    }

     public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
