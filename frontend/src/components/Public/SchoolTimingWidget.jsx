import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";

const SchoolTimingWidget = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    const day = currentTime.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // School is open Sunday(0) to Thursday(4) between 10:00 AM (600 mins) and 4:00 PM (960 mins)
    const isWeekend = day === 5 || day === 6; // Friday or Saturday
    const isOpen = !isWeekend && totalMinutes >= 600 && totalMinutes <= 960;

    const tData = cms?.timings || {};

    const timings = [
        {
            titleBn: "প্রাত্যহিক সমাবেশ",
            titleEn: "Morning Assembly",
            timeBn: tData.assembly_bn || "১০:০০ AM - ১০:১৫ AM",
            timeEn: tData.assembly_en || "10:00 AM - 10:15 AM"
        },
        {
            titleBn: "পাঠদান (১ম পর্ব)",
            titleEn: "Classes (1st Half)",
            timeBn: tData.first_half_bn || "১০:১৫ AM - ০১:১৫ PM",
            timeEn: tData.first_half_en || "10:15 AM - 01:15 PM"
        },
        {
            titleBn: "টিফিন বিরতি",
            titleEn: "Tiffin Break",
            timeBn: tData.tiffin_break_bn || "০১:১৫ PM - ০২:০০ PM",
            timeEn: tData.tiffin_break_en || "01:15 PM - 02:00 PM"
        },
        {
            titleBn: "পাঠদান ও ছুটি",
            titleEn: "Classes & Dismissal",
            timeBn: tData.second_half_bn || "০২:০০ PM - ০৪:০০ PM",
            timeEn: tData.second_half_en || "02:00 PM - 04:00 PM"
        },
        {
            titleBn: "অফিস সময়",
            titleEn: "Office Hours",
            timeBn: tData.office_hours_bn || "০৯:৩০ AM - ০৪:৩০ PM",
            timeEn: tData.office_hours_en || "09:30 AM - 04:30 PM"
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all group hover:shadow-md">
            {/* Header matching Image 1 & 2 */}
            <div className="bg-[#0b5ec8] dark:bg-[#0c5adb] text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-100" />
                    <h3 className="font-bold text-sm tracking-wide">
                        {lang === "bn" ? "প্রতিষ্ঠানের সময়সূচি" : "Institution Schedule"}
                    </h3>
                </div>

                {/* Live Open / Closed Pulse Badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 backdrop-blur">
                    <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-300 animate-ping" : "bg-red-400"}`}></span>
                    <span>
                        {isOpen
                            ? (lang === "bn" ? "স্কুল খোলা" : "Open Now")
                            : isWeekend
                            ? (lang === "bn" ? "সাপ্তাহিক ছুটি" : "Weekend")
                            : (lang === "bn" ? "এখন বন্ধ" : "Closed")}
                    </span>
                </div>
            </div>

            {/* Timing Rows matching Image 1 & 2 */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-1">
                {timings.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between py-2.5 px-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {lang === "bn" ? item.titleBn : item.titleEn}
                        </span>
                        <span className="text-xs font-extrabold text-[#047857] dark:text-emerald-400 font-mono">
                            {lang === "bn" ? item.timeBn : item.timeEn}
                        </span>
                    </div>
                ))}
            </div>

            {/* Friday / Saturday Note */}
            <div className="px-3.5 pb-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                <span>{lang === "bn" ? "ছুটির দিন: শুক্রবার ও শনিবার" : "Holidays: Friday & Saturday"}</span>
                <span className="text-red-500 font-bold">সাপ্তাহিক ছুটি</span>
            </div>
        </div>
    );
};

export default SchoolTimingWidget;
