<?php

namespace App\Http\Controllers;
use App\Models\Maintenance;
use App\Http\Requests\StoreMaintenanceRequest;
use App\Http\Requests\UpdateMaintenanceRequest;
use Illuminate\Http\Response;

class MaintenanceController extends Controller
{
    public function index() {
        return Maintenance::orderBy('created_at', 'desc')->get();
    }
    public function store(StoreMaintenanceRequest $request) {
        $maintenance = Maintenance::create($request->validated());
        return apiResponse($maintenance, 'Maintenance created successfully');
    }
    public function update(UpdateMaintenanceRequest $request, int $id) {
        $maintenance = Maintenance::findOrFail($id);
        $maintenance->update($request->validated());
        return apiResponse($maintenance, 'Maintenance updated successfully');
    }
    public function destroy(Maintenance $maintenance) {
        $maintenance->delete();
        return apiResponse(null, 'Maintenance deleted successfully');
    }
    public function show($id)
    {
        $maintenance = Maintenance::find($id);
        if (!$maintenance) {
            return response()->json(['error' => 'maintenance not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($maintenance);
    }
}
