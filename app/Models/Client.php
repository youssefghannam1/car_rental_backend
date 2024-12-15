<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Http\Controllers\InvoiceController;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'age',
        'telephone',
        'cin',
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
    protected static function booted()
    {
        static::updated(function ($reservation) {
            if ($reservation->status == 'confirmed') {
                Invoice::create([
                    'client_id' => $reservation->client_id,
                    'car_id' => $reservation->car_id,
                    'amount' => $reservation->price,
                    'date_issued' => now(),
                    'due_date' => now()->addDays(30),
                    'status' => 'pending',
                ]);
            }
        });
    }
}
