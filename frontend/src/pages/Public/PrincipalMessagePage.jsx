import React from "react";
import {
    GraduationCap, Award, Printer, ArrowLeft, Mail, Phone, MapPin,
    Quote, Sparkles, Share2, CheckCircle2, Calendar, BookOpen
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";

const resolveMediaUrl = (url) => {
    if (!url) return "/headmaster.png";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    if (cleanUrl === "/headmaster.png" || cleanUrl.startsWith("/assets/")) return cleanUrl;
    const backendBase = import.meta.env.VITE_BACKEND || "http://localhost:5000";
    return `${backendBase}${cleanUrl}`;
};

const PrincipalMessagePage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const gData = cms?.general || {};
    const hm = cms?.headmaster || {};

    const headmasterName = (lang === "bn" ? hm.name_bn : hm.name_en) || "আবু জাফর মোঃ মোতাসিম বিল্লাহ্";
    const designation = (lang === "bn" ? hm.designation_bn : hm.designation_en) || "প্রধান শিক্ষক (ভারপ্রাপ্ত)";
    const headmasterPhoto = resolveMediaUrl(hm.image_url || "/headmaster.png");

    const speech = (lang === "bn" ? hm.message_bn : hm.message_en) || (lang === "bn"
        ? "বিসমিল্লাহির রাহমানির রাহিম। ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ডিজিটাল পোর্টালে সবাইকে আন্তরিক শুভেচ্ছা। ১৯৬৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের নারী শিক্ষার এক অনন্য বাতিঘর। নৈতিকতা, শৃঙ্খলা ও আধুনিক জ্ঞানসমৃদ্ধ পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে আত্মনির্ভরশীল ও আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের ব্রত। বর্তমান তথ্যপ্রযুক্তির যুগে আমাদের ছাত্রীরা যেন আধুনিক বিশ্বের সাথে তাল মিলিয়ে এগিয়ে যেতে পারে, সেজন্য আমরা মাল্টিমিডিয়া ক্লাসরুম ও তথ্যপ্রযুক্তিনির্ভর শিখন কার্যক্রম চালু করেছি। অভিভাবক, শিক্ষকমণ্ডলী ও শুভানুধ্যায়ীদের সহযোগিতায় এই বিদ্যাপীঠ তার গৌরবের ধারা অব্যাহত রাখবে—এটাই আমাদের প্রত্যাশা।"
        : "In the name of Allah, Most Gracious, Most Merciful. Welcome to the official digital portal of Dimla Government Girls' High School. Established in 1967, our institution stands as an exemplary beacon of female empowerment in northern Bangladesh. Our dedicated faculty tirelessly works to cultivate morally grounded, intellectually curious, and technologically proficient young leaders ready to make positive impacts on our nation and the world.");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* 1. Header Banner */}
            <div className="print:hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        {lang === "bn" ? "প্রেরণামূলক বার্তা ও প্রাতিষ্ঠানিক দর্শন" : "Inspirational Message & Vision"}
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black">
                        {lang === "bn" ? "প্রতিষ্ঠান প্রধানের বাণী" : "Message from Head Teacher"}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                        {lang === "bn"
                            ? "বিদ্যালয়ের একাডেমিক অগ্রযাত্রা, নারী শিক্ষার বিকাশ এবং শিক্ষার্থীদের মানবিক ও আধুনিক মানুষ হিসেবে গড়ে তোলার প্রত্যয়ে প্রধান শিক্ষকের বক্তব্য।"
                            : "Words of leadership, institutional values and academic commitment from the Head Teacher of Dimla Government Girls' High School."}
                    </p>
                </div>
            </div>

            {/* 2. Main Layout (8 cols + 4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8 relative overflow-hidden">
                        
                        {/* Top Action Bar */}
                        <div className="print:hidden flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                            <a
                                href="#/"
                                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {lang === "bn" ? "হোমপেজে ফিরে যান" : "Back to Home"}
                            </a>

                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
                            >
                                <Printer className="w-4 h-4 text-emerald-600" />
                                <span>{lang === "bn" ? "বাণী প্রিন্ট করুন" : "Print Message"}</span>
                            </button>
                        </div>

                        {/* Principal Profile Card */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/30 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/50 border border-emerald-100 dark:border-slate-700/60 mb-8">
                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-36 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border-4 border-emerald-600 shadow-xl bg-slate-200">
                                    <img
                                        src={headmasterPhoto}
                                        alt={headmasterName}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/headmaster.png";
                                        }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] whitespace-nowrap shadow-md">
                                    {designation}
                                </span>
                            </div>

                            <div className="text-center sm:text-left space-y-2 flex-1">
                                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                                    <Award className="w-4 h-4" />
                                    <span>{lang === "bn" ? "প্রতিষ্ঠান প্রধান" : "Head of Institution"}</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {headmasterName}
                                </h3>

                                <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    {designation} • {gData.school_name_bn || t("schoolName")}
                                </p>

                                <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                    <p className="flex items-center justify-center sm:justify-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{gData.address_bn || "ডিমলা, নীলফামারী"}</span>
                                    </p>
                                    <p className="flex items-center justify-center sm:justify-start gap-2">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{gData.email || "dimlagovtgirlshighschool@gmail.com"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Speech Body */}
                        <div className="relative">
                            <Quote className="w-12 h-12 text-emerald-100 dark:text-slate-800 absolute -top-4 -left-2 -z-0 pointer-events-none" />

                            <div className="relative z-10 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed sm:leading-loose text-justify">
                                <p className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-300">
                                    {lang === "bn" ? "প্রিয় শিক্ষার্থী, সম্মানিত অভিভাবক ও শুভানুধ্যায়ীবৃন্দ," : "Dear Students, Respected Guardians, and Well-Wishers,"}
                                </p>

                                <p className="first-letter:text-3xl first-letter:font-black first-letter:text-emerald-700 first-letter:mr-1 first-letter:float-left">
                                    {speech}
                                </p>

                                <p>
                                    {lang === "bn"
                                        ? "একটি বিদ্যালয় শুধু পাঠ্যপুস্তকের জ্ঞানার্জনের স্থান নয়; বরং এটি নৈতিক চরিত্র গঠন, দেশপ্রেম ও আত্মবিশ্বাস জাগ্রত করার পবিত্র অঙ্গন। আমাদের ছাত্রীরা যেন সুনাগরিক হিসেবে দেশ ও জাতির সেবায় আত্মনিয়োগ করতে পারে, সে লক্ষ্যে শিক্ষক ও অভিভাবকদের যৌথ প্রচেষ্টাই আমাদের সবচেয়ে বড় শক্তি।"
                                        : "Education at our institution transcends academic syllabus; we instill moral integrity, patriotism, empathy and resilience so each student emerges as an exemplary citizen ready to steer the nation forward."}
                                </p>

                                <p>
                                    {lang === "bn"
                                        ? "পরিশেষে, আমি আমাদের কোমলমতি শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ এবং বিদ্যালয়ের সার্বিক সাফল্য ও উত্তরোত্তর সমৃদ্ধি কামনা করছি। সবার প্রতি আন্তরিক ধন্যবাদ ও শুভকামনা।"
                                        : "I express heartfelt gratitude to our devoted teachers, supportive parents and well-wishers who make this journey memorable and fruitful. May our beloved institution continue to flourish."}
                                </p>
                            </div>
                        </div>

                        {/* Sign-off Seal Section */}
                        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-xs text-slate-500 space-y-1 text-center sm:text-left">
                                <div className="font-bold text-slate-700 dark:text-slate-300">
                                    {gData.school_name_bn || t("schoolName")}
                                </div>
                                <div>EIIN: {gData.eiin || "124754"} • স্থাপিত: {gData.est_year || "1967"} খ্রি.</div>
                                <div className="text-[11px] text-emerald-600 font-semibold">
                                    {lang === "bn" ? "ডিজিটাল ক্যাম্পাস ভিশন ২০২৬" : "Digital Campus Vision 2026"}
                                </div>
                            </div>

                            <div className="text-center sm:text-right">
                                <div className="inline-block p-2 border-b-2 border-slate-800 dark:border-slate-300 mb-1">
                                    <span className="font-serif italic text-sm font-black text-slate-800 dark:text-slate-100">
                                        {headmasterName}
                                    </span>
                                </div>
                                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                                    {designation}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                    {gData.school_name_bn || t("schoolName")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default PrincipalMessagePage;
