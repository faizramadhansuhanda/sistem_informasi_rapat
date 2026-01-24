<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Rapat extends Model
{
    protected $table = 'rapats';

    protected $fillable = [
        'topik_rapat',
        'ruangan_id',
        'tanggal_rapat',
        'jam_mulai',
        'jam_selesai',
        'pimpinan_rapat',
        'fasilitas',
    ];
    protected $appends = ['status_rapat', 'status_sort'];

    /**
     * RELASI KE RUANGAN
     */
    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class);
    }

    public function getStatusRapatAttribute()
    {
        $now = Carbon::now();
        $mulai = Carbon::parse($this->tanggal_rapat.' '.$this->jam_mulai);
        $selesai = Carbon::parse($this->tanggal_rapat.' '.$this->jam_selesai);

        if ($now->between($mulai, $selesai)) {
            return 'Sedang Berlangsung';
        }

        if ($now->lt($mulai)) {
            return 'Terjadwal';
        }

        return 'Selesai';
    }
    public function getStatusSortAttribute()
    {
        $now = Carbon::now();
        $mulai = Carbon::parse($this->tanggal_rapat.' '.$this->jam_mulai);
        $selesai = Carbon::parse($this->tanggal_rapat.' '.$this->jam_selesai);

        if ($now->between($mulai, $selesai)) {
            return 1;
        }

        if ($now->lt($mulai)) {
            return 2;
        }

        return 3;
    }
}
