<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\ReservationExtension;

class ReservationExtensionController extends Controller
{
    public function requestExtension(Request $request, $reservationId)
    {
        $reservation = Reservation::findOrFail($reservationId);

        // Validate the request
        $request->validate([
            'requested_end_date' => 'required|date|after_or_equal:' . $reservation->end_date,
        ]);

        // Create the extension request
        $extension = $reservation->extensions()->create([
            'requested_end_date' => $request->requested_end_date,
            'status' => 'Pending',
        ]);

        return response()->json(['message' => 'Extension request submitted!', 'extension' => $extension], 201);
    }

    public function approveExtension($extensionId)
    {
        $extension = ReservationExtension::findOrFail($extensionId);

        $extension->update(['status' => 'Approved']);
        $extension->reservation->update(['extended_end_date' => $extension->requested_end_date]);

        return response()->json(['message' => 'Extension approved!', 'extension' => $extension]);
    }

    public function declineExtension($extensionId)
    {
        $extension = ReservationExtension::findOrFail($extensionId);

        $extension->update(['status' => 'Declined']);

        return response()->json(['message' => 'Extension declined!', 'extension' => $extension]);
    }
}
