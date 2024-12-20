<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;

Route::prefix('api')->group(function () {

    // Public Routes
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);


// Routes that require JWT authentication
    Route::middleware([JwtMiddleware::class])->group(function () {
    // User Info (Authenticated User)
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::get('logout', [JWTAuthController::class, 'logout']);
    Route::get('/dashboard/revenues', [DashboardController::class, 'getRevenues']);
    Route::get('/dashboard/upcoming_reservations', [DashboardController::class, 'getUpcomingReservations']);
    Route::get('/dashboard/upcoming_maintenances', [DashboardController::class, 'getUpcomingMaintenances']);
    Route::get('/dashboard/revenue_by_category', [DashboardController::class, 'getRevenueByCategory']);
    Route::get('/dashboard/revenues_and_losses', [DashboardController::class, 'getRevenuesAndLosses']);
    Route::get('/dashboard/by_period', [DashboardController::class, 'byPeriod']);
    Route::get('/dashboard/total_clients', [DashboardController::class, 'totalClients']);

    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);
    Route::get('/clients/search/{cin}', [ClientController::class, 'searchByCin']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put( '/clients/{client}', [ClientController::class, 'update']);
    Route::put( '/clients/prolongation/{client}', [ClientController::class, 'prolongation']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put( '/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    Route::get('/cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{id}', [CarController::class, 'update']);
    Route::delete('/cars/{id}', [CarController::class, 'destroy']);
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
});

Route::get('/', function () {
    return view('welcome');
});