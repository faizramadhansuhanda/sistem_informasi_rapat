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
        // Pakai timezone app (pastikan di .env: APP_TIMEZONE=Asia/Jakarta)
        $now = Carbon::now(config('app.timezone'))->seconds(0);
                                    
        // 📌 TOTAL RAPAT BULAN INI
        $totalRapatBulanIni = Rapat::whereMonth('tanggal_rapat', $now->month)
            ->whereYear('tanggal_rapat', $now->year)
            ->count();

        // 📌 TOTAL RAPAT HARI INI
        $rapatHariIni = Rapat::whereDate('tanggal_rapat', $now->toDateString())->count();

        // 📌 TOTAL RUANGAN AKTIF
        $totalRuanganAktif = Ruangan::where('status_ruangan', 'aktif')->count();

        // 📌 TOTAL RAPAT SELESAI (berdasarkan waktu)
        $rapatSelesai = Rapat::where(function ($q) use ($now) {
            $q->where('tanggal_rapat', '<', $now->toDateString())
              ->orWhere(function ($sub) use ($now) {
                  $sub->where('tanggal_rapat', $now->toDateString())
                      ->where('jam_selesai', '<', $now->format('H:i:s'));
              });
        })->count();

        // 📊 GRAFIK RAPAT MINGGUAN (7 hari terakhir)
        $weeklyData = collect(range(0, 6))->map(function ($i) {
            $tanggal = Carbon::now(config('app.timezone'))->subDays(6 - $i);
            return [
                'day' => $tanggal->translatedFormat('D'),
                'rapats' => Rapat::whereDate('tanggal_rapat', $tanggal->toDateString())->count()
            ];
        });

        // 📈 GRAFIK RAPAT BULANAN (per minggu)
        $monthlyData = collect(range(1, 4))->map(function ($week) use ($now) {
            return [
                'week' => "Minggu $week",
                'rapats' => Rapat::whereBetween('tanggal_rapat', [
                    $now->copy()->startOfMonth()->addWeeks($week - 1)->toDateString(),
                    $now->copy()->startOfMonth()->addWeeks($week)->toDateString(),
                ])->count()
            ];
        });

        /**
         * ===============================
         * TABEL DASHBOARD (ATURAN PRIORITAS KAMU)
         * 1) Berlangsung (maks 5)
         * 2) Terjadwal terdekat mengisi sisa slot
         * 3) Selesai terbaru mengisi sisa slot
         * ===============================
         */

        // Ambil semua rapat (biar status akurat pakai datetime penuh)
        $all = Rapat::with('ruangan')->get()->map(function ($r) use ($now) {
            $mulai   = Carbon::parse($r->tanggal_rapat.' '.$r->jam_mulai, config('app.timezone'))->seconds(0);
            $selesai = Carbon::parse($r->tanggal_rapat.' '.$r->jam_selesai, config('app.timezone'))->seconds(0);

            // Kalau ada data jam_selesai <= jam_mulai (kasus salah input), paksa selesai > mulai
            // (opsional, tapi bikin sistem tahan banting)
            if ($selesai->lessThanOrEqualTo($mulai)) {
                $selesai = $selesai->addDay();
            }

            if ($now->greaterThanOrEqualTo($mulai) && $now->lessThanOrEqualTo($selesai)) {
                $r->status_label = 'Berlangsung';
                $r->status_sort = 1;
            } elseif ($now->lessThan($mulai)) {
                $r->status_label = 'Terjadwal';
                $r->status_sort = 2;
            } else {
                $r->status_label = 'Selesai';
                $r->status_sort = 3;
            }

            $r->dt_mulai = $mulai;
            $r->dt_selesai = $selesai;

            return $r;
        });

        // 1) Berlangsung (urut: yang paling dekat selesai dulu biar paling relevan)
        $berlangsung = $all->where('status_sort', 1)
            ->sortBy(fn ($r) => $r->dt_selesai->timestamp)
            ->values();

        $slot = 5 - $berlangsung->count();

        // 2) Terjadwal (urut: yang paling dekat mulai dulu)
        $terjadwal = collect();
        if ($slot > 0) {
            $terjadwal = $all->where('status_sort', 2)
                ->sortBy(fn ($r) => $r->dt_mulai->timestamp)
                ->take($slot)
                ->values();
        }

        $slot = 5 - ($berlangsung->count() + $terjadwal->count());

        // 3) Selesai (urut: yang paling baru selesai dulu)
        $selesai = collect();
        if ($slot > 0) {
            $selesai = $all->where('status_sort', 3)
                ->sortByDesc(fn ($r) => $r->dt_selesai->timestamp)
                ->take($slot)
                ->values();
        }

        // Gabung final, max 5
        $rapats = $berlangsung->merge($terjadwal)->merge($selesai)->values();

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
