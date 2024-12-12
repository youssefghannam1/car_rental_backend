<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'model' => $this->model,
            'brand' => $this->brand,
            'year' => $this->year,
            'matricule' => $this->matricule,
            'price_per_day' => $this->price_per_day,
            'category' => $this->category,
            'status' => $this->status,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
