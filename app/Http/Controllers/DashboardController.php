<?php

namespace App\Http\Controllers;

use App\Models\Rapat;
use App\Models\Ruangan;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();

        /* ===============================
         |  KARTU RINGKASAN
         =============================== */

        // Total rapat bulan ini
        $totalRapatBulanIni = Rapat::whereMonth('tanggal_rapat', $now->month)
            ->whereYear('tanggal_rapat', $now->year)
            ->count();

        // Rapat hari ini
        $rapatHariIni = Rapat::whereDate('tanggal_rapat', $now->toDateString())->count();

        // Ruangan aktif
        $totalRuanganAktif = Ruangan::where('status_ruangan', 'aktif')->count();

        // Rapat selesai (berdasarkan waktu)
        $rapatSelesai = Rapat::where(function ($q) use ($now) {
            $q->where('tanggal_rapat', '<', $now->toDateString())
              ->orWhere(function ($sub) use ($now) {
                  $sub->where('tanggal_rapat', $now->toDateString())
                      ->where('jam_selesai', '<', $now->format('H:i:s'));
              });
        })->count();

        /* ===============================
         |  GRAFIK
         =============================== */

        // Grafik mingguan (7 hari terakhir)
        $weeklyData = collect(range(0, 6))->map(function ($i) {
            $date = Carbon::now()->subDays(6 - $i);
            return [
                'day'    => $date->translatedFormat('D'),
                'rapats' => Rapat::whereDate('tanggal_rapat', $date->toDateString())->count(),
            ];
        });

        // Grafik bulanan (per minggu)
        $monthlyData = collect(range(1, 4))->map(function ($week) use ($now) {
            return [
                'week'   => "Minggu $week",
                'rapats' => Rapat::whereBetween('tanggal_rapat', [
                    $now->copy()->startOfMonth()->addWeeks($week - 1),
                    $now->copy()->startOfMonth()->addWeeks($week),
                ])->count(),
            ];
        });

        /* ===============================
         |  TABEL RAPAT (LOGIKA PRIORITAS)
         =============================== */

        // 1️⃣ RAPAT BERLANGSUNG
        $berlangsung = Rapat::with('ruangan')
            ->whereDate('tanggal_rapat', $now->toDateString())
            ->where('jam_mulai', '<=', $now->format('H:i:s'))
            ->where('jam_selesai', '>=', $now->format('H:i:s'))
            ->orderBy('jam_mulai')
            ->get();

        $slot = 5 - $berlangsung->count();

        // 2️⃣ RAPAT TERJADWAL (TERDEKAT)
        $terjadwal = collect();
        if ($slot > 0) {
            $terjadwal = Rapat::with('ruangan')
                ->where(function ($q) use ($now) {
                    $q->where('tanggal_rapat', '>', $now->toDateString())
                      ->orWhere(function ($sub) use ($now) {
                          $sub->where('tanggal_rapat', $now->toDateString())
                              ->where('jam_mulai', '>', $now->format('H:i:s'));
                      });
                })
                ->orderBy('tanggal_rapat')
                ->orderBy('jam_mulai')
                ->limit($slot)
                ->get();
        }

        $slot -= $terjadwal->count();

        // 3️⃣ RAPAT SELESAI (TERBARU)
        $selesai = collect();
        if ($slot > 0) {
            $selesai = Rapat::with('ruangan')
                ->where(function ($q) use ($now) {
                    $q->where('tanggal_rapat', '<', $now->toDateString())
                      ->orWhere(function ($sub) use ($now) {
                          $sub->where('tanggal_rapat', $now->toDateString())
                              ->where('jam_selesai', '<', $now->format('H:i:s'));
                      });
                })
                ->orderBy('tanggal_rapat', 'desc')
                ->orderBy('jam_selesai', 'desc')
                ->limit($slot)
                ->get();
        }

        // 🔥 GABUNG FINAL (MAX 5)
        $rapats = $berlangsung
            ->merge($terjadwal)
            ->merge($selesai)
            ->values();

        /* ===============================
         |  RENDER
         =============================== */

        return Inertia::render('Dashboard', [
            'totalRapat'   => $totalRapatBulanIni,
            'rapatHariIni' => $rapatHariIni,
            'totalRuangan' => $totalRuanganAktif,
            'rapatSelesai' => $rapatSelesai,
            'weeklyData'   => $weeklyData,
            'monthlyData'  => $monthlyData,
            'rapats'       => $rapats,
        ]);
    }
}
