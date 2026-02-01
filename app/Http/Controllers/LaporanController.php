<?php

namespace App\Http\Controllers;

use App\Models\Rapat;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $sort = $request->input('sort', 'tanggal');
        $direction = $request->input('direction', 'asc');

        $rapats = $this->buildReport($from, $to, $sort, $direction);

        return Inertia::render('Laporan', [
            'rapats' => $rapats,
            'filters' => [
                'from' => $from,
                'to' => $to,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $sort = $request->input('sort', 'tanggal');
        $direction = $request->input('direction', 'asc');

        $rapats = $this->buildReport($from, $to, $sort, $direction);

        $filename = 'laporan-rapat.xls';
        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($rapats) {
            echo '<table border="1">';
            echo '<thead>';
            echo '<tr>';
            echo '<th>Waktu Input</th>';
            echo '<th>Nama Pimpinan</th>';
            echo '<th>Topik</th>';
            echo '<th>Ruangan</th>';
            echo '<th>Fasilitas</th>';
            echo '<th>Tanggal Rapat</th>';
            echo '<th>Jam Rapat</th>';
            echo '<th>Status Rapat</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';

            foreach ($rapats as $rapat) {
                echo '<tr>';
                echo '<td>' . e(optional($rapat->created_at)->format('d-m-Y H:i')) . '</td>';
                echo '<td>' . e($rapat->pimpinan_rapat) . '</td>';
                echo '<td>' . e($rapat->topik_rapat) . '</td>';
                echo '<td>' . e($rapat->ruangan?->nama_ruangan ?? '-') . '</td>';
                echo '<td>' . e($rapat->fasilitas ?? '-') . '</td>';
                echo '<td>' . e($rapat->tanggal_rapat) . '</td>';
                echo '<td>' . e(sprintf(
                    '%s - %s',
                    substr($rapat->jam_mulai, 0, 5),
                    substr($rapat->jam_selesai, 0, 5)
                )) . '</td>';
                echo '<td>' . e($rapat->status_rapat) . '</td>';
                echo '</tr>';
            }

            echo '</tbody>';
            echo '</table>';
        };

        return response()->stream($callback, 200, $headers);
    }

    private function buildReport(?string $from, ?string $to, string $sort, string $direction): Collection
    {
        $query = Rapat::with('ruangan');

        if ($from) {
            $query->whereDate('tanggal_rapat', '>=', $from);
        }

        if ($to) {
            $query->whereDate('tanggal_rapat', '<=', $to);
        }

        $rapats = $query->get();

        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        $sorted = $rapats->sortBy(function ($rapat) use ($sort) {
            return match ($sort) {
                'jam' => $rapat->jam_mulai,
                'ruangan' => $rapat->ruangan?->nama_ruangan ?? '',
                'topik' => $rapat->topik_rapat,
                'pimpinan' => $rapat->pimpinan_rapat,
                'status' => $rapat->status_rapat,
                'created' => $rapat->created_at?->timestamp ?? 0,
                default => $rapat->tanggal_rapat,
            };
        });

        return $direction === 'desc' ? $sorted->reverse()->values() : $sorted->values();
    }
}