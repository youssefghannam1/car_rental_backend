<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'client_id',
        'car_id',
        'amount',
        'date_issued',
        'due_date',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    public function car()
    {
        return $this->belongsTo(Car::class);
    }

   
}
