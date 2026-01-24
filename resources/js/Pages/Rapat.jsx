import React from "react";
import { useForm, router, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// 🔹 GENERATE JAM PER 30 MENIT
const generateJam = () => {
    const jam = [];
    for (let h = 0; h < 24; h++) {
        for (let m of ["00", "30"]) {
            jam.push(
                `${String(h).padStart(2, "0")}:${m}`
            );
        }
    }
    return jam;
};

// 🔹 FORMAT TANGGAL → Senin, 22 01 2026
   const formatTanggal = (tanggal) => {
        return new Date(tanggal).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };


export default function Rapat({ rapats, ruangans }) {
    console.log(rapats); 
    const jamOptions = generateJam();

    const { data, setData, post } = useForm({
        topik_rapat: "",
        ruangan_id: "",
        tanggal_rapat: "",
        jam_mulai: "",
        jam_selesai: "",
        pimpinan_rapat: "",
        fasilitas: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/rapat");
    };

    const hapus = (id) => {
        if (confirm("Yakin hapus rapat ini?")) {
            router.delete(`/rapat/${id}`);
        }
    };

 

    return (
        <AdminLayout>
            <Head title="Manajemen Rapat" />

            <h1 className="text-xl font-bold mb-4">Manajemen Rapat</h1>
            
            {/* ===== FORM INPUT ===== */}
            <form
                onSubmit={submit}
                className="grid grid-cols-2 gap-3 mb-6"
            >
                <input
                    className="input col-span-2"
                    placeholder="Topik Rapat"
                    onChange={(e) =>
                        setData("topik_rapat", e.target.value)
                    }
                />

                <select
                    className="input"
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

                <input
                    type="date"
                    className="input"
                    onChange={(e) =>
                        setData("tanggal_rapat", e.target.value)
                    }
                />

                {/* JAM MULAI */}
                <select
                    className="input"
                    onChange={(e) =>
                        setData("jam_mulai", e.target.value)
                    }
                >
                    <option value="">Jam Mulai</option>
                    {jamOptions.map((j) => (
                        <option key={j} value={j}>
                            {j}
                        </option>
                    ))}
                </select>

                {/* JAM SELESAI */}
                <select
                    className="input"
                    onChange={(e) =>
                        setData("jam_selesai", e.target.value)
                    }
                >
                    <option value="">Jam Selesai</option>
                    {jamOptions.map((j) => (
                        <option key={j} value={j}>
                            {j}
                        </option>
                    ))}
                </select>

                <input
                    className="input"
                    placeholder="Pimpinan Rapat"
                    onChange={(e) =>
                        setData("pimpinan_rapat", e.target.value)
                    }
                />

                <input
                    className="input col-span-2"
                    placeholder="Fasilitas (LCD, Mic, Zoom, dll)"
                    onChange={(e) =>
                        setData("fasilitas", e.target.value)
                    }
                />

                <button className="btn-primary col-span-2">
                    Simpan Rapat
                </button>
            </form>

            {/* ===== TABEL RAPAT ===== */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg mt-6 sm:mt-10">

            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden"></div>
                        <table className="w-full border">
                            <thead className="bg-yellow-100">
                                <tr>
                                    <th className="border p-2">Pimpinan</th>
                                    <th className="border p-2">Topik</th>
                                    <th className="border p-2">Ruangan</th>
                                    <th className="border p-2">Tanggal</th>
                                    <th className="border p-2">Jam</th>
                                    <th className="border p-2">Fasilitas</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-red-100">
                                {rapats.map((r) => (
                                    <tr key={r.id}>
                                        <td className="border p-2">
                                            {r.pimpinan_rapat}
                                        </td>
                                        <td className="border p-2">
                                            {r.topik_rapat}
                                        </td>
                                        <td className="border p-2">
                                            {r.ruangan.nama_ruangan}
                                        </td>
                                        <td className="border p-2">
                                            {formatTanggal(r.tanggal_rapat)}
                                        </td>
                                        <td className="border p-2">
                                            {r.jam_mulai.slice(0,5)} - {r.jam_selesai.slice(0,5)}
                                        </td>
                                        <td className="border p-2">
                                            {r.fasilitas ?? "-"}
                                        </td>
                                        <td className="border p-2">
                                            {r.status_rapat}
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                className="text-red-600"
                                                onClick={() => hapus(r.id)}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
           </div>
        </AdminLayout>
    );
}
