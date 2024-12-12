<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaintenanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;  // Allow all users to create a maintenance record (change if you need authorization logic)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'car_id' => 'required|exists:cars,id',  // The car must exist in the cars table
            'type' => 'required|string|in:préventive,corrective,urgence',  // Type must be one of the defined values (in French)
            'description' => 'nullable|string|max:1000',  // Description is optional, with a max length
            'maintenance_date' => 'required|date',  // Maintenance date must be a valid date
            'status' => 'required|in:en-attente,en-cours,terminé,annulé',  // Status must be one of the defined values (in French)
            'technician' => 'required|string|max:255',  // Technician name must be a string with a max length
            'cost' => 'required|numeric|min:0',  // Cost must be a positive number
            'duration' => 'required|numeric|min:0',  // Duration must be a positive number
        ];
    }

    /**
     * Get the custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'car_id.required' => 'Le véhicule est requis.',
            'car_id.exists' => 'Le véhicule sélectionné n\'existe pas.',
            'type.required' => 'Le type de maintenance est requis.',
            'type.in' => 'Le type de maintenance doit être parmi les valeurs suivantes : préventive, corrective, urgence.',
            'maintenance_date.required' => 'La date de maintenance est requise.',
            'maintenance_date.date' => 'La date de maintenance doit être une date valide.',
            'status.required' => 'Le statut de maintenance est requis.',
            'status.in' => 'Le statut de maintenance doit être parmi les valeurs suivantes : en-attente, en-cours, terminé, annulé.',
            'technician.required' => 'Le technicien est requis.',
            'cost.required' => 'Le coût de la maintenance est requis.',
            'cost.numeric' => 'Le coût de la maintenance doit être un nombre.',
            'duration.required' => 'La durée de la maintenance est requise.',
            'duration.numeric' => 'La durée de la maintenance doit être un nombre.',
        ];
    }
}
