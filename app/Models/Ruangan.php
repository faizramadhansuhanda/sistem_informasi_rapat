<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ruangan extends Model
{
    protected $fillable = [
        'nama_ruangan',
        'kapasitas',
        'status_ruangan',
    ];

    public function rapats()
    {
        return $this->hasMany(Rapat::class);
    }
}
