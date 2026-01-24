<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganController extends Controller
{
    public function index()
    {
        return Inertia::render('Ruangan', [
            'ruangans' => Ruangan::orderBy('nama_ruangan')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ruangan' => 'required|string',
            'kapasitas' => 'required|integer|min:1',
        ]);

        Ruangan::create([
            'nama_ruangan' => $request->nama_ruangan,
            'kapasitas' => $request->kapasitas,
            'status_ruangan' => 'aktif',
        ]);

        return back();
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        $request->validate([
            'nama_ruangan' => 'required',
            'kapasitas' => 'required|integer',
            'status_ruangan' => 'required',
        ]);

        $ruangan->update($request->all());
        return back();
    }

    // 🔥 INI YANG KAMU BUTUHKAN
    public function toggleStatus(Ruangan $ruangan)
    {
        $statusBaru = $ruangan->status_ruangan === 'aktif'
            ? 'tidak aktif'
            : 'aktif';

        $ruangan->update([
            'status_ruangan' => $statusBaru
        ]);

        return back();
    }

}
