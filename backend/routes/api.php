<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Feature 1: Score Lookup
Route::get('/search/{registrationNumber}', [StudentController::class, 'searchByRegistrationNumber']);

// Feature 2: Grade Statistics (Chart)
Route::get('/statistics', [StudentController::class, 'getStatistics']);

// Feature 3: Top 10 Group A Rankings
Route::get('/rankings-group-a', [StudentController::class, 'getTop10GroupA']);
