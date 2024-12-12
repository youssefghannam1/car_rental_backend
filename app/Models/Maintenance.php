<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    protected $fillable = [
        "car_id",
        "type",
        "description",
        "maintenance_date",
        "status",
        "technician",
        "cost",
        "duration"
    ];

    public function car() {
        return $this->belongsTo(Car::class, 'car_id');
    }
}
