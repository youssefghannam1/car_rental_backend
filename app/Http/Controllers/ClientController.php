<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Car;
use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClientController extends Controller
{
    public function index()
    {
        return Client::with(['cars', 'reservations.car'])->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
{
    // Validate incoming request
    $request->validate([
        'full_name' => 'required|string|max:255',
        'age' => 'required|integer|min:18',
        'cin' => 'required|string|unique:clients',
        'telephone' => 'required|string|max:15',
        'cars' => 'required|array',
        'cars.*' => 'exists:cars,id',
        'total_price' => 'required|numeric',
        'date_debut' => 'required|date',
        'date_fin' => 'required|date|after:date_debut',
    ]);

    DB::transaction(function () use ($request, &$client) {
        $client = Client::create(array_merge(
            $request->only('full_name', 'age', 'cin', 'telephone'), 
            ['status' => 'en attente']
        ));

        foreach ($request->cars as $carId) {
            $car = Car::findOrFail($carId);
            $car->status = 'pas disponible';
            $car->save();
            Reservation::create([
                'client_id' => $client->id,
                'car_id' => $carId,
                'start_date' => $request->date_debut,
                'end_date' => $request->date_fin,
                'status' => 'pending',
                'price' => $request->total_price / count($request->cars),
            ]);
            Invoice::create([
                'client_id' => $client->id,
                'car_id' => $carId,
                'date_issued' => $request->date_debut,
                'due_date' => $request->date_fin,
                'status' => 'unpaid',
                'amount' => $request->total_price / count($request->cars),
            ]);
        } 
        $client->cars()->attach($request->cars);
    });
    $clientContrat = $client ? Client::with(['cars', 'reservations.car'])->find($client->id) : null;
    if (!$clientContrat)
        return apiResponse([], 'Client creation failed', 500);
    $clientWithRelations = $client->load(['invoices.car', 'invoices.client']); // Assuming 'car' is related to 'invoice'
    return apiResponse(["contrat" => $clientContrat, "invoice" => $clientWithRelations->invoices], 'Client and Reservation created successfully', 201);
}

    public function searchByCin($cin)
{
    if (!preg_match('/^[A-Za-z0-9]+$/', $cin)) {
        return apiResponse(null, 'Invalid CIN format', 400);
    }
    $client = Client::with(['cars', 'reservations.car'])->where('cin', $cin)->first();

    if ($client) {
        return apiResponse($client, 'Client Found', 200);
    }
    return apiResponse(null, 'New client, not found in database', 200);
}



public function update(Request $request, Client $client)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'age' => 'required|integer|min:18',
        'cin' => 'required|string|unique:clients,cin,' . $client->id,
        'telephone' => 'required|string|max:15',
        'status' => 'nullable|in:active,inactive'
    ]);

    DB::transaction(function () use ($request, $client) {
        // Update only the required fields
        $client->update($request->only('full_name', 'age', 'cin', 'telephone'));
    });

    return apiResponse($client, 'Client updated successfully', 200);
}


    public function destroy(Client $client)
    {
        DB::transaction(function () use ($client) {
            $carIds = $client->cars()->pluck('cars.id');
            DB::table('client_car')->where('client_id', $client->id)->delete();
            Car::whereIn('id', $carIds)->update(['status' => 'disponible']);
            Reservation::where('client_id', $client->id)->update(['status' => 'cancelled']);
            $client->cars()->delete();
            $client->reservations()->delete();
            $client->invoices()->delete();
            $client->delete();
        });

        return response()->json([
            'message' => 'Client deleted and car status updated',
            'status' => true
        ]);
    }

    public function prolongation(Request $request, Client $client)
{
    $request->validate([
        'days' => 'required|integer|min:1',
    ]);

    DB::transaction(function () use ($request, $client) {
        foreach ($client->reservations as $reservation) {
            // Convert the end_date to a Carbon instance if it's not already
            $endDate = Carbon::parse($reservation->end_date);

            // Manually calculate the new end date by adding the number of days
            $endDate->modify("+{$request->days} days");

            // Save the updated end_date
            $reservation->end_date = $endDate;
            $reservation->save();
        }
    });

    return apiResponse(null, 'Reservation prolonged successfully', 200);
}

    public function show($id)
{
    $client = Client::with(['cars', 'reservations.car'])->find($id);

    if (!$client) {
        return apiResponse(null, 'Client not found', 404);
    }

    return apiResponse($client, 'Client found successfully', 200);
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
