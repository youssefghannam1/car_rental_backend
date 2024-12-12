<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarRequest extends FormRequest
{
    public function rules()
{
    return [
        'model' => 'sometimes|string|max:255',
        'brand' => 'sometimes|string|max:255',
        'color' => 'sometimes|string|max:50',
        'mileage' => 'sometimes|integer|min:0', 
        'fuel_type' => 'sometimes|in:essence,diesel,électrique,hybride',
        'fuel_level' => 'sometimes|string|max:50',
        'transmission' => 'sometimes|in:automatique,manuelle',
        'location' => 'sometimes|string|max:255',
        'year' => 'sometimes|integer|digits:4|min:1900|max:' . date('Y'),
        'matricule' => 'sometimes|string|max:255|unique:cars,matricule,' . $this->route('car'),
        'price_per_day' => 'sometimes|numeric|min:0',
        'category' => 'nullable|in:Economy,SUV,Luxury,Sedan,Van,Coupe',
        'status' => 'sometimes|in:disponible,pas disponible,maintenance',
    ];
}
}
