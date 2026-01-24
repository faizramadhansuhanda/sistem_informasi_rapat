// import React, { useState, useEffect } from "react";
// import { Head } from "@inertiajs/react";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
// import AdminLayout from "@/Layouts/AdminLayout";  // Import AdminLayout


// export default function Dashboard() {
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [rapats, setRapat] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalRapat, setTotalRapat] = useState(43); // Contoh data Total Rapat
//   const [totalRuangan, setTotalRuangan] = useState(11); // Contoh data Total Ruangan
//   const [rapatHariIni, setRapatHariIni] = useState(5); // Contoh data Rapat Hari Ini
//   const [statistikStatus, setStatistikStatus] = useState({ Selesai: 10, Terjadwal: 20 }); // Contoh data Statistik Status

  
//   const formatTanggal = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
//   };


//   return (
//     <AdminLayout>
//       <Head title="Dashboard Admin" />

//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6">
//           Dashboard Sistem Informasi Rapat
//         </h1>

//         {/* KARTU RINGKASAN */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Rapat */}
//           <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Rapat Bulan Ini</h3>
//             <h2 className="text-3xl font-bold">{totalRapat}</h2>
//             <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange-500 rounded-tl-full opacity-80"></div>
//           </div>

//           {/* Total Ruangan */}
//           <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
//             <p className="text-lg font-semibold text-gray-700 mb-2">Total Ruangan</p>
//             <h2 className="text-3xl font-bold">{totalRuangan}</h2>
//             <div className="absolute bottom-0 right-0 w-16 h-16 bg-yellow-300 rounded-tl-full opacity-80"></div>
//           </div>

//           {/* Rapat Hari Ini */}
//           {/* <div className="bg-white p-6 rounded-lg shadow-lg">
//             <p className="text-gray-500">Rapat Hari Ini</p>
//             <h2 className="text-3xl font-bold">{rapatHariIni}</h2>
//           </div> */}
//           {/* Rapat Hari Ini */}
//             <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">Rapat Hari Ini</h3>
//             <h2 className="text-3xl font-bold">{rapatHariIni}</h2>
//             <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-400 rounded-tl-full opacity-80"></div>
//           </div>

//           {/* Rapat Selesai */}
//           <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
//             <p className="text-lg font-semibold text-gray-700">Rapat Selesai</p>
//             <h2 className="text-3xl font-bold">{statistikStatus.Selesai}</h2>
//             <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-300 rounded-tl-full opacity-80"></div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
//         {/* GRAFIK MINGGUAN */}
//         <div className="bg-white rounded-3xl p-6 shadow-lg">
//           <h3 className="text-xl font-semibold text-gray-900 mb-3">Grafik Rapat Mingguan</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyData}>
//               <CartesianGrid 
//                 stroke="#000000"
//                 strokeWidth={1.5}
//                 strokeDasharray="0"
//                 horizontal={true}
//                 vertical={false}
//                 />
//             <XAxis dataKey="day" tick={{ fontSize: 12 }} />
//             <YAxis tick={{ fontSize: 12 }} />
//             <Tooltip />

//             <Bar 
//                 dataKey="rapats" 
//                 fill="#000000" 
//                 radius={[20, 20, 20, 20]} 
//             />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* GRAFIK BULANAN */}
//         <div className="bg-white rounded-3xl p-6 shadow-lg">
//           <h3 className="text-xl font-semibold text-gray-900 mb-6">Grafik Rapat Bulanan</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={monthlyData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="week" tick={{ fontSize: 12 }} />
//               <YAxis 
//                  tick={{ fontSize: 12 }}
//                  allowDecimals={false}
//               />
//               <Tooltip />
//               <Line type="monotone" dataKey="rapats" stroke="#000000" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         </div>

//         {/* TABEL RAPAT TERBARU */}
//         <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg mt-6 sm:mt-10">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Tabel Rapat Terbaru</h3>
          
//           <div className="overflow-x-auto -mx-4 sm:mx-0">
//             <div className="inline-block min-w-full align-middle">
//                 <div className="overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                             <thead>
//                                 <tr className="bg-blue-200 rounded-3xl text-center">
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Waktu Rapat</th>
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Nama Pimpinan</th>
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Topik</th>
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Ruangan</th>
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Tanggal</th>
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Jam</th>
//                                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-red-1000">
//                                 {rapats.map((r) => (
//                                     <tr key={r.id}>
//                                       <td>{r.pimpinan_rapat}</td>
//                                       <td>{r.topik_rapat}</td>
//                                       <td>{r.ruangan?.nama_ruangan}</td>
//                                       <td>{formatTanggal(r.tanggal_rapat)}</td>
//                                       <td>{r.jam_mulai.slice(0,5)} - {r.jam_selesai.slice(0,5)}</td>
//                                       <td>{r.status_rapat}</td>
//                                     </tr>

//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>      
//             </div>
//         </div>
//     </div>
//     </AdminLayout>
//   );
// };

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
