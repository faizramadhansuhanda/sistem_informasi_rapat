<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\RapatController;

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/ruangan', RuanganController::class);
    Route::resource('/rapat', RapatController::class);
    Route::post('/rapat', [RapatController::class, 'store']);
    Route::put('/rapat/{rapat}', [RapatController::class, 'update']);
    Route::delete('/rapat/{rapat}', [RapatController::class, 'destroy']);
});


Route::middleware(['auth'])->group(function () {
    Route::get('/ruangan', [RuanganController::class, 'index']);
    Route::post('/ruangan', [RuanganController::class, 'store']);
    Route::put('/ruangan/{ruangan}', [RuanganController::class, 'update']);
    Route::patch('/ruangan/{ruangan}/toggle-status', [RuanganController::class, 'toggleStatus']);
});

require __DIR__.'/auth.php';
