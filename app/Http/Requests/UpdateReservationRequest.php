<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Return true if the user is authorized to update the reservation
        return true; // Adjust this according to your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'], // Ensure client exists in the clients table
            'car_id' => ['required', 'exists:cars,id'], // Ensure car exists in the cars table
            'start_date' => ['required', 'date', 'before:end_date'], // Ensure start date is before end date
            'end_date' => ['required', 'date', 'after:start_date'], // Ensure end date is after start date
            'status' => ['required', 'in:confirmed,pending,cancelled'],
            'price' => ['required'],
        ];
    }

    /**
     * Get the validation messages that should be returned for validation failures.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'client_id.required' => 'The client ID is required.',
            'car_id.required' => 'The car ID is required.',
            'start_date.required' => 'The start date is required.',
            'end_date.required' => 'The end date is required.',
            'status.required' => 'The reservation status is required.',
            'status.in' => 'The status must be one of the following: confirmed, pending, cancelled.',
            'start_date.before' => 'The start date must be before the end date.',
            'end_date.after' => 'The end date must be after the start date.',
            'price.required' => 'The reservation price is required.',
        ];
    }
}
