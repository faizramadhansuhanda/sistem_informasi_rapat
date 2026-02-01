import { router, useForm, Head } from "@inertiajs/react";
import React, { useMemo, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Ruangan({ ruangans }) {
    const { data, setData, post, put, errors, setError, clearErrors } = useForm({
        nama_ruangan: "",
        kapasitas: "",
        status_ruangan: "aktif",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formNotice, setFormNotice] = useState("");

    const { aktifCount, nonAktifCount } = useMemo(() => {
        const aktif = ruangans.filter((ruangan) => ruangan.status_ruangan === "aktif").length;
        const nonAktif = ruangans.length - aktif;
        return { aktifCount: aktif, nonAktifCount: nonAktif };
    }, [ruangans]);

    const submit = (e) => {
        e.preventDefault();
        setFormNotice("");
        clearErrors();
        const requiredFields = ["nama_ruangan", "kapasitas", "status_ruangan"];
        let hasError = false;
        requiredFields.forEach((field) => {
            if (!data[field]) {
                setError(field, "Wajib diisi");
                hasError = true;
            }
        });
        if (hasError) {
            setFormNotice("Lengkapi semua data sebelum menyimpan.");
            return;
        }
        if (isEditing && editingId) {
            put(`/ruangan/${editingId}`, {
                onSuccess: () => resetForm(),
            });
            return;
        }
        post("/ruangan", {
            onSuccess: () => resetForm(),
        });
    };

    const toggleStatus = (id) => {
        router.patch(`/ruangan/${id}/toggle-status`);
    };

    const hapusRuangan = (id) => {
        if (confirm("Yakin hapus ruangan ini?")) {
            router.delete(`/ruangan/${id}`);
        }
    };

    const resetForm = () => {
        setData({
            nama_ruangan: "",
            kapasitas: "",
            status_ruangan: "aktif",
        });
        setIsEditing(false);
        setEditingId(null);
        setFormNotice("");
        clearErrors();
    };

    const editRuangan = (ruangan) => {
        setIsEditing(true);
        setEditingId(ruangan.id);
        setData({
            nama_ruangan: ruangan.nama_ruangan ?? "",
            kapasitas: ruangan.kapasitas ?? "",
            status_ruangan: ruangan.status_ruangan ?? "aktif",
        });
        setFormNotice("");
        clearErrors();
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Ruangan" />

            <div className="rounded-3xl bg-gradient-to-r from-yellow-100 via-lime-100 to-lime-200 p-6 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            Welcome to PLN NUSANTARA POWER Managing System, Admin
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Ruangan
                        </h1>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl bg-white p-5 shadow-md">
                                <p className="text-sm text-gray-500">Ruangan Aktif</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {aktifCount}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-white p-5 shadow-md">
                                <p className="text-sm text-gray-500">Ruangan Non Aktif</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {nonAktifCount}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-md sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Daftar Ruangan</h2>
                                <p className="text-sm text-gray-500">Kelola ruangan yang tersedia.</p>
                            </div>
                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-green-600"
                                >
                                    Tambah Ruangan
                                </button>
                            ) : null}
                        </div>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full border-collapse rounded-2xl border border-gray-200">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            <th className="border border-gray-200 px-3 py-2">Nama Ruangan</th>
                                            <th className="border border-gray-200 px-3 py-2">Kapasitas</th>
                                            <th className="border border-gray-200 px-3 py-2">Status</th>
                                            <th className="border border-gray-200 px-3 py-2 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ruangans.map((r) => (
                                            <tr key={r.id} className="bg-gray-50 hover:bg-lime-50">
                                                <td className="border border-gray-200 px-3 py-3 font-semibold text-gray-800">
                                                    {r.nama_ruangan}
                                                </td>
                                                <td className="border border-gray-200 px-3 py-3 text-sm text-gray-700">
                                                    {r.kapasitas}
                                                </td>
                                                <td className="border border-gray-200 px-3 py-3 text-sm font-semibold">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            r.status_ruangan === "aktif"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {r.status_ruangan === "aktif" ? "Aktif" : "Tidak Aktif"}
                                                    </span>
                                                </td>
                                                <td className="border border-gray-200 px-3 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => editRuangan(r)}
                                                            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleStatus(r.id)}
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                                                                r.status_ruangan === "aktif"
                                                                    ? "bg-red-500 hover:bg-red-600"
                                                                    : "bg-green-500 hover:bg-green-600"
                                                            }`}
                                                        >
                                                            {r.status_ruangan === "aktif" ? "Nonaktif" : "Aktif"}
                                                        </button>
                                                         <button
                                                        type="button"
                                                        onClick={() => hapusRuangan(r.id)}
                                                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
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
                    </div>

                    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-md">
                        <h2 className="text-lg font-semibold text-gray-900">Tambah Ruangan</h2>

                        {formNotice ? (
                            <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formNotice}
                            </div>
                        ) : null}

                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Nama Ruangan
                                </label>
                                <input
                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                    placeholder="Nama ruangan"
                                    value={data.nama_ruangan}
                                    onChange={(e) =>
                                        setData("nama_ruangan", e.target.value)
                                    }
                                />
                                {errors.nama_ruangan ? (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.nama_ruangan}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Kapasitas
                                </label>
                                <input
                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
                                    type="number"
                                    min="1"
                                    placeholder="Kapasitas ruangan"
                                    value={data.kapasitas}
                                    onChange={(e) =>
                                        setData("kapasitas", e.target.value)
                                    }
                                />
                                {errors.kapasitas ? (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.kapasitas}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Status Ruangan
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData("status_ruangan", "aktif")}
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                                            data.status_ruangan === "aktif"
                                                ? "border-green-400 bg-green-100 text-green-700"
                                                : "border-gray-300 bg-white text-gray-600"
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData("status_ruangan", "tidak aktif")}
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                                            data.status_ruangan === "tidak aktif"
                                                ? "border-red-400 bg-red-100 text-red-700"
                                                : "border-gray-300 bg-white text-gray-600"
                                        }`}
                                    >
                                        Tidak Aktif
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                            >
                                {isEditing ? "Simpan Perubahan" : "Simpan"}
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
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}