<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarRequest extends FormRequest
{
    public function rules()
{
    return [
        'model' => 'nullable|string|max:255',
        'brand' => 'nullable|string|max:255',
        'color' => 'nullable|string|max:50',
        'mileage' => 'nullable|integer|min:0', 
        'fuel_type' => 'nullable|in:essence,diesel,électrique,hybride',
        'fuel_level' => 'nullable|string|max:50',
        'transmission' => 'nullable|in:automatique,manuelle',
        'location' => 'nullable|string|max:255',
        'year' => 'nullable|integer|digits:4|min:1900|max:' . date('Y'),
        'matricule' => 'nullable|string|max:255|unique:cars,matricule,' . $this->route('id'),
        'price_per_day' => 'nullable|numeric|min:0',
        'category' => 'nullable|in:Economy,SUV,Luxury,Sedan,Van,Coupe',
        'status' => 'required|in:disponible,pas disponible,maintenance',
    ];
}
}
