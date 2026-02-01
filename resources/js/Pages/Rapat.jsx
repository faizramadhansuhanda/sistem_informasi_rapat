import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, router, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

//Jam
const timeSlots = Array.from({ length: 34 }, (_, index) => {
    const minutes = (7 * 60) + index * 30;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
});

// 🔹 FORMAT TANGGAL → Senin, 22 01 2026
   const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const getStatusMeta = (rapat) => {
    const statusText = rapat.status_rapat ?? "";
    const normalized = statusText.toLowerCase();

    if (normalized.includes("berlangsung")) {
        return {
            label: statusText || "Sedang Berlangsung",
            badgeClass: "bg-green-100 text-green-700",
        };
    }

    if (normalized.includes("terjadwal")) {
        return {
            label: statusText || "Terjadwal",
            badgeClass: "bg-yellow-100 text-yellow-700",
        };
    }

    if (normalized.includes("selesai")) {
        return {
            label: statusText || "Selesai",
            badgeClass: "bg-gray-200 text-gray-700",
        };
    }

    if (rapat.status_sort === 1) {
        return {
            label: "Sedang Berlangsung",
            badgeClass: "bg-green-100 text-green-700",
        };
    }

    if (rapat.status_sort === 2) {
        return {
            label: "Terjadwal",
            badgeClass: "bg-yellow-100 text-yellow-700",
        };
    }

    return {
        label: "Selesai",
        badgeClass: "bg-gray-200 text-gray-700",
    };
};

export default function Rapat({ rapats, ruangans }) {
    const formRef = React.useRef(null);
    const { data, setData, post, put, errors, setError, clearErrors } = useForm({
        topik_rapat: "",
        ruangan_id: "",
        tanggal_rapat: "",
        jam_mulai: "",
        jam_selesai: "",
        pimpinan_rapat: "",
        fasilitas: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formNotice, setFormNotice] = useState("");
    const [sortMode, setSortMode] = useState("upcoming");

    const selectedRuangan = data.ruangan_id;
    const selectedRuanganDetail = useMemo(() => {
        if (!selectedRuangan) return null;
        return ruangans.find((ruangan) => String(ruangan.id) === String(selectedRuangan)) ?? null;
    }, [ruangans, selectedRuangan]);
    const selectedTanggal = data.tanggal_rapat;

    const isSlotBooked = (slot) => {
        if (!selectedTanggal) return false;
        const slotMinutes = timeToMinutes(slot);
        return rapats.some((rapat) => {
            if (rapat.tanggal_rapat !== selectedTanggal) {
                return false;
            }
            if (selectedRuangan && String(rapat.ruangan_id) !== selectedRuangan) {
                return false;
            }
            const mulai = timeToMinutes(rapat.jam_mulai.slice(0, 5));
            const selesai = timeToMinutes(rapat.jam_selesai.slice(0, 5));
            return slotMinutes >= mulai && slotMinutes < selesai;
        });
    };

    const isRangeBooked = (startSlot, endSlot) => {
        if (!startSlot || !endSlot) return false;
        const start = timeToMinutes(startSlot);
        const end = timeToMinutes(endSlot);
        if (end <= start) return true;

        return timeSlots.some((slot) => {
            const slotMinutes = timeToMinutes(slot);
            if (slotMinutes < start || slotMinutes >= end) {
                return false;
            }
            return isSlotBooked(slot);
        });
    };

    const handleSlotClick = (slot) => {
        if (isSlotBooked(slot)) return;

        if (!data.jam_mulai || (data.jam_mulai && data.jam_selesai)) {
            setData("jam_mulai", slot);
            setData("jam_selesai", "");
            return;
        }

        if (timeToMinutes(slot) <= timeToMinutes(data.jam_mulai)) {
            setData("jam_mulai", slot);
            setData("jam_selesai", "");
            return;
        }

        if (isRangeBooked(data.jam_mulai, slot)) {
            return;
        }

        setData("jam_selesai", slot);
    };

    const resetForm = () => {
        setData({
            topik_rapat: "",
            ruangan_id: "",
            tanggal_rapat: "",
            jam_mulai: "",
            jam_selesai: "",
            pimpinan_rapat: "",
            fasilitas: "",
        });
        setIsEditing(false);
        setEditingId(null);
        setFormNotice("");
        clearErrors();
    };

    const validateForm = () => {
        const requiredFields = [
            "pimpinan_rapat",
            "topik_rapat",
            "ruangan_id",
            "tanggal_rapat",
            "jam_mulai",
            "jam_selesai",
        ];
        let hasError = false;
        requiredFields.forEach((field) => {
            if (!data[field]) {
                setError(field, "Wajib diisi");
                hasError = true;
            }
        });
        if (hasError) {
            setFormNotice("Lengkapi semua data yang wajib diisi sebelum menyimpan.");
        }
        return !hasError;
    };

    const submit = (e) => {
        e.preventDefault();
        setFormNotice("");
        clearErrors();
        if (!validateForm()) return;
        if (isEditing && editingId) {
            put(`/rapat/${editingId}`, {
                onSuccess: () => resetForm(),
            });
            return;
        }
        post("/rapat", {
            onSuccess: () => resetForm(),
        });
    };

    const hapus = (id) => {
        if (confirm("Yakin hapus rapat ini?")) {
            router.delete(`/rapat/${id}`);
        }
    };

const editRapat = (rapat) => {
        setIsEditing(true);
        setEditingId(rapat.id);
        setData({
            topik_rapat: rapat.topik_rapat ?? "",
            ruangan_id: String(rapat.ruangan_id ?? ""),
            tanggal_rapat: rapat.tanggal_rapat ?? "",
            jam_mulai: rapat.jam_mulai ? rapat.jam_mulai.slice(0, 5) : "",
            jam_selesai: rapat.jam_selesai ? rapat.jam_selesai.slice(0, 5) : "",
            pimpinan_rapat: rapat.pimpinan_rapat ?? "",
            fasilitas: rapat.fasilitas ?? "",
        });
        setFormNotice("");
        clearErrors();
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const getRapatTimestamp = (rapat) => {
        if (!rapat?.tanggal_rapat || !rapat?.jam_mulai) return 0;
        return new Date(`${rapat.tanggal_rapat}T${rapat.jam_mulai}`).getTime();
    };

    const sortedRapats = useMemo(() => {
        const list = [...rapats];
        const now = Date.now();
        return list.sort((a, b) => {
            const timeA = getRapatTimestamp(a);
            const timeB = getRapatTimestamp(b);
            if (sortMode === "latest") {
                return timeB - timeA;
            }
            if (sortMode === "oldest") {
                return timeA - timeB;
            }
            const aUpcoming = timeA >= now ? 0 : 1;
            const bUpcoming = timeB >= now ? 0 : 1;
            if (aUpcoming !== bUpcoming) {
                return aUpcoming - bUpcoming;
            }
            return timeA - timeB;
        });
    }, [rapats, sortMode]);
 

    return (
        <AdminLayout>
            <Head title="Manajemen Rapat" />
            
                <div
                ref={formRef}
                className="rounded-3xl bg-gradient-to-r from-yellow-100 via-lime-100 to-lime-200 p-6 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            Welcome to PLN NUSANTARA POWER Managing System, Admin
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tambah Jadwal Rapat
                        </h1>
                    </div>
                </div>

                <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
                    <div className="space-y-4">
                        {formNotice ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formNotice}
                            </div>
                        ) : null}

                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Nama Pimpinan
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                placeholder="Nama pimpinan rapat"
                                value={data.pimpinan_rapat}
                                onChange={(e) =>
                                    setData("pimpinan_rapat", e.target.value)
                                }
                            />
                            {errors.pimpinan_rapat ? (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.pimpinan_rapat}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Topik
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                placeholder="Topik rapat"
                                value={data.topik_rapat}
                                onChange={(e) =>
                                    setData("topik_rapat", e.target.value)
                                }
                            />
                            {errors.topik_rapat ? (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.topik_rapat}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Fasilitas
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                placeholder="LCD, Mic, Zoom, dll"
                                value={data.fasilitas}
                                onChange={(e) =>
                                    setData("fasilitas", e.target.value)
                                }
                            />
                        </div>
                    </div>

                        <div className="rounded-3xl bg-white p-5 shadow-md">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Monitoring Jadwal
                            </h2>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500">
                                    Pilih Ruangan
                                </label>
                                <select
                                    className="mt-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                    value={data.ruangan_id}
                                    onChange={(e) =>
                                        setData("ruangan_id", e.target.value)
                                    }
                                >
                                    <option value="">Pilih Ruangan</option>
                                    {ruangans.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nama_ruangan}
                                        </option>
                                    ))}
                                </select>
                                {selectedRuanganDetail ? (
                                    <p className="mt-2 text-xs font-semibold text-gray-600">
                                        {selectedRuanganDetail.nama_ruangan} • Kapasitas {selectedRuanganDetail.kapasitas} orang
                                    </p>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-400">
                                        Kapasitas ruangan akan tampil di sini.
                                    </p>
                                )}
                                {errors.ruangan_id ? (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.ruangan_id}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500">
                                    Pilih Tanggal
                                </label>
                                <input
                                    type="date"
                                    className="mt-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                    value={data.tanggal_rapat}
                                    onChange={(e) =>
                                        setData("tanggal_rapat", e.target.value)
                                    }
                                />
                                {errors.tanggal_rapat ? (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.tanggal_rapat}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                            {timeSlots.map((slot) => {
                                const booked = isSlotBooked(slot);
                                const selected = data.jam_mulai === slot;
                                const selectedEnd = data.jam_selesai === slot;
                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => handleSlotClick(slot)}
                                        className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                                            booked
                                                ? "cursor-not-allowed border-red-400 bg-red-400 text-white"
                                                : selected || selectedEnd
                                                ? "border-lime-400 bg-lime-300 text-gray-900"
                                                : "border-gray-400 bg-white text-gray-700 hover:border-lime-400"
                                        }`}
                                    >
                                        {slot.replace(":", ".")}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-8 rounded-full border border-gray-400 bg-white" />
                                Available
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-8 rounded-full bg-red-400" />
                                Booked
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-8 rounded-full bg-lime-300" />
                                Selected
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span>
                                Tanggal terpilih:{" "}
                                {data.tanggal_rapat
                                    ? formatTanggal(data.tanggal_rapat)
                                    : "-"}
                            </span>
                            <span>
                                Jam: {data.jam_mulai || "--:--"} -{" "}
                                {data.jam_selesai || "--:--"}
                            </span>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                            Pilih jam mulai, lalu pilih jam selesai.
                        </p>
                        {(errors.jam_mulai || errors.jam_selesai) ? (
                            <p className="mt-1 text-xs text-red-600">
                                Jam mulai dan jam selesai wajib diisi.
                            </p>
                        ) : null}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                className="w-full rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800"
                                type="submit"
                            >
                                {isEditing ? "Simpan Perubahan" : "Simpan Rapat"}
                            </button>
                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50"
                                >
                                    Batal Edit
                                </button>
                            ) : null}
                        </div>
                    </div>
                </form>
            </div>

            {/* ===== TABEL RAPAT ===== */}
<div className="rounded-3xl bg-white p-4 shadow-lg sm:p-6 mt-6 sm:mt-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Daftar Rapat</h2>
                        <p className="text-sm text-gray-500">Kelola jadwal rapat terbaru.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Urutkan
                        </label>
                        <select
                            className="min-w-[140px] rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                            value={sortMode}
                            onChange={(e) => setSortMode(e.target.value)}
                        >
                            <option value="upcoming">Terdekat</option>
                            <option value="latest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border-collapse rounded-2xl border border-gray-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="border border-gray-200 px-4 py-2">Pimpinan</th>
                                <th className="border border-gray-200 px-3 py-2">Topik</th>
                                <th className="border border-gray-200 px-3 py-2">Ruangan</th>
                                <th className="border border-gray-200 px-3 py-2">Tanggal</th>
                                <th className="border border-gray-200 px-3 py-2">Jam</th>
                                <th className="border border-gray-200 px-3 py-2">Fasilitas</th>
                                <th className="border border-gray-200 px-3 py-2">Status</th>
                                <th className="border border-gray-200 px-3 py-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRapats.map((r) => (
                                <tr
                                    key={r.id}
                                    className="bg-gray-50 transition hover:bg-lime-50"
                                >
                                    <td className="border border-gray-200 px-4 py-3 font-semibold text-gray-800">
                                        {r.pimpinan_rapat}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-gray-700">
                                        {r.topik_rapat}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                                            {r.ruangan?.nama_ruangan}
                                        </span>
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                                        {formatTanggal(r.tanggal_rapat)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                                        {r.jam_mulai.slice(0, 5)} - {r.jam_selesai.slice(0, 5)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                                        {r.fasilitas ?? "-"}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700">
                                        <span
                                            className={`rounded-full px-3 py-1 ${getStatusMeta(r).badgeClass}`}
                                        >
                                            {getStatusMeta(r).label}
                                        </span>
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                                onClick={() => editRapat(r)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="text-sm font-semibold text-red-600 hover:text-red-800"
                                                onClick={() => hapus(r.id)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
