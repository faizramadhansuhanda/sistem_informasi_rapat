<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rapats', function (Blueprint $table) {
            $table->id();
            $table->string('topik_rapat');
            $table->foreignId('ruangan_id')->constrained('ruangans')->cascadeOnDelete();
            $table->date('tanggal_rapat');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('pimpinan_rapat');
            $table->string('fasilitas')->nullable();
            $table->enum('status_rapat', ['terjadwal', 'berlangsung', 'selesai'])->default('terjadwal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapats');
    }
};
