<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'age' => 'required|integer|min:18',
            'cin' => 'required|string|unique:clients,cin,' . $this->route('client')->id,
            'car' => 'required',
            'days' => 'required|integer',
            'date_debut' => 'nullable',
            'date_fin' => 'nullable',
            'telephone' => 'required|string|max:15',
        ];
    }
}
