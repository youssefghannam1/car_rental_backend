<?php

namespace App\Http\Controllers;
use App\Models\Car;
use App\Http\Requests\StoreCarRequest;
use App\Http\Requests\UpdateCarRequest;
// use App\Http\Resources\CarResource;
use Illuminate\Http\Response;

class CarController extends Controller
{
    public function index() {
        return Car::orderBy('created_at', 'desc')->get();
    }
    public function store(StoreCarRequest $request) {
        $car = Car::create($request->validated());
        return apiResponse($car, 'Car created successfully');
    }
    public function update(UpdateCarRequest $request, int $id) {
        $car = Car::findOrFail($id);
        $car->update($request->validated());
        return apiResponse($car, 'Car updated successfully');
    }
    public function destroy(Car $car) {
        $car->delete();
        return apiResponse(null, 'Car deleted successfully');
    }
    public function show($id)
    {
        $car = Car::find($id);
        if (!$car) {
            return response()->json(['error' => 'car not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($car);
    }
}
