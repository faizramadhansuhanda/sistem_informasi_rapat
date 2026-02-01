import React, { useEffect, useMemo, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const formatWaktuInput = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function Laporan() {
    const { rapats, filters } = usePage().props;
    const [from, setFrom] = useState(filters?.from ?? "");
    const [to, setTo] = useState(filters?.to ?? "");
    const [sort, setSort] = useState(filters?.sort ?? "tanggal");
    const [direction, setDirection] = useState(filters?.direction ?? "asc");

    useEffect(() => {
        setFrom(filters?.from ?? "");
        setTo(filters?.to ?? "");
        setSort(filters?.sort ?? "tanggal");
        setDirection(filters?.direction ?? "asc");
    }, [filters]);

    const queryParams = useMemo(
        () => ({
            from: from || undefined,
            to: to || undefined,
            sort,
            direction,
        }),
        [from, to, sort, direction]
    );

    const preview = () => {
        router.get("/laporan", queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportExcel = () => {
        const params = new URLSearchParams(queryParams);
        window.location.href = `/laporan/export?${params.toString()}`;
    };

    return (
        <AdminLayout>
            <Head title="Laporan" />

            <div className="rounded-3xl bg-gradient-to-r from-yellow-100 via-lime-100 to-lime-200 p-6 shadow-lg">
                <div>
                    <p className="text-sm font-semibold text-gray-700">
                        Welcome to PLN NUSANTARA POWER Managing System, Admin
                    </p>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-600">
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600">
                                Sampai
                            </label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600">
                                Urutkan
                            </label>
                            <select
                                className="mt-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="jam">Jam Rapat</option>
                                <option value="tanggal">Tanggal Rapat</option>
                                <option value="ruangan">Ruangan</option>
                                <option value="topik">Topik</option>
                                <option value="pimpinan">Pimpinan</option>
                                <option value="status">Status Rapat</option>
                                <option value="created">Waktu Input</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600">
                                Arah
                            </label>
                            <select
                                className="mt-2 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                            >
                                <option value="asc">Naik</option>
                                <option value="desc">Turun</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={preview}
                            className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-green-600"
                        >
                            Preview
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={exportExcel}
                        className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
                    >
                        Export
                    </button>
                </div>

                <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-4 shadow-md">
                    <table className="w-full border-collapse rounded-2xl border border-gray-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="border border-gray-200 px-3 py-2">Waktu Input</th>
                                <th className="border border-gray-200 px-3 py-2">Nama Pimpinan</th>
                                <th className="border border-gray-200 px-3 py-2">Topik</th>
                                <th className="border border-gray-200 px-3 py-2">Ruangan</th>
                                <th className="border border-gray-200 px-3 py-2">Fasilitas</th>
                                <th className="border border-gray-200 px-3 py-2">Tanggal Rapat</th>
                                <th className="border border-gray-200 px-3 py-2">Jam Rapat</th>
                                <th className="border border-gray-200 px-3 py-2">Status Rapat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rapats.map((r) => (
                                <tr key={r.id} className="bg-gray-50 hover:bg-lime-50">
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                        {formatWaktuInput(r.created_at)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800">
                                        {r.pimpinan_rapat}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                        {r.topik_rapat}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                        {r.ruangan?.nama_ruangan ?? "-"}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                        {r.fasilitas ?? "-"}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                        {formatTanggal(r.tanggal_rapat)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                        {r.jam_mulai?.slice(0, 5)} - {r.jam_selesai?.slice(0, 5)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700">
                                        {r.status_rapat}
                                    </td>
                                </tr>
                            ))}
                            {rapats.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="border border-gray-200 px-3 py-6 text-center text-sm text-gray-500"
                                    >
                                        Tidak ada data rapat untuk filter ini.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}