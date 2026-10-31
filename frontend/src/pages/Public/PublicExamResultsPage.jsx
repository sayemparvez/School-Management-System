import React from "react";
import { Award, GraduationCap, TrendingUp, CheckCircle, ExternalLink, Calendar, Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import RightSidebar from "../../components/Public/RightSidebar";

const PublicExamResultsPage = () => {
    const { lang, t } = useLanguage();

    const yearlyResults = [
        {
            year: "২০২৫ (SSC 2025)",
            yearEn: "2025",
            totalExaminees: 118,
            passed: 118,
            passRate: "১০০%",
            passRateEn: "100%",
            gpa5Golden: 42,
            gpa5Total: 65,
            scholarships: 16
        },
        {
            year: "২০২৪ (SSC 2024)",
            yearEn: "2024",
            totalExaminees: 112,
            passed: 111,
            passRate: "৯৯.১%",
            passRateEn: "99.1%",
            gpa5Golden: 38,
            gpa5Total: 58,
            scholarships: 14
        },
        {
            year: "২০২৩ (SSC 2023)",
            yearEn: "2023",
            totalExaminees: 108,
            passed: 108,
            passRate: "১০০%",
            passRateEn: "100%",
            gpa5Golden: 35,
            gpa5Total: 52,
            scholarships: 12
        },
        {
            year: "২০২২ (SSC 2022)",
            yearEn: "2022",
            totalExaminees: 105,
            passed: 105,
            passRate: "১০০%",
            passRateEn: "100%",
            gpa5Golden: 32,
            gpa5Total: 49,
            scholarships: 11
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "শিক্ষা বোর্ড মূল্যায়ন বাতায়ন" : "Board Examination Performance"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navPublicExam")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুরের অধীনে অনুষ্ঠিত এসএসসি (SSC) পাবলিক পরীক্ষার ধারাবাহিক সাফল্য ও পরিসংখ্যান।"
                            : "Historical performance and statistics of Secondary School Certificate (SSC) public examinations under BISE Dinajpur."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Top Highlights Banner */}
                    <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center sm:text-left">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                                <Award className="w-4 h-4 text-amber-300" />
                                {lang === "bn" ? "দিনাজপুর শিক্ষা বোর্ডে শীর্ষস্থানীয় প্রতিষ্ঠান" : "Top Ranking Govt Institution in Dinajpur Board"}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black">
                                {lang === "bn" ? "এসএসসি ২০২৫-এ শতভাগ পাস ও ৪২টি গোল্ডেন জিপিএ ৫.০০!" : "100% Pass Rate & 42 Golden GPA 5.00 in SSC 2025!"}
                            </h3>
                            <p className="text-xs text-emerald-100 max-w-lg">
                                {lang === "bn"
                                    ? "সুদক্ষ শিক্ষকমণ্ডলী, নিয়মিত মডেল টেস্ট এবং নিবিড় পাঠদানের ফলে ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় প্রতিবছর ধারাবাহিক শতভাগ পাসের অনন্য গৌরব ধরে রেখেছে।"
                                    : "Through dedicated mentorship and rigorous model tests, our students consistently achieve exemplary board merit standings."}
                            </p>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center p-2 text-center flex-shrink-0">
                            <span className="text-3xl font-black text-amber-300 leading-none">১০০%</span>
                            <span className="text-[10px] text-white uppercase font-bold mt-1">পাসের হার</span>
                        </div>
                    </div>

                    {/* Historical Results Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                {lang === "bn" ? "বছরভিত্তিক এসএসসি পরীক্ষার ফলাফলের তুলনামূলক বিবরণী" : "Yearly SSC Examination Performance Table"}
                            </h3>
                            <span className="text-xs text-emerald-600 font-bold">
                                EIIN: {t("eiin")}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm text-left">
                                <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="py-3 px-4">পরীক্ষার সাল (Year)</th>
                                        <th className="py-3 px-4 text-center">পরীক্ষার্থী (Total)</th>
                                        <th className="py-3 px-4 text-center">উত্তীর্ণ (Passed)</th>
                                        <th className="py-3 px-4 text-center">পাসের হার (Pass Rate)</th>
                                        <th className="py-3 px-4 text-center">গোল্ডেন জিপিএ ৫ (Golden A+)</th>
                                        <th className="py-3 px-4 text-center">মোট জিপিএ ৫ (Total A+)</th>
                                        <th className="py-3 px-4 text-center">বোর্ড বৃত্তি (Scholarship)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {yearlyResults.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                                {lang === "bn" ? row.year : row.yearEn}
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-700 dark:text-slate-300">
                                                {row.totalExaminees}
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-white">
                                                {row.passed}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                                                    {lang === "bn" ? row.passRate : row.passRateEn}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-bold text-amber-600 dark:text-amber-400">
                                                {row.gpa5Golden}
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-bold text-blue-600 dark:text-blue-400">
                                                {row.gpa5Total}
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                                                {row.scholarships} {lang === "bn" ? "জন" : "girls"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Official Verification Link to Education Board */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                                {lang === "bn" ? "দিনাজপুর শিক্ষা বোর্ডের অফিশিয়াল রেজাল্ট সার্ভার" : "Official Dinajpur Education Board Results Portal"}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {lang === "bn" ? "বোর্ড রোল ও রেজিস্ট্রেশন দিয়ে বোর্ডের কেন্দ্রীয় ওয়েবসাইট থেকেও ফলাফল দেখা যাবে।" : "Access institutional results directly from the National Education Board Server."}
                            </p>
                        </div>
                        <a
                            href="http://www.educationboardresults.gov.bd/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 flex-shrink-0"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>educationboardresults.gov.bd</span>
                        </a>
                    </div>
                </div>

                {/* Right Sidebar (4 cols) */}
                <div className="lg:col-span-4">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default PublicExamResultsPage;
