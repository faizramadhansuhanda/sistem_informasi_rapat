<?php
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RapatController;

Route::get('/rapats', [RapatController::class, 'index']);
Route::post('/rapats', [RapatController::class, 'store']);
Route::put('/rapats/{rapat}', [RapatController::class, 'update']);
Route::delete('/rapats/{rapat}', [RapatController::class, 'destroy']);
Route::get('/rapats', [DashboardController::class, 'dashboard']);

