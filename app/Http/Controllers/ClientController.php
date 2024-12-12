<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Support\Facades\DB;
use App\Models\Car;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index() {
        return Client::with('cars')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'age' => 'required|integer|min:18',
            'cars' => 'required|array',
            'cars.*' => 'exists:cars,id',
            'cin' => 'required|string|unique:clients',
            'days' => 'required|integer',
            'total_price' => 'required',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'telephone' => 'required|string|max:15',
        ]);
        $client = Client::create($request->all());
        foreach ($request->cars as $carId) {
            $car = Car::findOrFail($carId);
            $car->status = "pas disponible";
            $car->save();
        }
        $client->cars()->attach($request->cars);
        return apiResponse($client, "Client Created", 201);
    }
    public function searchByCin($cin)
    {
        $client = Client::with(['cars', 'reservations.car'])->where('cin', $cin)->first();
        if ($client)
            return apiResponse($client, "Client Found", 200);
        return apiResponse(null, "Client NOT Found", 200);
    }

    public function update(Request $request, Client $client) {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'age' => 'required|integer|min:18',
            'cin' => 'required|string|unique:clients,cin,' . $client->id,
            'days' => 'required|integer',
            'total_price' => 'required',
            'cars' => 'required|array',
            'cars.*' => 'exists:cars,id',
            'date_debut' => 'nullable',
            'date_fin' => 'nullable',
            'telephone' => 'required|string|max:15',
        ]);
        $currentCars = $client->cars()->pluck('cars.id')->toArray();
        foreach ($request->cars as $carId) {
            $car = Car::findOrFail($carId);
            $car->status = 'pas disponible';
            $car->save();
        }
        foreach ($currentCars as $carId) {
            if (!in_array($carId, $request->cars)) {
                $car = Car::findOrFail($carId);
                $car->status = 'disponible';
                $car->save();
            }
        }
        $client->update($request->all());
        $client->cars()->sync($request->cars);
        return apiResponse($client, "Client Updated", 200);
    }
    
    public function destroy(Client $client) {
        $carIds = DB::table('client_car')
                    ->where('client_id', $client->id)
                    ->pluck('car_id'); 
            DB::table('client_car')
            ->where('client_id', $client->id)
            ->delete();
            Car::whereIn('id', $carIds)
            ->update(['status' => 'disponible']); 
            $response = $client->delete();
            return response()->json([
            'message' => 'Client deleted and car status updated',
            'status' => $response
        ]);
    }

    public function prolongation(Request $request, Client $client) {
        $client->days = $request->days;
        $client->save();
    }
}
// <?php
// namespace App\Http\Controllers;
// use App\Models\Client;
// use App\Http\Requests\StoreClientRequest;
// use App\Http\Requests\UpdateClientRequest;

// class ClientController extends Controller
// {
//     public function index() {
//         return Client::with('car')->orderBy('created_at', 'desc')->get();
//     }
//     public function store(StoreClientRequest $request, Client $client) {
//         $client = Client::create($request->validated());
//         return apiResponse($client, 'Client created successfully');
//     }
//     public function update(UpdateClientRequest $request, Client $client) {
//         $client = Client::create($request->validated());
//         return apiResponse($client, 'Client updated successfully');
//     }
//     public function destroy(Client $client) {
//         $client->delete();
//         return apiResponse(null, 'Client deleted successfully');
//     } a
// }
