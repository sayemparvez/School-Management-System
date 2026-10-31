import React from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import SchoolTimingWidget from "./SchoolTimingWidget";
import StudentCornerWidget from "./StudentCornerWidget";
import GovtPortalsWidget from "./GovtPortalsWidget";
import DynamicPrayerWidget from "./DynamicPrayerWidget";
import EmergencyHotlinesWidget from "./EmergencyHotlinesWidget";

const RightSidebar = () => {
    const { lang, t } = useLanguage();

    return (
        <aside className="w-full space-y-5">
            {/* 1. প্রতিষ্ঠানের সময়সূচি */}
            <SchoolTimingWidget />

            {/* 2. স্টুডেন্ট কর্নার */}
            <StudentCornerWidget />

            {/* 3. জরুরি লিংক ও তথ্য বাতায়ন (Executive BD Govt e-Services Portal Suite) */}
            <GovtPortalsWidget />

            {/* 4. নামাজের সময়সূচি (Dynamic Prayer Widget with live ticking clock & active Waqt highlight) */}
            <DynamicPrayerWidget />

            {/* 5. জাতীয় জরুরি সেবা হটলাইন (333, 999, 109, 106, 1090, 1098) */}
            <EmergencyHotlinesWidget />

            {/* 6. বিদ্যালয়ের অবস্থান ও গুগল ম্যাপ */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 transition-all">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                            {t("schoolLocation")}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            {lang === "bn" ? "ডিমলা, নীলফামারী সদর" : "Dimla, Nilphamari Sadar"}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video relative flex items-center justify-center text-center p-3">
                    <iframe
                        title="Dimla Govt Girls High School Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14346.85324546875!2d88.92!3d26.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e3650000000001%3A0x0!2sDimla%2C%20Nilphamari!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
                        className="w-full h-full border-0 absolute inset-0 opacity-80 hover:opacity-100 transition-opacity"
                        loading="lazy"
                    ></iframe>
                </div>
                <div className="mt-2 text-center">
                    <a
                        href="https://maps.google.com/?q=Dimla+Government+Girls+High+School"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-600 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                        <MapPin className="w-3 h-3" />
                        {lang === "bn" ? "গুগল ম্যাপে বড় করে দেখুন" : "View Large on Google Maps"}
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
