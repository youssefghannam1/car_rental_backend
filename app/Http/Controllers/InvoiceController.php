<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Client;
use App\Models\Car;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function createInvoice(Request $request)
{
    $request->validate([
        'client_id' => 'required|exists:clients,id',
        'car_id' => 'required|exists:cars,id',
        'days' => 'required|integer|min:1',
    ]);

    $invoiceData = $request->all();

    $client = Client::find($request->client_id);

    if (!$client) {
        return response()->json(['error' => 'Client not found'], 404);
    }

    $invoiceData['client_telephone'] = $client->telephone;

    $car = Car::find($request->car_id);

    $days = $request->days;

    $amount = $car->price_per_day * $days;

    $invoiceData['amount'] = $amount;
    $invoiceData['date_issued'] = now();
    $invoiceData['due_date'] = now()->addDays($days);
    $invoiceData['status'] = 'unpaid';

    unset($invoiceData['days']);

    $invoice = Invoice::create($invoiceData);

    return response()->json($invoice, 201);
}


    public function getInvoices()
    {
        $invoices = Invoice::with(['client', 'car'])->orderBy('created_at', 'desc')->get();
        return response()->json($invoices);
    }

    public function updateInvoiceStatus($id, Request $request)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->status = $request->status;
        $invoice->save();
        return response()->json($invoice);
    }
}
