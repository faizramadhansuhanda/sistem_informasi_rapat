<?php

namespace App\Http\Controllers;

use App\Models\Rapat;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RapatController extends Controller
{
    // READ
    public function index()
    {
        return Inertia::render('Rapat', [
            'rapats' => Rapat::with('ruangan')->orderBy('tanggal_rapat')->get(),
            'ruangans' => Ruangan::where('status_ruangan', 'aktif')->get(),
        ]);
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'topik_rapat' => 'required',
            'ruangan_id' => 'required|exists:ruangans,id', // pastikan ruangan_id ada dalam tabel ruangan
            'tanggal_rapat' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'pimpinan_rapat' => 'required',
            'fasilitas' => 'nullable',
        ]);

      $bentrok = Rapat::where('ruangan_id', $request->ruangan_id)
        ->where('tanggal_rapat', $request->tanggal_rapat)
        ->where(function ($q) use ($request) {
           $q->where('jam_mulai', '<', $request->jam_selesai)
                ->where('jam_selesai', '>', $request->jam_mulai);
        })
        ->first();

        if ($bentrok) {
            return back()->withErrors([
                'jadwal' => "Bentrok dengan jadwal lain di ruangan {$bentrok->ruangan->nama_ruangan} "
                        . "({$bentrok->jam_mulai} – {$bentrok->jam_selesai})"
            ]);
        }


        Rapat::create([
                'topik_rapat' => $request->topik_rapat,
                'ruangan_id' => $request->ruangan_id,
                'tanggal_rapat' => $request->tanggal_rapat,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'pimpinan_rapat' => $request->pimpinan_rapat,
                'fasilitas' => $request->fasilitas, // pastikan nilai bisa null
                'status_rapat' => 'terjadwal'
            

        ]);

        return redirect()
            ->route('rapat.index')
            ->with('success', 'Rapat berhasil ditambahkan!');

    }

    // UPDATE
   public function update(Request $request, $id)
    {
        $bentrok = Rapat::where('ruangan_id', $request->ruangan_id)
            ->where('tanggal_rapat', $request->tanggal_rapat)
            ->where('id', '!=', $id)
            ->where(function ($q) use ($request) {
                $q->where('jam_mulai', '<', $request->jam_selesai)
                ->where('jam_selesai', '>', $request->jam_mulai);
            })
            ->exists();

        if ($bentrok) {
            return back()->withErrors([
                'jadwal' => 'Bentrok saat edit'
            ]);
        }

        Rapat::findOrFail($id)->update($request->all());

        return redirect()
            ->route('rapat.index')
            ->with('success', 'Rapat berhasil diupdate');

    }

    // DELETE
    public function destroy(Rapat $rapat)
    {
        $rapat->delete();
        return back();
    }
}
