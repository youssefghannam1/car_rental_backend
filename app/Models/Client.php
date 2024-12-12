<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'age',
        'telephone',
        'cin',
        'days',
        'total_price',
        'date_debut',
        'date_fin',
        'status'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class, 'client_car');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
