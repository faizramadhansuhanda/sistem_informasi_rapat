// import React from "react";
// import { Link, usePage } from "@inertiajs/react";

// export default function AdminLayout({ children }) {
//     const { url } = usePage();

//     const menu = [
//         { nama: "Dashboard", link: "/dashboard" },
//         { nama: "Jadwal Rapat", link: "/rapat" },
//         { nama: "Ruangan", link: "/ruangan" },
//         { nama: "Laporan", link: "/laporan" },
//     ];

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* SIDEBAR */}
//             <aside className="w-64 bg-blue-800 text-white">
//                 <div className="p-4 font-bold text-lg border-b border-blue-600">
//                     Admin Rapat
//                 </div>

//                 <nav className="p-4 space-y-2">
//                     {menu.map((m) => (
//                         <Link
//                             key={m.link}
//                             href={m.link}
//                             className={`block px-4 py-2 rounded 
//                                 ${
//                                     url === m.link
//                                         ? "bg-blue-600"
//                                         : "hover:bg-blue-700"
//                                 }`}
//                         >
//                             {m.nama}
//                         </Link>
//                     ))}
//                 </nav>
//             </aside>

//             {/* KONTEN */}
//             <main className="flex-1 p-6">{children}</main>
//         </div>
//     );
// }

// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { LogOut } from 'lucide-react';
// import dashboardIcon from '../../assets/icons/dashboard.svg';
// import bookingIcon from '../../assets/icons/kalender.svg';
// import facilityIcon from '../../assets/icons/room.svg';
// import reportIcon from '../../assets/icons/laporan.svg';

// export default function AdminLayout({ children }) {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const menuItems = [
//         {
//             name: 'Dashboard',
//             icon: dashboardIcon,
//             path: '/dashboard',
//         },
//         {
//             name: 'Jadwal Rapat',
//             icon: bookingIcon,
//             path: '/rapat',
//         },
//         {
//             name: 'Ruangan',
//             icon: facilityIcon,
//             path: '/ruangan',
//         },
//         {
//             name: 'Laporan',
//             icon: reportIcon,
//             path: '/laporan',
//         },
//     ];

//     const handleLogout = () => {
//         navigate('/login');
//     };

//     const isActive = (path) => {
//         return location.pathname === path;
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* SIDEBAR */}
//             <aside className="relative top-50 w-56 bg-blue-800 text-white rounded-[5rem] m-2 shadow-xl flex flex-col h-[calc(110vh-2rem)]">
//                 {/* Logo */}
//                 <div className="p-6 border-b border-gray-200">
//                     <h1 className="text-2xl font-bold text-center">
//                         PT<span className="font-normal"> PLN NUSANTARA POWER</span>
//                     </h1>
//                 </div>

//                 {/* Navigation Menu */}
//                 <nav className="flex-1 px-4 py-6 space-y-10">
//                     {menuItems.map((item) => {
//                         const active = isActive(item.path);

//                         return (
//                             <Link
//                                 key={item.path}
//                                 to={item.path}
//                                 className={`flex items-center gap-4 px-6 py-4 rounded-full font-semibold text-base transition-all ${
//                                     active
//                                         ? 'bg-black text-white shadow-lg'
//                                         : 'text-white hover:bg-gray-100'
//                                 }`}
//                             >
//                                 <img
//                                     src={item.icon}
//                                     alt={item.name}
//                                     className={`w-6 h-6 ${active ? 'brightness-100 invert' : ''}`}
//                                 />
//                                 {item.name}
//                             </Link>
//                         );
//                     })}
//                 </nav>

//                 {/* Logout Button */}
//                 <div className="p-4 border-t border-gray-200">
//                     <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-4 px-6 py-4 text-white-700 hover:bg-gray-100 rounded-full font-semibold text-base transition-all w-full"
//                     >
//                         <LogOut size={24} />
//                         Log out
//                     </button>
//                 </div>
//             </aside>

//             {/* KONTEN */}
//             <main className="flex-1 p-6">
//                 {children}
//             </main>
//         </div>
//     );
// }

import React from 'react';
import { Link } from '@inertiajs/react';  // Ganti dari react-router-dom
import { LogOut } from 'lucide-react';
import dashboardIcon from '../../assets/icons/dashboard.svg';
import bookingIcon from '../../assets/icons/kalender.svg';
import facilityIcon from '../../assets/icons/room.svg';
import reportIcon from '../../assets/icons/laporan.svg';

export default function AdminLayout({ children }) {
    // Membuat fungsi untuk mengecek apakah menu aktif
    const isActive = (path) => {
        return window.location.pathname === path;
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside className="relative top-50 w-56 bg-blue-500 text-white rounded-[5rem] m-2 shadow-xl flex flex-col h-[calc(110vh-2rem)]">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-1xl font-bold text-center">
                        PLN<span className="font-normal"> NUSANTARA POWER</span>
                    </h1>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-10">
                    {[
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Jadwal Rapat', icon: bookingIcon, path: '/rapat' },
                        { name: 'Ruangan', icon: facilityIcon, path: '/ruangan' },
                        { name: 'Laporan', icon: reportIcon, path: '/laporan' },
                    ].map((item) => {
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                href={item.path}  // Ganti 'to' dari react-router-dom menjadi 'href' untuk Inertia.js
                                className={`flex items-center gap-4 px-6 py-4 rounded-full font-semibold text-base transition-all ${
                                    active
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-white hover:bg-gray-100'
                                }`}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className={`w-6 h-6 ${active ? 'brightness-100 invert' : ''}`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => window.location.href = '/login'}  // Logout redirect
                        className="flex items-center gap-4 px-6 py-4 text-white-700 hover:bg-gray-100 rounded-full font-semibold text-base transition-all w-full"
                    >
                        <LogOut size={24} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* KONTEN */}
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
