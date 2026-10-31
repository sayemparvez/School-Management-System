import React, { useState, useMemo } from "react";
import {
    Globe,
    ArrowUpRight,
    ShieldCheck,
    Landmark,
    GraduationCap,
    Award,
    BookOpen,
    Users,
    Search,
    Copy,
    Check,
    Sparkles,
    Building2,
    Lock,
    ExternalLink
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";

const GovtPortalsWidget = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [copiedUrl, setCopiedUrl] = useState(null);

    const defaultLinks = [
        {
            id: "moedu",
            category: "ministry",
            title: lang === "bn" ? "শিক্ষা মন্ত্রণালয়" : "Ministry of Education",
            serviceBn: "নীতিমালা, প্রজ্ঞাপন ও সার্কুলার",
            serviceEn: "Policies, Notices & Circulars",
            tagBn: "প্রশাসন ও পরিপত্র",
            tagEn: "Admin & Policies",
            url: "https://moedu.gov.bd",
            desc: "moedu.gov.bd",
            icon: Landmark,
            color: "emerald",
            gradient: "from-emerald-500 to-teal-600",
            bgSoft: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
        },
        {
            id: "dshe",
            category: "admin",
            title: lang === "bn" ? "মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি)" : "DSHE Bangladesh",
            serviceBn: "বৃত্তি, এমপিও ও একাডেমি প্রশাসন",
            serviceEn: "MPO, Scholarships & Academic Administration",
            tagBn: "বৃত্তি ও এমপিও",
            tagEn: "Scholarships & MPO",
            url: "https://dshe.gov.bd",
            desc: "dshe.gov.bd",
            icon: GraduationCap,
            color: "indigo",
            gradient: "from-indigo-500 to-blue-600",
            bgSoft: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50"
        },
        {
            id: "dinajpur-board",
            category: "board",
            title: lang === "bn" ? "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর" : "BISE Dinajpur",
            serviceBn: "পরীক্ষা, ফলাফল ও অনলাইন সনদপত্র",
            serviceEn: "Exams, Results & Online Certificates",
            tagBn: "পরীক্ষা ও রেজাল্ট",
            tagEn: "Exams & Results",
            url: "https://dinajpureducationboard.gov.bd",
            desc: "dinajpureducationboard.gov.bd",
            icon: Award,
            color: "amber",
            gradient: "from-amber-500 to-orange-600",
            bgSoft: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
        },
        {
            id: "nctb",
            category: "curriculum",
            title: lang === "bn" ? "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)" : "NCTB Bangladesh",
            serviceBn: "বিনামূল্যে সকল শ্রেণির ই-বুক ও কারিকুলাম",
            serviceEn: "Free e-Books & Curriculum Downloads",
            tagBn: "ই-বুক ও পাঠ্যবই",
            tagEn: "e-Books & Syllabus",
            url: "http://nctb.gov.bd",
            desc: "nctb.gov.bd",
            icon: BookOpen,
            color: "cyan",
            gradient: "from-cyan-500 to-teal-600",
            bgSoft: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50"
        },
        {
            id: "teachers-portal",
            category: "training",
            title: lang === "bn" ? "শিক্ষক বাতায়ন (Shikkhok Batayon)" : "Teachers Portal Bangladesh",
            serviceBn: "ডিজিটাল কনটেন্ট ও শিক্ষক উন্নয়ন ফোরাম",
            serviceEn: "Digital Content & Professional Development",
            tagBn: "ডিজিটাল কনটেন্ট",
            tagEn: "Digital Content",
            url: "https://teachers.gov.bd",
            desc: "teachers.gov.bd",
            icon: Users,
            color: "purple",
            gradient: "from-purple-500 to-violet-600",
            bgSoft: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50"
        },
        {
            id: "bangladesh-gov",
            category: "national",
            title: lang === "bn" ? "বাংলাদেশ জাতীয় তথ্য বাতায়ন" : "Bangladesh National Portal",
            serviceBn: "সকল সরকারি দপ্তর ও জাতীয় ই-সেবা",
            serviceEn: "Government e-Services & Directory",
            tagBn: "জাতীয় ই-সেবা",
            tagEn: "National e-Services",
            url: "https://bangladesh.gov.bd",
            desc: "bangladesh.gov.bd",
            icon: Globe,
            color: "rose",
            gradient: "from-rose-500 to-pink-600",
            bgSoft: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50"
        }
    ];

    // Helper to enrich CMS links if customized
    const links = useMemo(() => {
        if (!cms?.important_links || cms.important_links.length === 0) {
            return defaultLinks;
        }

        return cms.important_links.map((item, index) => {
            const rawTitle = (lang === "bn" ? item.title_bn || item.title : item.title_en || item.title) || item.url;
            const urlLower = (item.url || "").toLowerCase();
            const titleLower = rawTitle.toLowerCase();

            // Match known portal profiles
            let icon = Building2;
            let gradient = "from-emerald-500 to-teal-600";
            let bgSoft = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50";
            let tagBn = "অফিসিয়াল পোর্টাল";
            let tagEn = "Official Portal";
            let serviceBn = "সরকারি তথ্য ও অনলাইন সেবা";
            let serviceEn = "Govt Information & e-Services";
            let category = "general";

            if (urlLower.includes("moedu") || titleLower.includes("মন্ত্রণালয়")) {
                icon = Landmark;
                gradient = "from-emerald-500 to-teal-600";
                bgSoft = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50";
                tagBn = "প্রশাসন ও পরিপত্র";
                tagEn = "Admin & Policies";
                serviceBn = "নীতিমালা, প্রজ্ঞাপন ও সার্কুলার";
                serviceEn = "Policies, Notices & Circulars";
                category = "ministry";
            } else if (urlLower.includes("dshe") || titleLower.includes("মাউশি") || titleLower.includes("অধিদপ্তর")) {
                icon = GraduationCap;
                gradient = "from-indigo-500 to-blue-600";
                bgSoft = "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50";
                tagBn = "বৃত্তি ও এমপিও";
                tagEn = "Scholarships & MPO";
                serviceBn = "বৃত্তি, এমপিও ও একাডেমি প্রশাসন";
                serviceEn = "MPO, Scholarships & Academic Administration";
                category = "admin";
            } else if (urlLower.includes("board") || urlLower.includes("dinajpur") || titleLower.includes("বোর্ড") || titleLower.includes("ফলাফল")) {
                icon = Award;
                gradient = "from-amber-500 to-orange-600";
                bgSoft = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50";
                tagBn = "পরীক্ষা ও রেজাল্ট";
                tagEn = "Exams & Results";
                serviceBn = "পরীক্ষা, ফলাফল ও অনলাইন সনদপত্র";
                serviceEn = "Exams, Results & Online Certificates";
                category = "board";
            } else if (urlLower.includes("nctb") || titleLower.includes("পাঠ্যপুস্তক") || titleLower.includes("বই")) {
                icon = BookOpen;
                gradient = "from-cyan-500 to-teal-600";
                bgSoft = "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50";
                tagBn = "ই-বুক ও পাঠ্যবই";
                tagEn = "e-Books & Syllabus";
                serviceBn = "বিনামূল্যে সকল শ্রেণির ই-বুক ও কারিকুলাম";
                serviceEn = "Free e-Books & Curriculum Downloads";
                category = "curriculum";
            } else if (urlLower.includes("teachers") || titleLower.includes("শিক্ষক বাতায়ন")) {
                icon = Users;
                gradient = "from-purple-500 to-violet-600";
                bgSoft = "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50";
                tagBn = "ডিজিটাল কনটেন্ট";
                tagEn = "Digital Content";
                serviceBn = "ডিজিটাল কনটেন্ট ও শিক্ষক উন্নয়ন ফোরাম";
                serviceEn = "Digital Content & Professional Development";
                category = "training";
            } else if (urlLower.includes("bangladesh.gov") || titleLower.includes("জাতীয় তথ্য বাতায়ন")) {
                icon = Globe;
                gradient = "from-rose-500 to-pink-600";
                bgSoft = "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50";
                tagBn = "জাতীয় ই-সেবা";
                tagEn = "National e-Services";
                serviceBn = "সকল সরকারি দপ্তর ও জাতীয় ই-সেবা";
                serviceEn = "Government e-Services & Directory";
                category = "national";
            }

            return {
                id: `link-${index}`,
                category,
                title: rawTitle,
                serviceBn,
                serviceEn,
                tagBn,
                tagEn,
                url: item.url,
                desc: item.desc || "",
                icon,
                gradient,
                bgSoft
            };
        });
    }, [cms?.important_links, lang]);

    const categories = [
        { id: "all", labelBn: "সকল বাতায়ন", labelEn: "All Portals" },
        { id: "board", labelBn: "বোর্ড ও রেজাল্ট", labelEn: "Boards & Results" },
        { id: "curriculum", labelBn: "পাঠ্যপুস্তক", labelEn: "Textbooks" },
        { id: "ministry", labelBn: "মন্ত্রণালয় ও দপ্তর", labelEn: "Govt Portals" }
    ];

    const filteredLinks = useMemo(() => {
        return links.filter((l) => {
            const matchesCat =
                selectedCategory === "all" ||
                l.category === selectedCategory ||
                (selectedCategory === "ministry" && (l.category === "ministry" || l.category === "admin" || l.category === "national"));

            const query = searchQuery.trim().toLowerCase();
            if (!query) return matchesCat;

            const matchesSearch =
                l.title.toLowerCase().includes(query) ||
                l.url.toLowerCase().includes(query) ||
                (l.serviceBn && l.serviceBn.toLowerCase().includes(query)) ||
                (l.tagBn && l.tagBn.toLowerCase().includes(query));

            return matchesCat && matchesSearch;
        });
    }, [links, selectedCategory, searchQuery]);

    const handleCopy = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-4 transition-all duration-300 hover:shadow-md relative overflow-hidden">
            {/* Ambient background accent glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20">
                            <Landmark className="w-5 h-5" />
                        </div>
                        {/* Bangladesh Government Green-Red Accent dot */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Official Bangladesh Government Links" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">
                                {t("importantLinks")}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/70 dark:border-emerald-800/60 uppercase tracking-wider">
                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                GOV.BD
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {lang === "bn" ? "শিক্ষা সংক্রান্ত অফিসিয়াল ই-সেবা বাতায়ন" : "Official Educational e-Service Portals"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/50 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{lang === "bn" ? "অনলাইন" : "Live"}</span>
                </div>
            </div>

            {/* Quick Search & Filter Toolbar */}
            <div className="space-y-2 mb-3 relative z-10">
                <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={lang === "bn" ? "পোর্টাল খুঁজুন... (বোর্ড, রেজাল্ট, বই)" : "Search portal... (Board, result, books)"}
                        className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 placeholder:text-[11px]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-2 py-0.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 border ${
                                    isActive
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                        : "bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200/80 dark:hover:bg-slate-700"
                                }`}
                            >
                                {lang === "bn" ? cat.labelBn : cat.labelEn}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Portal Cards List */}
            <div className="space-y-2 relative z-10">
                {filteredLinks.length > 0 ? (
                    filteredLinks.map((link, idx) => {
                        const domain = (() => {
                            try {
                                return new URL(link.url).hostname.replace(/^www\./, "");
                            } catch {
                                return link.desc || "gov.bd";
                            }
                        })();

                        const IconComponent = link.icon || Globe;
                        const isCopied = copiedUrl === link.url;

                        return (
                            <a
                                key={link.id || idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={lang === "bn" ? `${link.title} — সরাসরি ওয়েবসাইটে যান` : `Visit ${link.title}`}
                                className="group relative flex items-start justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-850 hover:border-emerald-400/80 dark:hover:border-emerald-600/70 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                                    {/* Icon Badge */}
                                    <div
                                        className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${link.gradient} text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 group-hover:shadow-sm transition-transform duration-200 mt-0.5`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                    </div>

                                    {/* Content info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                                                {link.title}
                                            </h4>
                                        </div>

                                        {/* Purpose / Service Description */}
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                                            {lang === "bn" ? link.serviceBn : link.serviceEn}
                                        </p>

                                        {/* Bottom badges: domain + service tag */}
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            <span className="inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 border border-slate-300/40 dark:border-slate-600/40">
                                                {domain}
                                            </span>
                                            {link.tagBn && (
                                                <span
                                                    className={`inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-semibold border ${link.bgSoft}`}
                                                >
                                                    {lang === "bn" ? link.tagBn : link.tagEn}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Action Buttons */}
                                <div className="flex items-center gap-1 flex-shrink-0 self-center">
                                    {/* Quick Copy Link Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleCopy(e, link.url)}
                                        title={lang === "bn" ? "লিংক কপি করুন" : "Copy link"}
                                        className="w-6 h-6 rounded-lg opacity-60 hover:opacity-100 group-hover:opacity-100 flex items-center justify-center bg-white dark:bg-slate-700/70 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 transition-all"
                                    >
                                        {isCopied ? (
                                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </button>

                                    {/* Launch Arrow */}
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white dark:bg-slate-700/70 text-slate-400 border border-slate-200 dark:border-slate-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-200 shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </a>
                        );
                    })
                ) : (
                    <div className="text-center py-6 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                        <p>{lang === "bn" ? "কোনো বাতায়ন পাওয়া যায়নি" : "No portals found"}</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                            className="mt-1.5 text-[11px] text-emerald-600 hover:underline font-semibold"
                        >
                            {lang === "bn" ? "ফিল্টার রিসেট করুন" : "Reset filters"}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Trust & Security Seal */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 relative z-10">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {lang === "bn" ? "ভেরিফাইড সরকারি গেটওয়ে" : "Verified Govt Gateway"}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    <Lock className="w-2.5 h-2.5" />
                    SSL 256-bit
                </span>
            </div>
        </div>
    );
};

export default GovtPortalsWidget;
