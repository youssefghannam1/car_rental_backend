<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'model',
        'brand',
        'color',
        'mileage',
        'fuel_type',
        'fuel_level',
        'transmission',
        'location',
        'year',
        'matricule',
        'price_per_day',
        'category',
        'status'
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function clients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class, 'client_car');
    }

    public function maintenance() {
        return $this->hasMany(Maintenance::class, 'car_id');
    }
}
