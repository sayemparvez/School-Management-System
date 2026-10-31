import React, { useState, useEffect } from "react";
import { Clock, Compass, Sparkles, Moon, Sun } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const toBanglaDigits = (str) => {
    const banglaDigits = {
        "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
        "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
    };
    return String(str).replace(/[0-9]/g, (w) => banglaDigits[w] || w);
};

const DynamicPrayerWidget = () => {
    const { lang } = useLanguage();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live clock update every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Base prayer schedule for Dimla / Nilphamari (GMT+6)
    const prayers = [
        { id: "fajr", nameBn: "ফজর", nameEn: "Fajr", timeBn: "০৫:০৫ AM", timeEn: "05:05 AM", hour: 5, minute: 5 },
        { id: "sunrise", nameBn: "সূর্যোদয়", nameEn: "Sunrise", timeBn: "০৬:১৮ AM", timeEn: "06:18 AM", hour: 6, minute: 18, isSun: true },
        { id: "dhuhr", nameBn: "যোহর", nameEn: "Dhuhr", timeBn: "০১:১৫ PM", timeEn: "01:15 PM", hour: 13, minute: 15 },
        { id: "asr", nameBn: "আসর", nameEn: "Asr", timeBn: "০৪:১৫ PM", timeEn: "04:15 PM", hour: 16, minute: 15 },
        { id: "maghrib", nameBn: "মাগরিব", nameEn: "Maghrib", timeBn: "০৫:৩০ PM", timeEn: "05:30 PM", hour: 17, minute: 30 },
        { id: "isha", nameBn: "এশা", nameEn: "Isha", timeBn: "০৭:০০ PM", timeEn: "07:00 PM", hour: 19, minute: 0 }
    ];

    // Determine current / next prayer
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const getActivePrayer = () => {
        if (currentTotalMinutes >= 5 * 60 + 5 && currentTotalMinutes < 6 * 60 + 18) return "fajr";
        if (currentTotalMinutes >= 13 * 60 + 15 && currentTotalMinutes < 16 * 60 + 15) return "dhuhr";
        if (currentTotalMinutes >= 16 * 60 + 15 && currentTotalMinutes < 17 * 60 + 30) return "asr";
        if (currentTotalMinutes >= 17 * 60 + 30 && currentTotalMinutes < 19 * 60) return "maghrib";
        if (currentTotalMinutes >= 19 * 60 || currentTotalMinutes < 5 * 60 + 5) return "isha";
        return null;
    };

    const activePrayerId = getActivePrayer();

    // Format current live time
    const timeString = currentTime.toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const dateString = currentTime.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all group hover:shadow-md">
            {/* Header with Islamic Arch and Gradient */}
            <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white p-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-3 -translate-y-2 opacity-15 text-6xl">
                    🕌
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-teal-200 backdrop-blur">
                            <Moon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                                {lang === "bn" ? "নামাজের সময়সূচি" : "Prayer Times"}
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            </h3>
                            <p className="text-[10px] text-teal-200">
                                {lang === "bn" ? "ডিমলা ও নীলফামারী অঞ্চল" : "Dimla, Nilphamari (GMT+6)"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Live Digital Clock Bar */}
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-emerald-200 text-[11px] font-mono">
                        <Clock className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: "12s" }} />
                        <span className="font-bold text-white text-xs">{timeString}</span>
                    </div>
                    <span className="text-[10px] text-teal-200/90 font-medium">
                        {dateString}
                    </span>
                </div>
            </div>

            {/* Prayers List */}
            <div className="p-3 space-y-1.5">
                {prayers.map((prayer) => {
                    const isActive = activePrayerId === prayer.id;
                    return (
                        <div
                            key={prayer.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                                isActive
                                    ? "bg-emerald-600 text-white shadow-sm font-bold scale-[1.02]"
                                    : prayer.isSun
                                    ? "bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40"
                                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs">
                                    {prayer.isSun ? "☀️" : isActive ? "🕌" : "⏱️"}
                                </span>
                                <span>{lang === "bn" ? prayer.nameBn : prayer.nameEn}</span>
                                {isActive && (
                                    <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-extrabold uppercase animate-pulse">
                                        {lang === "bn" ? "চলমান ওয়াক্ত" : "Current"}
                                    </span>
                                )}
                            </div>
                            <span className={`font-mono font-bold ${isActive ? "text-white" : "text-emerald-700 dark:text-emerald-400"}`}>
                                {lang === "bn" ? prayer.timeBn : prayer.timeEn}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Hadith / Notice */}
            <div className="px-3 pb-3 text-center">
                <div className="p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-[10px] text-teal-800 dark:text-teal-300 italic">
                    {lang === "bn"
                        ? "“নিশ্চয়ই নির্দিষ্ট সময়ে নামাজ কায়েম করা মুমিনদের উপর ফরজ।” — আল-কুরআন"
                        : "“Indeed, prayer has been decreed upon the believers a decree of specified times.” — Quran"}
                </div>
            </div>
        </div>
    );
};

export default DynamicPrayerWidget;
