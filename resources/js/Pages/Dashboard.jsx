import React, { useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from "recharts";
import AdminLayout from "@/Layouts/AdminLayout";


export default function Dashboard() {
  const {
    totalRapat,
    totalRuangan,
    rapatHariIni,
    rapatSelesai,
    weeklyData,
    monthlyData,
    rapats
  } = usePage().props;

  const formatTanggal = (tanggal) => {
    const d = new Date(tanggal);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({
        only: ["rapats"],
        preserveState: true,
        preserveScroll: true,
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <Head title="Dashboard Admin" />

          {/* KARTU RINGKASAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Total Rapat */}
           <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
             <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Rapat Bulan Ini</h3>
             <h2 className="text-3xl font-bold">{totalRapat}</h2>
             <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange-400 rounded-tl-full opacity-80"></div>
           </div>

           {/* Total Ruangan */}
           <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
             <p className="text-lg font-semibold text-gray-700 mb-2">Total Ruangan</p>
             <h2 className="text-3xl font-bold">{totalRuangan}</h2>
             <div className="absolute bottom-0 right-0 w-16 h-16 bg-yellow-300 rounded-tl-full opacity-80"></div>
           </div>

 
           {/* Rapat Hari Ini */}
             <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
             <h3 className="text-lg font-semibold text-gray-700 mb-2">Rapat Hari Ini</h3>
             <h2 className="text-3xl font-bold">{rapatHariIni}</h2>
             <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-400 rounded-tl-full opacity-80"></div>
           </div>

           {/* Rapat Selesai */}
           <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
             <p className="text-lg font-semibold text-gray-700">Rapat Selesai</p>
             <h2 className="text-3xl font-bold">{rapatSelesai}</h2>
             <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-300 rounded-tl-full opacity-80"></div>
           </div>
         </div>

      {/* KARTU */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Rapat Bulan Ini" value={totalRapat} color="orange" />
        <Card title="Total Ruangan Aktif" value={totalRuangan} color="yellow" />
        <Card title="Rapat Hari Ini" value={rapatHariIni} color="green" />
        <Card title="Rapat Selesai" value={rapatSelesai} color="blue" />
      </div> */}

      {/* GRAFIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartBar title="Grafik Rapat Mingguan" data={weeklyData} />
        <ChartLine title="Grafik Rapat Bulanan" data={monthlyData} />
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-3xl p-6 shadow-lg mt-10">
        <h3 className="text-xl font-bold mb-6 text-blck-1000 flex items-center gap-2">
          Rapat Terbaru
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm uppercase tracking-wide text-gray-600">
                <th className="px-4">Pimpinan</th>
                <th>Topik</th>
                <th>Ruangan</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>

            <tbody>
                {rapats.map(r => (
                  <tr
                    key={r.id}
                    className={`
                      transition-all duration-500
                      ${r.status_sort === 1 
                        ? 'bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.35)]'
                        : 'bg-gray-50 hover:bg-blue-50'}
                      rounded-xl shadow-sm
                    `}
                  >
                    {/* Pimpinan */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {r.pimpinan_rapat}
                    </td>

                    {/* Topik */}
                    <td className="py-3 text-gray-700">
                      {r.topik_rapat}
                    </td>

                    {/* Ruangan */}
                    <td className="py-3">
                      <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                        {r.ruangan?.nama_ruangan}
                      </span>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3 text-gray-600">
                      {formatTanggal(r.tanggal_rapat)}
                    </td>

                    {/* Jam */}
                    <td className="py-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {r.jam_mulai.slice(0,5)} – {r.jam_selesai.slice(0,5)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
                          ${r.status_sort === 1
                            ? 'bg-green-100 text-green-700 shadow-green-300/50 shadow-md'
                            : r.status_sort === 2
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-700'}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full
                            ${r.status_sort === 1
                              ? 'bg-green-500 animate-blink'
                              : r.status_sort === 2
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'}`}
                        />
                        {r.status_sort === 1
                          ? 'Berlangsung'
                          : r.status_sort === 2
                          ? 'Terjadwal'
                          : 'Selesai'}                         
                      </span>
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

/* ===== KOMPONEN KECIL ===== */
const Card = ({ title, value }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg">
    <h3 className="text-gray-700 mb-2">{title}</h3>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);

const ChartBar = ({ title, data }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg">
    <h3 className="mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rapats" fill="#000" radius={[15,15,15,15]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ChartLine = ({ title, data }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg">
    <h3 className="mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Line dataKey="rapats" stroke="#000" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
