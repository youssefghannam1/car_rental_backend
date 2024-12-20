<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\TaskRequest;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    public function index() {
        return Task::orderBy('created_at', 'desc')->get();
    }
    public function store(TaskRequest $request) {
        $task = Task::create($request->validated());
        return apiResponse($task, 'Task created successfully');
    }
    public function update(TaskRequest $request, int $id) {
        $task = Task::findOrFail($id);
        $task->update($request->validated());
        return apiResponse($task, 'Task updated successfully');
    }
    public function destroy(Task $task) {
        $task->delete();
        return apiResponse(null, 'Task deleted successfully');
    }
    public function show($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['error' => 'task not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($task);
    }
}
