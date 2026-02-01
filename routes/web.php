<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\UserRapatController;
use App\Http\Controllers\RapatController;
use App\Http\Controllers\LaporanController;

Route::get('/', [UserRapatController::class, 'index'])->name('home');
Route::get('/jadwal-user', [UserRapatController::class, 'index'])->name('user.jadwal');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export', [LaporanController::class, 'export'])->name('laporan.export');
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
