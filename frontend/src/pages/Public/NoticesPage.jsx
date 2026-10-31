import React, { useState } from "react";
import { Bell, Download, Calendar, Search, FileText, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";

const resolveFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const clean = url.startsWith("/") ? url : `/${url}`;
    const backendBase = import.meta.env.VITE_BACKEND || "http://localhost:5000";
    return `${backendBase}${clean}`;
};

const NoticesPage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeNotice, setActiveNotice] = useState(null);

    const defaultNotices = [
        {
            id: 1,
            title_bn: "২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে নতুন ভর্তি ও ক্লাস রুটিন সংক্রান্ত জরুরি বিজ্ঞপ্তি",
            title_en: "Urgent Notice regarding New Admission and Class Routine for Academic Year 2026",
            date: "২৮ অক্টোবর, ২০২৬",
            date_en: "28 Oct 2026",
            category: "admission",
            category_name_bn: "ভর্তি সংক্রান্ত",
            category_name_en: "Admission",
            description_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের সকল অভিভাবক ও শিক্ষার্থীর অবগতির জন্য জানানো যাচ্ছে যে, ২০২৬ শিক্ষাবর্ষের সকল শ্রেণির ক্লাস কার্যক্রম সকাল ১০:০০ টায় প্রাত্যহিক সমাবেশের মাধ্যমে নিয়মিত রুটিন অনুযায়ী অনুষ্ঠিত হবে। শিক্ষার্থীদের নির্ধারিত পোশাকে সকাল ৯:৪৫ মিনিটের মধ্যে বিদ্যালয়ে উপস্থিত হতে নির্দেশ দেওয়া হলো।",
            description_en: "All guardians and students are informed that class activities for the 2026 academic year will proceed according to the regular schedule starting with Morning Assembly at 10:00 AM.",
            file_url: ""
        },
        {
            id: 2,
            title_bn: "১০ম শ্রেণির শিক্ষার্থীদের প্রাক-নির্বাচনী (Pre-Test) পরীক্ষার সময়সূচি ও প্রবেশপত্র বিতরণ",
            title_en: "Schedule and Admit Card Distribution for Class 10 Pre-Test Examination",
            date: "২৫ অক্টোবর, ২০২৬",
            date_en: "25 Oct 2026",
            category: "exam",
            category_name_bn: "পরীক্ষা সংক্রান্ত",
            category_name_en: "Examination",
            description_bn: "২০২৭ সালের এসএসসি পরীক্ষার্থীদের প্রাক-নির্বাচনী পরীক্ষা আগামী ৫ই নভেম্বর থেকে শুরু হবে। আগামী ৩রা নভেম্বরের মধ্যে সকল বকেয়া ফি পরিশোধ সাপেক্ষে অফিস কক্ষ থেকে প্রবেশপত্র সংগ্রহের জন্য নির্দেশ দেওয়া হচ্ছে।",
            description_en: "Pre-Test examinations for SSC 2027 candidates will commence on November 5. Admit cards must be collected from the office by November 3.",
            file_url: ""
        },
        {
            id: 3,
            title_bn: "উপবৃত্তি প্রাপ্ত শিক্ষার্থীদের তালিকা ও মোবাইল ব্যাংকিং (নগদ) হিসাব যাচাই সংক্রান্ত",
            title_en: "Verification of Mobile Financial Accounts (Nagad) for Stipend Beneficiaries",
            date: "২০ অক্টোবর, ২০২৬",
            date_en: "20 Oct 2026",
            category: "stipend",
            category_name_bn: "উপবৃত্তি ও সহায়তা",
            category_name_en: "Stipend",
            description_bn: "প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্টের আওতাধীন ২০২৬ শিক্ষাবর্ষের নির্বাচিত ছাত্রীদের মোবাইল ব্যাংকিং একাউন্ট সচল আছে কি না তা শ্রেণি শিক্ষকের সাথে যোগাযোগ করে নিশ্চিত করার জন্য অনুরোধ করা হলো।",
            description_en: "Beneficiaries under Prime Minister's Education Assistance Trust are advised to confirm that their registered Nagad mobile wallets are active.",
            file_url: ""
        },
        {
            id: 4,
            title_bn: "বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা ২০২৬ এর প্রস্তুতি ও রেজিস্ট্রেশন",
            title_en: "Registration and Preparation for Annual Sports and Cultural Fest 2026",
            date: "১৫ অক্টোবর, ২০২৬",
            date_en: "15 Oct 2026",
            category: "co_curricular",
            category_name_bn: "সহশিক্ষা ও সাংস্কৃতিক",
            category_name_en: "Co-curricular",
            description_bn: "আগামী ডিসেম্বর মাসে অনুষ্ঠিতব্য বিদ্যালয়ের বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতায় অংশগ্রহণে ইচ্ছুক ছাত্রীদের স্ব স্ব শ্রেণি শিক্ষকের কাছে নাম নিবন্ধনের আহ্বান জানানো যাচ্ছে।",
            description_en: "Students interested in participating in the Annual Sports & Cultural Competition are requested to submit their names to their respective class teachers.",
            file_url: ""
        }
    ];

    const sourceNotices = (cms?.notices && Array.isArray(cms.notices) && cms.notices.length > 0)
        ? cms.notices
        : defaultNotices;

    const notices = sourceNotices.map((n) => ({
        id: n.id,
        title: (lang === "bn" ? n.title_bn : n.title_en) || n.title_bn || n.title,
        date: lang === "bn" ? (n.date || n.date_bn) : (n.date_en || n.date),
        category: n.category || "general",
        categoryName: (lang === "bn" ? n.category_name_bn : n.category_name_en) || (lang === "bn" ? "সাধারণ" : "General"),
        description: (lang === "bn" ? n.description_bn : n.description_en) || n.description_bn || n.description,
        file_url: n.file_url || ""
    }));

    const filtered = notices.filter((n) => {
        const matchesCategory = selectedCategory === "all" || n.category === selectedCategory;
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "অফিসিয়াল বিজ্ঞপ্তি" : "Official Circulars"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navNotices")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের সকল প্রশাসনিক, একাডেমিক, পরীক্ষার ও ছুটির বিজ্ঞপ্তির কেন্দ্রীয় বাতায়ন।"
                            : "Central repository of all academic, administrative, holiday, and examination notices."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Filters & Search */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {[
                                    { id: "all", name: lang === "bn" ? "সকল নোটিশ" : "All Notices" },
                                    { id: "exam", name: lang === "bn" ? "পরীক্ষা" : "Exam" },
                                    { id: "admission", name: lang === "bn" ? "ভর্তি" : "Admission" },
                                    { id: "academic", name: lang === "bn" ? "একাডেমিক" : "Academic" }
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                            selectedCategory === cat.id
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full sm:w-60">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={lang === "bn" ? "বিজ্ঞপ্তি খুঁজুন..." : "Search notices..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notice Items List */}
                    <div className="space-y-3">
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/50 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-300 flex-shrink-0 text-center p-1">
                                        <Calendar className="w-4 h-4 mb-0.5" />
                                        <span className="text-[9px] font-bold uppercase leading-none">
                                            {lang === "bn" ? "অক্টোবর" : "OCT"}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400">
                                                {item.categoryName}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {lang === "bn" ? item.date : item.dateEn}
                                            </span>
                                        </div>
                                        <h3
                                            onClick={() => setActiveNotice(item)}
                                            className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors cursor-pointer"
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                    {item.file_url && (
                                        <a
                                            href={resolveFileUrl(item.file_url)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
                                            title="সংযুক্ত ফাইল ডাউনলোড বা দেখুন"
                                        >
                                            {item.file_url.toLowerCase().endsWith(".pdf") ? (
                                                <FileText className="w-3.5 h-3.5 text-red-500" />
                                            ) : (
                                                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                                            )}
                                            <span>{lang === "bn" ? "ফাইল" : "File"}</span>
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setActiveNotice(item)}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        {lang === "bn" ? "বিস্তারিত" : "Details"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                                {lang === "bn" ? "কোনো বিজ্ঞপ্তি পাওয়া যায়নি।" : "No notices found."}
                            </div>
                        )}
                    </div>

                    {/* Notice Detail Modal */}
                    {activeNotice && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-emerald-600">
                                        {activeNotice.categoryName} • {lang === "bn" ? activeNotice.date : activeNotice.dateEn}
                                    </span>
                                    <button
                                        onClick={() => setActiveNotice(null)}
                                        className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-0.5 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    {activeNotice.title}
                                </h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                                    {activeNotice.description}
                                </div>

                                {/* Attached File / Picture / PDF in Modal */}
                                {activeNotice.file_url && (
                                    <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                {activeNotice.file_url.toLowerCase().endsWith(".pdf") ? (
                                                    <FileText className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                                                )}
                                                <span>সংযুক্ত অফিশিয়াল ডকুমেন্ট / ছবি</span>
                                            </span>
                                            <a
                                                href={resolveFileUrl(activeNotice.file_url)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                <span>{lang === "bn" ? "ডাউনলোড / ওপেন" : "Download / Open"}</span>
                                            </a>
                                        </div>

                                        {!activeNotice.file_url.toLowerCase().endsWith(".pdf") && (
                                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-60 bg-black/20">
                                                <img
                                                    src={resolveFileUrl(activeNotice.file_url)}
                                                    alt="Notice Attachment"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        স্বাক্ষর: প্রধান শিক্ষক, ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
                                    </span>
                                    <button
                                        onClick={() => window.print()}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Download className="w-4 h-4" />
                                        {lang === "bn" ? "প্রিন্ট" : "Print"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar (4 cols) */}
                <div className="lg:col-span-4">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default NoticesPage;
