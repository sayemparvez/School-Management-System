import React, { useState, useMemo } from "react";
import { Users, Shield, Award, Phone, Mail, Calendar, CheckCircle, Search, UserCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";

const resolveMediaUrl = (url, fallback = "/headmaster.png") => {
    if (!url) return fallback;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
    }
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    if (cleanUrl === "/headmaster.png" || cleanUrl.startsWith("/assets/") || cleanUrl.startsWith("/uploads/")) {
        return cleanUrl;
    }
    const backendBase = import.meta.env.VITE_BACKEND || "http://localhost:5000";
    return `${backendBase}${cleanUrl}`;
};

const CommitteePage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const [selectedRole, setSelectedRole] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const defaultCommittee = [
        {
            id: 1,
            name: lang === "bn" ? "উপজেলা নির্বাহী অফিসার (ইউএনও)" : "Upazila Nirbahi Officer (UNO)",
            role: "সভাপতি",
            role_en: "President",
            sub: lang === "bn" ? "উপজেলা প্রশাসন, ডিমলা, নীলফামারী" : "Upazila Administration, Dimla, Nilphamari",
            phone: "০১৭১৩-৫৫XXXX",
            email: "unodimla@mopa.gov.bd",
            term: lang === "bn" ? "পদাধিকার বলে" : "Ex-Officio",
            badgeColor: "bg-emerald-500 text-white",
            image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 2,
            name: lang === "bn" ? (cms?.headmaster?.name_bn || "আবু জাফর মোঃ মোতাসিম বিল্লাহ্") : (cms?.headmaster?.name_en || "Abu Jafor Md. Motasim Billah"),
            role: "সদস্য সচিব",
            role_en: "Member Secretary",
            sub: lang === "bn" ? "প্রধান শিক্ষক (ভারপ্রাপ্ত), ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়" : "Head Teacher (Acting), Dimla Govt Girls' High School",
            phone: "০১৭১২-৩৪৫৬৭৮",
            email: "headteacher.dimlagirls@gmail.com",
            term: lang === "bn" ? "পদাধিকার বলে" : "Ex-Officio",
            badgeColor: "bg-teal-600 text-white",
            image_url: "/headmaster.png"
        },
        {
            id: 3,
            name: lang === "bn" ? "মোঃ রফিকুল ইসলাম" : "Md. Rafiqul Islam",
            role: "অভিভাবক সদস্য",
            role_en: "Guardian Representative",
            sub: lang === "bn" ? "সমাজসেবক ও শিক্ষানুরাগী, ডিমলা" : "Social Worker & Education Enthusiast, Dimla",
            phone: "০১৭২৩-XXXXXX",
            email: "rafiqul.dimla@gmail.com",
            term: lang === "bn" ? "২০২৪ – ২০২৬ শিক্ষাবর্ষ" : "2024 – 2026 Term",
            badgeColor: "bg-blue-600 text-white",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 4,
            name: lang === "bn" ? "মোছাঃ পারভীন আক্তার" : "Mst. Parvin Akter",
            role: "শিক্ষক প্রতিনিধি",
            role_en: "Teacher Representative",
            sub: lang === "bn" ? "সিনিয়র শিক্ষক, ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়" : "Senior Teacher, Dimla Govt Girls' High School",
            phone: "০১৭৭৮-XXXXXX",
            email: "parvin.teacher@dimlagirls.edu.bd",
            term: lang === "bn" ? "২০২৪ – ২০২৬ শিক্ষাবর্ষ" : "2024 – 2026 Term",
            badgeColor: "bg-indigo-600 text-white",
            image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 5,
            name: lang === "bn" ? "মোঃ মতিউর রহমান" : "Md. Motiur Rahman",
            role: "অভিভাবক সদস্য",
            role_en: "Guardian Representative",
            sub: lang === "bn" ? "বিশিষ্ট ব্যবসায়ী ও অভিভাবক প্রতিনিধি" : "Prominent Businessman & Guardian Representative",
            phone: "০১৭৩৪-XXXXXX",
            email: "motiur.guardian@gmail.com",
            term: lang === "bn" ? "২০২৪ – ২০২৬ শিক্ষাবর্ষ" : "2024 – 2026 Term",
            badgeColor: "bg-blue-600 text-white",
            image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 6,
            name: lang === "bn" ? "মোছাঃ সালমা খাতুন" : "Mst. Salma Khatun",
            role: "শিক্ষক প্রতিনিধি (মহিলা)",
            role_en: "Female Teacher Representative",
            sub: lang === "bn" ? "সিনিয়র শিক্ষক (বাংলা), ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়" : "Senior Teacher (Bangla)",
            phone: "০১৭৪৫-XXXXXX",
            email: "salma.teacher@dimlagirls.edu.bd",
            term: lang === "bn" ? "২০২৪ – ২০২৬ শিক্ষাবর্ষ" : "2024 – 2026 Term",
            badgeColor: "bg-indigo-600 text-white",
            image_url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80"
        }
    ];

    const committeeList = useMemo(() => {
        if (cms?.committee && Array.isArray(cms.committee) && cms.committee.length > 0) {
            return cms.committee.map((item, idx) => {
                const isHead = item.role?.includes("সচিব") || item.name?.includes("মোতাসিম");
                return {
                    id: item.id || idx + 1,
                    name: item.name || (lang === "bn" ? "সদস্য" : "Member"),
                    role: item.role || (lang === "bn" ? "সদস্য" : "Member"),
                    role_en: item.role_en || item.role,
                    sub: item.sub || item.designation || "",
                    phone: item.phone || "",
                    email: item.email || "",
                    term: item.term || (lang === "bn" ? "বর্তমান মেয়াদ" : "Current Term"),
                    badgeColor: item.role?.includes("সভাপতি")
                        ? "bg-emerald-600 text-white"
                        : item.role?.includes("সচিব")
                        ? "bg-teal-600 text-white"
                        : item.role?.includes("শিক্ষক")
                        ? "bg-indigo-600 text-white"
                        : "bg-blue-600 text-white",
                    image_url: isHead ? "/headmaster.png" : (item.image_url || item.image || defaultCommittee[idx % defaultCommittee.length].image_url)
                };
            });
        }
        return defaultCommittee;
    }, [cms, lang]);

    const filtered = committeeList.filter((m) => {
        const matchesTerm = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.sub.toLowerCase().includes(searchTerm.toLowerCase());
        if (selectedRole === "all") return matchesTerm;
        if (selectedRole === "president") return matchesTerm && m.role.includes("সভাপতি");
        if (selectedRole === "secretary") return matchesTerm && m.role.includes("সচিব");
        if (selectedRole === "teacher") return matchesTerm && m.role.includes("শিক্ষক");
        if (selectedRole === "guardian") return matchesTerm && m.role.includes("অভিভাবক");
        return matchesTerm;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {lang === "bn" ? "পরিচালনা পর্ষদ ও অভিভাবক পরিষদ" : "Governing Body & Managing Committee"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {lang === "bn" ? "ব্যবস্থাপনা কমিটি" : "Managing Committee"}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
                        {lang === "bn"
                            ? "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের সুষ্ঠু পরিচালনা, নীতি নির্ধারণ, একাডেমিক শৃঙ্খলা এবং সার্বিক উন্নয়নের দায়িত্বে নিয়োজিত সম্মানিত পরিচালনা পর্ষদ।"
                            : "The honorable governing body responsible for institutional oversight, academic excellence, and continuous development of Dimla Government Girls' High School."}
                    </p>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
                    <Users className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-slate-800 dark:text-white">
                        {lang === "bn" ? `${committeeList.length} জন` : `${committeeList.length} Members`}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                        {lang === "bn" ? "কমিটি সদস্য" : "Committee Members"}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
                    <UserCheck className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-slate-800 dark:text-white">
                        {lang === "bn" ? "ইউএনও, ডিমলা" : "UNO, Dimla"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                        {lang === "bn" ? "সম্মানিত সভাপতি" : "President"}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
                    <Award className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-slate-800 dark:text-white">
                        {lang === "bn" ? "প্রধান শিক্ষক" : "Head Teacher"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                        {lang === "bn" ? "সদস্য সচিব" : "Member Secretary"}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
                    <Calendar className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-slate-800 dark:text-white">
                        {lang === "bn" ? "২০২৪ – ২০২৬" : "2024 – 2026"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                        {lang === "bn" ? "বর্তমান কার্যকাল" : "Current Tenure"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Controls: Filter Pills & Search */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setSelectedRole("all")}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                                    selectedRole === "all"
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                            >
                                {lang === "bn" ? "সকল সদস্য" : "All Members"} ({committeeList.length})
                            </button>
                            <button
                                onClick={() => setSelectedRole("president")}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                                    selectedRole === "president"
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                            >
                                {lang === "bn" ? "সভাপতি" : "President"}
                            </button>
                            <button
                                onClick={() => setSelectedRole("secretary")}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                                    selectedRole === "secretary"
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                            >
                                {lang === "bn" ? "সদস্য সচিব" : "Secretary"}
                            </button>
                            <button
                                onClick={() => setSelectedRole("teacher")}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                                    selectedRole === "teacher"
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                            >
                                {lang === "bn" ? "শিক্ষক প্রতিনিধি" : "Teachers"}
                            </button>
                            <button
                                onClick={() => setSelectedRole("guardian")}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                                    selectedRole === "guardian"
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                            >
                                {lang === "bn" ? "অভিভাবক সদস্য" : "Guardians"}
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder={lang === "bn" ? "সদস্যের নাম বা পদবি দিয়ে খুঁজুন..." : "Search member by name or role..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Committee Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filtered.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between hover:shadow-md hover:border-emerald-500/50 transition-all group"
                            >
                                <div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-emerald-400/50 p-0.5 group-hover:scale-105 transition-transform bg-slate-50 shadow-xs">
                                            <img
                                                src={resolveMediaUrl(member.image_url)}
                                                alt={member.name}
                                                className="w-full h-full object-cover rounded-xl"
                                                onError={(e) => { e.target.src = "/headmaster.png"; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.badgeColor}`}>
                                                    {member.role}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {member.term}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1.5 leading-snug">
                                                {member.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {member.sub}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {(member.phone || member.email) && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-500">
                                        {member.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                <span>{member.phone}</span>
                                            </div>
                                        )}
                                        {member.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                            {lang === "bn" ? "কোনো কমিটি সদস্য পাওয়া যায়নি।" : "No committee members found."}
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

export default CommitteePage;
