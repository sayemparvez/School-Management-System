import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, BookOpen, Search, GraduationCap, Award } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";
import api from "../../utils/api";

const resolveMediaUrl = (url) => {
    if (!url) return "/headmaster.png";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
    }
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    if (cleanUrl === "/headmaster.png" || cleanUrl.startsWith("/assets/")) {
        return cleanUrl;
    }
    const backendBase = import.meta.env.VITE_BACKEND || "http://localhost:5000";
    return `${backendBase}${cleanUrl}`;
};

const TeachersPage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const [searchTerm, setSearchTerm] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultTeachers = [
        {
            id: 1,
            name: lang === "bn" ? (cms?.headmaster?.name_bn || "আবু জাফর মোঃ মোতাসিম বিল্লাহ্") : (cms?.headmaster?.name_en || "Abu Jafor Md. Motasim Billah"),
            designation: lang === "bn" ? (cms?.headmaster?.designation_bn || "প্রধান শিক্ষক (ভারপ্রাপ্ত)") : (cms?.headmaster?.designation_en || "Head Teacher (Acting)"),
            department: lang === "bn" ? "প্রশাসন ও গণিত" : "Administration & Mathematics",
            qualification: "এম.এসসি (গণিত), বি.এড",
            phone: "০১৭১২-৩৪৫৬৭৮",
            email: "headteacher.dimlagirls@gmail.com",
            image: cms?.headmaster?.image_url || "/headmaster.png"
        },
        {
            id: 2,
            name: lang === "bn" ? "মোছাঃ নাসরিন আক্তার" : "Mst. Nasrin Akter",
            designation: lang === "bn" ? "সহকারী প্রধান শিক্ষক" : "Assistant Head Teacher",
            department: lang === "bn" ? "গণিত" : "Mathematics",
            qualification: "M.Sc (Mathematics), B.Ed",
            phone: "০১৭২৩-৪৫৬৭৮৯",
            email: "nasrin.akter@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 3,
            name: lang === "bn" ? "মোঃ জাহাঙ্গীর আলম" : "Md. Jahangir Alam",
            designation: lang === "bn" ? "সিনিয়র শিক্ষক" : "Senior Teacher",
            department: lang === "bn" ? "পদার্থবিজ্ঞান" : "Physics",
            qualification: "M.Sc (Physics), B.Ed",
            phone: "০১৭৩৪-৫৬৭৮৯০",
            email: "jahangir.physics@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 4,
            name: lang === "bn" ? "মোছাঃ সালমা খাতুন" : "Mst. Salma Khatun",
            designation: lang === "bn" ? "সিনিয়র শিক্ষক" : "Senior Teacher",
            department: lang === "bn" ? "বাংলা" : "Bangla",
            qualification: "M.A (Bangla), B.Ed",
            phone: "০১৭৪৫-৬৭৮৯০১",
            email: "salma.bangla@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 5,
            name: lang === "bn" ? "মোঃ সাইদুর রহমান" : "Md. Saidur Rahman",
            designation: lang === "bn" ? "সহকারী শিক্ষক" : "Assistant Teacher",
            department: lang === "bn" ? "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)" : "ICT",
            qualification: "B.Sc in CSE, PGD in ICT",
            phone: "০১৭৫৬-৭৮৯০১২",
            email: "saidur.ict@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 6,
            name: lang === "bn" ? "মোছাঃ ফাতেমা জোহরা" : "Mst. Fatema Zohra",
            designation: lang === "bn" ? "সহকারী শিক্ষক" : "Assistant Teacher",
            department: lang === "bn" ? "রসায়ন ও জীববিজ্ঞান" : "Chemistry & Biology",
            qualification: "M.Sc (Chemistry), B.Ed",
            phone: "০১৭৬৭-৮৯০১২৩",
            email: "fatema.science@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 7,
            name: lang === "bn" ? "মোছাঃ পারভীন আক্তার" : "Mst. Parvin Akter",
            designation: lang === "bn" ? "সহকারী শিক্ষক" : "Assistant Teacher",
            department: lang === "bn" ? "সামাজিক বিজ্ঞান" : "Social Science",
            qualification: "M.S.S (Economics), B.Ed",
            phone: "০১৭৭৮-৯০১২৩৪",
            email: "parvin.social@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80"
        },
        {
            id: 8,
            name: lang === "bn" ? "মাওলানা মোঃ আব্দুর রশীদ" : "Mawlana Md. Abdur Rashid",
            designation: lang === "bn" ? "সহকারী শিক্ষক" : "Assistant Teacher",
            department: lang === "bn" ? "ইসলাম ও নৈতিক শিক্ষা" : "Islamic Studies",
            qualification: "Kamil (Hadith), M.A (Islamic Studies)",
            phone: "০১৭৮৯-০১২৩৪৫",
            email: "abdur.rashid@dimlagirls.edu.bd",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80"
        }
    ];

    useEffect(() => {
        const sourceTeachers = (cms?.teachers && cms.teachers.length > 0) ? cms.teachers : defaultTeachers;
        const mapped = sourceTeachers.map((t, idx) => {
            const isHead = idx === 0 || (t.designation_bn && t.designation_bn.includes("প্রধান শিক্ষক") && !t.designation_bn.includes("সহকারী"));
            return {
                id: t.id || idx + 1,
                name: lang === "bn" 
                    ? (t.name_bn || t.name || (isHead ? cms?.headmaster?.name_bn : "")) 
                    : (t.name_en || t.name_bn || t.name || (isHead ? cms?.headmaster?.name_en : "")),
                designation: lang === "bn" 
                    ? (t.designation_bn || t.designation || (isHead ? cms?.headmaster?.designation_bn : "")) 
                    : (t.designation_en || t.designation_bn || t.designation || (isHead ? cms?.headmaster?.designation_en : "")),
                department: lang === "bn" ? (t.department_bn || t.department) : (t.department_en || t.department_bn || t.department),
                qualification: t.qualification || "",
                phone: t.phone || "",
                email: t.email || "",
                image: resolveMediaUrl(t.image_url || t.image || (isHead ? (cms?.headmaster?.image_url || "/headmaster.png") : "/headmaster.png"))
            };
        });
        setTeachers(mapped);
        setLoading(false);
    }, [lang, cms]);

    const filtered = teachers.filter((t) => {
        const term = searchTerm.toLowerCase();
        return (
            t.name.toLowerCase().includes(term) ||
            t.department.toLowerCase().includes(term) ||
            t.designation.toLowerCase().includes(term)
        );
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "আমাদের শিক্ষক পরিবার" : "Faculty Members"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navTeachers")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের নিবেদিতপ্রাণ ও অভিজ্ঞ শিক্ষকমণ্ডলীর পরিচিতি।"
                            : "Meet the dedicated, compassionate, and experienced educators of Dimla Government Girls' High School."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={lang === "bn" ? "শিক্ষকের নাম বা বিষয় দিয়ে খুঁজুন..." : "Search by teacher name or subject..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent text-xs sm:text-sm focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-xs text-slate-400 hover:text-slate-600"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Teacher Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filtered.map((teacher) => {
                            const isHead = teacher.designation?.includes("প্রধান শিক্ষক") && !teacher.designation?.includes("সহকারী");
                            return (
                                <div
                                    key={teacher.id}
                                    className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all group ${
                                        isHead 
                                            ? "border-emerald-500/70 dark:border-emerald-500/50 ring-1 ring-emerald-500/20 bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/10 dark:to-slate-900 sm:col-span-2 md:col-span-1" 
                                            : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 p-0.5 group-hover:scale-105 transition-transform bg-slate-50 ${
                                            isHead ? "border-2 border-emerald-600 shadow-xs" : "border-2 border-emerald-400/50"
                                        }`}>
                                            <img
                                                src={resolveMediaUrl(teacher.image)}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover object-top rounded-xl"
                                                onError={(e) => { e.target.src = "/headmaster.png"; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isHead && (
                                                <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 mb-1 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                                                    {lang === "bn" ? "প্রতিষ্ঠান প্রধান" : "Head of Institution"}
                                                </span>
                                            )}
                                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                                {teacher.name}
                                            </h3>
                                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                {teacher.designation}
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                {teacher.department}
                                            </p>
                                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                                                {teacher.qualification}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                            <span>{teacher.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                            <span className="truncate">{teacher.email}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                            {lang === "bn" ? "কোনো শিক্ষক পাওয়া যায়নি।" : "No faculty found matching your search."}
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

export default TeachersPage;
