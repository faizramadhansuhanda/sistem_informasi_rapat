<?php

namespace App\Http\Controllers;

use App\Models\Rapat;
use Inertia\Inertia;

class UserRapatController extends Controller
{
    public function index()
    {
        return Inertia::render('UserRapat', [
            'rapats' => Rapat::with('ruangan')->orderBy('tanggal_rapat')->get(),
        ]);
    }
}