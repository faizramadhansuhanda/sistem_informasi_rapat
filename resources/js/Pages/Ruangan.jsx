import { router, useForm, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Ruangan({ ruangans }) {
    const { data, setData, post } = useForm({
        nama_ruangan: "",
        kapasitas: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/ruangan");
    };

    const toggleStatus = (id) => {
        router.patch(`/ruangan/${id}/toggle-status`);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Ruangan" />

            <h1 className="text-xl font-bold mb-4">Manajemen Ruangan</h1>

            {/* FORM */}
            <form onSubmit={submit} className="mb-6">
                <input
                    className="input mb-2"
                    placeholder="Nama Ruangan"
                    onChange={(e) =>
                        setData("nama_ruangan", e.target.value)
                    }
                />
                <input
                    className="input mb-2"
                    type="number"
                    placeholder="Kapasitas"
                    onChange={(e) =>
                        setData("kapasitas", e.target.value)
                    }
                />
                <button className="btn-primary">Tambah</button>
            </form>

            {/* TABEL */}
            <table className="w-full border">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Kapasitas</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {ruangans.map((r) => (
                        <tr key={r.id}>
                            <td className="border p-2">{r.nama_ruangan}</td>
                            <td className="border p-2">{r.kapasitas}</td>
                            <td className="border p-2">
                                {r.status_ruangan}
                            </td>
                            <td className="border p-2">
                                <button
                                    onClick={() => toggleStatus(r.id)}
                                    className={
                                        r.status_ruangan === "aktif"
                                            ? "bg-red-500 text-white px-3 py-1 rounded"
                                            : "bg-green-500 text-white px-3 py-1 rounded"
                                    }
                                >
                                    {r.status_ruangan === "aktif"
                                        ? "Nonaktifkan"
                                        : "Aktifkan"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
}
