import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";

const parseDateTime = (tanggal, jam) => {
    if (!tanggal || !jam) return null;
    return new Date(`${tanggal}T${jam}`);
};

const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatJam = (jam) => (jam ? jam.slice(0, 5) : "--:--");

const formatCountdown = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};

const buildSpeechText = (rapat) => {
    return `Perhatian kepada seluruh peserta rapat.\n\n`
        + `Lima menit lagi, rapat dengan topik ${rapat.topik_rapat} akan segera dimulai.\n\n`
        + `Rapat dijadwalkan pada ${formatTanggal(rapat.tanggal_rapat)}, `
        + `pukul ${formatJam(rapat.jam_mulai)}, `
        + `dipimpin oleh ${rapat.pimpinan_rapat}, `
        + `dan bertempat di ruangan ${rapat.ruangan?.nama_ruangan ?? "-"}.\n\n`
        + `Dimohon untuk segera bersiap dan menuju ruangan rapat.\n\n`
        + `Terima kasih.`;
};

const buildPopupDetails = (rapat) => ({
    topik: rapat.topik_rapat,
    ruangan: rapat.ruangan?.nama_ruangan ?? "-",
    pimpinan: rapat.pimpinan_rapat,
    tanggal: formatTanggal(rapat.tanggal_rapat),
    jam: `${formatJam(rapat.jam_mulai)} - ${formatJam(rapat.jam_selesai)}`,
});

export default function UserRapat() {
    const { rapats } = usePage().props;
    const [now, setNow] = useState(Date.now());
    const [popups, setPopups] = useState([]);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showAudioPrompt, setShowAudioPrompt] = useState(true);
    const notified10 = useRef(new Set());
    const notified5 = useRef(new Set());
    const popupTimers = useRef(new Map());
    const speechQueue = useRef([]);
    const isSpeaking = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        return () => {
            popupTimers.current.forEach((timer) => clearTimeout(timer));
            popupTimers.current.clear();
        };
    }, []);

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

    useEffect(() => {
        const upcoming = rapats.map((rapat) => {
            const mulai = parseDateTime(rapat.tanggal_rapat, rapat.jam_mulai);
            const selesai = parseDateTime(rapat.tanggal_rapat, rapat.jam_selesai);
            return { rapat, mulai, selesai };
        });

        upcoming.forEach(({ rapat, mulai }) => {
            if (!mulai) return;
            const diffMinutes = Math.round((mulai.getTime() - now) / 60000);

            if (diffMinutes <= 10 && diffMinutes >= 9 && !notified10.current.has(rapat.id)) {
                notified10.current.add(rapat.id);
                const details = buildPopupDetails(rapat);
                setPopups((prev) => [
                    {
                        id: rapat.id,
                        title: "Rapat akan dimulai 10 menit lagi",
                        details,
                    },
                    ...prev,
                ]);
                if (!popupTimers.current.has(rapat.id)) {
                    const timer = setTimeout(() => {
                        setPopups((prev) => prev.filter((item) => item.id !== rapat.id));
                        popupTimers.current.delete(rapat.id);
                    }, 90000);
                    popupTimers.current.set(rapat.id, timer);
                }
            }

            if (diffMinutes <= 5 && diffMinutes >= 4 && !notified5.current.has(rapat.id)) {
                notified5.current.add(rapat.id);
                if (audioEnabled) {
                    speechQueue.current.push(buildSpeechText(rapat));
                    triggerSpeech();
                }
            }
        });
    }, [now, rapats, audioEnabled]);

    const triggerSpeech = () => {
        if (isSpeaking.current || speechQueue.current.length === 0) return;
        const text = speechQueue.current.shift();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.onend = () => {
            isSpeaking.current = false;
            triggerSpeech();
        };
        isSpeaking.current = true;
        window.speechSynthesis.speak(utterance);
    };

    const enableAudio = () => {
        setAudioEnabled(true);
        setShowAudioPrompt(false);
        window.speechSynthesis.cancel();
    };

    const dismissAudioPrompt = () => {
        setShowAudioPrompt(false);
    };

    const groupedRapats = useMemo(() => {
        const mapped = rapats.map((rapat) => {
            const mulai = parseDateTime(rapat.tanggal_rapat, rapat.jam_mulai);
            const selesai = parseDateTime(rapat.tanggal_rapat, rapat.jam_selesai);
            const status = rapat.status_rapat ?? "Terjadwal";
            return { ...rapat, mulai, selesai, status };
        });

        return mapped.sort((a, b) => {
            const nowTime = now;
            const aOngoing = a.mulai && a.selesai && nowTime >= a.mulai.getTime() && nowTime <= a.selesai.getTime();
            const bOngoing = b.mulai && b.selesai && nowTime >= b.mulai.getTime() && nowTime <= b.selesai.getTime();
            if (aOngoing && !bOngoing) return -1;
            if (!aOngoing && bOngoing) return 1;

            const aUpcoming = a.mulai ? a.mulai.getTime() - nowTime : Infinity;
            const bUpcoming = b.mulai ? b.mulai.getTime() - nowTime : Infinity;
            if (aUpcoming >= 0 && bUpcoming >= 0) {
                return aUpcoming - bUpcoming;
            }
            if (aUpcoming >= 0 && bUpcoming < 0) return -1;
            if (aUpcoming < 0 && bUpcoming >= 0) return 1;
            return (b.mulai?.getTime() ?? 0) - (a.mulai?.getTime() ?? 0);
        });
    }, [rapats, now]);

    const rowCount = groupedRapats.length;
    const compactRows = rowCount >= 8;
    const denseRows = rowCount > 9;
    const compactHeader = rowCount >= 8;

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#F7F8FA] via-[#EAF2FF] to-[#DDEBFF] px-6 py-5 pb-32">
            <Head title="Jadwal Rapat" />

            <div className="w-full">
                <div className="rounded-3xl bg-white/90 px-6 py-4 shadow-lg backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className={`font-semibold text-slate-600 ${compactHeader ? "text-sm" : "text-base"}`}>
                                Welcome to PLN NUSANTARA POWER Managing System
                            </p>
                            <h1 className={`font-bold text-slate-900 ${compactHeader ? "text-3xl" : "text-4xl"}`}>
                                Jadwal Rapat
                            </h1>
                            <p className={`mt-1 text-slate-600 ${compactHeader ? "text-sm" : "text-base"}`}>
                                Informasi jadwal rapat untuk area lobby.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <img
                                src={import.meta.env.VITE_APP_LOGO_URL || "/images/pln-logo.png"}
                                alt="Logo PLN"
                                className={`rounded-full object-contain ${compactHeader ? "h-20 w-20" : "h-24 w-24"}`}
                            />
                            <span className={`font-semibold text-blue-700 tabular-nums ${compactHeader ? "text-lg" : "text-xl"}`}>
                                {new Date(now).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6">
                    <div className="rounded-3xl bg-white p-6 shadow-md">
                        <table
                            className={`w-full table-fixed border-collapse ${
                                compactRows ? "text-base" : "text-lg"
                            }`}
                        >
                            <thead>
                                <tr
                                    className={`text-left font-semibold uppercase tracking-wide text-slate-500 ${
                                        compactRows ? "text-sm" : "text-base"
                                    }`}
                                >
                                    <th className="w-[20%] px-3 py-3">Tanggal</th>
                                    <th className="w-[16%] px-3 py-3">Jam</th>
                                    <th className="w-[14%] px-3 py-3">Ruangan</th>
                                    <th className="w-[14%] px-3 py-3">Pimpinan</th>
                                    <th className="w-[26%] px-3 py-3">Topik</th>
                                    <th className="w-[10%] px-3 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedRapats.map((rapat) => {
                                    const ongoing = rapat.mulai && rapat.selesai
                                        && now >= rapat.mulai.getTime()
                                        && now <= rapat.selesai.getTime();
                                    const finished = rapat.status?.toLowerCase().includes("selesai");
                                    const countdown = ongoing ? formatCountdown(rapat.selesai.getTime() - now) : null;

                                    return (
                                        <tr
                                            key={rapat.id}
                                            className={`border-t transition ${
                                                ongoing
                                                    ? "bg-blue-50/80 font-semibold text-slate-900"
                                                    : "bg-white hover:bg-blue-50/60"
                                            }`}
                                        >
                                            <td className={`px-3 align-top text-slate-600 ${denseRows ? "py-2" : compactRows ? "py-2.5" : "py-3"}`}>
                                                {formatTanggal(rapat.tanggal_rapat)}
                                            </td>
                                            <td
                                                className={`px-3 align-top ${denseRows ? "py-2" : compactRows ? "py-2.5" : "py-3"}`}
                                            >
                                                <span
                                                    className={`inline-flex min-w-[140px] items-center justify-center whitespace-nowrap rounded-full bg-blue-100 px-3 ${
                                                        denseRows ? "py-1 text-sm" : compactRows ? "py-1 text-sm" : "py-1.5 text-base"
                                                    } font-semibold text-blue-700`}
                                                >
                                                    {formatJam(rapat.jam_mulai)} - {formatJam(rapat.jam_selesai)}
                                                </span>
                                                {ongoing && (
                                                    <span
                                                        className={`mt-1 block min-h-[20px] min-w-[160px] font-semibold text-blue-700 tabular-nums ${
                                                            denseRows ? "text-sm" : compactRows ? "text-sm" : "text-base"
                                                        }`}
                                                    >
                                                        Sisa waktu: {countdown}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`px-3 align-top ${denseRows ? "py-2" : compactRows ? "py-2.5" : "py-3"}`}>
                                                <span
                                                    className={`inline-flex w-full max-w-[150px] items-center justify-center truncate rounded-full bg-slate-100 px-3 ${
                                                        denseRows ? "py-1 text-sm" : compactRows ? "py-1 text-sm" : "py-1.5 text-base"
                                                    } font-semibold text-slate-600`}
                                                >
                                                    {rapat.ruangan?.nama_ruangan ?? "-"}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-3 align-top font-semibold text-slate-800 ${
                                                    denseRows ? "py-2" : compactRows ? "py-2.5" : "py-3"
                                                }`}
                                            >
                                                {rapat.pimpinan_rapat}
                                            </td>
                                            <td className={`px-3 align-top text-slate-700 ${denseRows ? "py-2" : compactRows ? "py-2.5" : "py-3"}`}>
                                                {rapat.topik_rapat}
                                            </td>
                                            <td className={`px-3 align-top ${denseRows ? "py-2" : compactRows ? "py-2.5" : "py-3"}`}>
                                                <span
                                                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 ${
                                                        denseRows ? "py-1 text-sm" : compactRows ? "py-1 text-sm" : "py-1.5 text-base"
                                                    } font-semibold ${
                                                        ongoing
                                                            ? "bg-blue-500 text-white shadow-sm"
                                                            : finished
                                                            ? "bg-slate-200 text-slate-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            ongoing
                                                                ? "bg-white"
                                                                : finished
                                                                ? "bg-gray-500"
                                                                : "bg-yellow-500 animate-pulse"
                                                        }`}
                                                        style={ongoing ? { animation: "blink 1.2s ease-in-out infinite" } : undefined}
                                                    />
                                                    {ongoing ? "Berlangsung" : rapat.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl bg-white p-5 shadow-md">
                    <h2 className="text-lg font-semibold text-slate-900">Denah Ruangan</h2>
                    <p className="mt-2 text-base text-slate-600">
                        Jika sudah tersedia, simpan tautan denah ruangan pada data ruangan
                        (contoh: kolom <span className="font-semibold">denah_url</span>) lalu
                        tampilkan gambar denah sesuai ruangan rapat.
                    </p>
                </div>
            </div>

            <div className="fixed right-6 top-6 space-y-3">
                {popups.map((popup) => (
                    <div
                        key={popup.id}
                        className="max-w-sm rounded-2xl bg-white p-4 text-base shadow-xl"
                    >
                        <p className="text-base font-semibold text-slate-900">{popup.title}</p>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                            <p><span className="font-semibold text-slate-700">Topik:</span> {popup.details.topik}</p>
                            <p><span className="font-semibold text-slate-700">Ruangan:</span> {popup.details.ruangan}</p>
                            <p><span className="font-semibold text-slate-700">Pimpinan:</span> {popup.details.pimpinan}</p>
                            <p><span className="font-semibold text-slate-700">Hari, Tanggal:</span> {popup.details.tanggal}</p>
                            <p><span className="font-semibold text-slate-700">Jam:</span> {popup.details.jam}</p>
                        </div>
                    </div>
                ))}
            </div>

            {showAudioPrompt && !audioEnabled && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-center shadow-2xl">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Aktifkan Audio Pengingat?
                        </h2>
                        <p className="mt-3 text-base text-slate-600">
                            Klik tombol di bawah agar pengingat suara aktif 5 menit sebelum rapat.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={enableAudio}
                                className="rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700"
                            >
                                Aktifkan Audio
                            </button>
                            <button
                                type="button"
                                onClick={dismissAudioPrompt}
                                className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Lewati
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 py-1 text-white shadow-[0_-6px_16px_rgba(15,23,42,0.2)]">
                <div className="overflow-hidden">
                    <div className="marquee-track whitespace-nowrap text-base font-semibold tracking-wide">
                        <span className="inline-block min-w-full px-6">
                            Selamat datang di PLN Nusantara Power • Pastikan rapat dimulai tepat waktu •
                            Jaga ketertiban area lobby • Terima kasih atas kerjasamanya
                        </span>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
                .marquee-track {
                    display: inline-block;
                    animation: marquee 18s linear infinite;
                }
            `}</style>
        </div>
    );
}