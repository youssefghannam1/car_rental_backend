<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InvoiceController;



Route::prefix('api')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

    Route::get('/dashboard/revenues', [DashboardController::class, 'getRevenues']);
    Route::get('/dashboard/upcoming_reservations', [DashboardController::class, 'getUpcomingReservations']);
    Route::get('/dashboard/upcoming_maintenances', [DashboardController::class, 'getUpcomingMaintenances']);
    Route::get('/dashboard/revenue_by_category', [DashboardController::class, 'getRevenueByCategory']);
    Route::get('/dashboard/revenues_and_losses', [DashboardController::class, 'getRevenuesAndLosses']);

    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);
    Route::get('/clients/search/{cin}', [ClientController::class, 'searchByCin']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put( '/clients/{client}', [ClientController::class, 'update']);
    Route::put( '/clients/prolongation/{client}', [ClientController::class, 'prolongation']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

    Route::get('/cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);
    Route::get('/cars/{id}', [CarController::class, 'show']);

    Route::get('/reservations/cars', [ReservationController::class, 'getCars']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/create', [ReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

    Route::post('/invoices', [InvoiceController::class, 'createInvoice']);
    Route::get('/invoices', [InvoiceController::class, 'getInvoices']);
    Route::put('/invoices/{id}/status', [InvoiceController::class, 'updateInvoiceStatus']);
});


Route::get('/', function () {
    return view('welcome');
});
