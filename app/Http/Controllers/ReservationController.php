<?php

namespace App\Http\Controllers;
use App\Models\Reservation;
use App\Models\Invoice;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
// use App\Http\Resources\ReservationResource;
use Illuminate\Http\Response;

class ReservationController extends Controller
{
    public function index() {
        return Reservation::with('client')->orderBy('created_at', 'desc')->get();
    }
    public function store(StoreReservationRequest $request) {
        $reservation = Reservation::create($request->validated());
        return apiResponse($reservation, 'Reservation created successfully');
    }
    public function update(UpdateReservationRequest $request, int $id)
{
    $reservation = Reservation::findOrFail($id);
    if ($reservation->status == 'cancelled') {
        $invoice = Invoice::where('client_id', $reservation->client_id)
                          ->where('car_id', $reservation->car_id)
                          ->first();
        if ($invoice) {
            $invoice->delete();
        }
    }
    $reservation->update($request->validated());
    if ($reservation->status == 'confirmed') {
        Invoice::create([
            'client_id' => $reservation->client_id,
            'car_id' => $reservation->car_id,
            'amount' => $reservation->price,
            'date_issued' => now(),
            'due_date' => now()->addDays(30),
            'status' => 'unpaid',
        ]);
    }
    return apiResponse($reservation, 'Reservation updated successfully');
}

    public function destroy(Reservation $reservation) {
        $reservation->delete();
        return apiResponse(null, 'Reservation deleted successfully');
    }
    public function show($id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['error' => 'reservation not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($reservation);
    }
}
