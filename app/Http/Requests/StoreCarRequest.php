<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    public function rules()
    {
        return [
        'model' => 'required|string|max:255',
        'brand' => 'required|string|max:255',
        'color' => 'required|string|max:50',
        'mileage' => 'required|integer|min:0',
        'fuel_type' => 'required|in:essence,diesel,électrique,hybride',
        'fuel_level' => 'required|string|max:50',
        'transmission' => 'required|in:automatique,manuelle',
        'location' => 'required|string|max:255',
        'year' => 'required|integer|digits:4|min:1900|max:' . date('Y'),
        'matricule' => 'required|string|max:255|unique:cars,matricule',
        'price_per_day' => 'required|numeric|min:0',
        'category' => 'nullable|in:Economy,SUV,Luxury,Sedan,Van,Coupe',
        'status' => 'required|in:disponible,pas disponible,maintenance',
        ];
    }
}
