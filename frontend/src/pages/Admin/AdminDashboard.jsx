import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import MoneyReceiptModal from "../../components/modals/MoneyReceiptModal.jsx";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    GraduationCap,
    Banknote,
    ClipboardCheck,
    BarChart3,
    ArrowRight,
    Award,
    UserCheck,
    Sparkles,
    CheckCircle2,
    Calendar,
    Clock,
    Printer,
    Layers,
    ShieldCheck,
    FileText,
    TrendingUp,
    School
} from "lucide-react";

export default function AdminDashboard() {
    const token = localStorage.getItem("token");

    const [stats, setStats] = useState({
        total_students: 0,
        total_alumni: 0,
        total_faculty: 0,
        total_courses: 0,
        total_subjects: 0,
        total_collected: 0,
        scholarships: { britti_count: 0, upobritti_count: 0, regular_count: 0 },
        class_breakdown: [],
        recent_transactions: [],
        today_attendance: { total: 0, present: 0 }
    });

    const [loading, setLoading] = useState(true);
    const [activeReceipt, setActiveReceipt] = useState(null);

    // Fetch live dashboard statistics
    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    // View receipt directly from recent transactions
    const handleViewReceipt = async (receiptNo) => {
        try {
            const res = await api.get(`/api/fees/receipt/${receiptNo}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveReceipt(res.data);
        } catch (err) {
            console.error("Error opening receipt:", err);
        }
    };

    // Formatted Bengali Date
    const todayFormatted = useMemo(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('bn-BD', options);
    }, []);

    return (
        <div className="pb-16 font-sans bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-300">

            {/* INSTITUTIONAL HERO HEADER */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center flex-shrink-0 shadow-inner">
                                <School className="w-9 h-9 text-emerald-300" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                                        সরকারি মাধ্যমিক বিদ্যালয়
                                    </span>
                                    <span className="text-[11px] text-emerald-200 font-mono hidden sm:inline">
                                        EIIN: 127756 • কোড: 7505
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-1">
                                    ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
                                </h1>
                                <p className="text-xs sm:text-sm text-emerald-100/90 font-medium flex items-center gap-2 mt-0.5">
                                    <span>ডিমলা, নীলফামারী • স্থাপিত: ১৯৫২ খ্রিঃ</span>
                                    <span>•</span>
                                    <span className="text-emerald-300 font-semibold">{todayFormatted}</span>
                                </p>
                            </div>
                        </div>

                        {/* Top quick badges */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                                </span>
                                <span>শিক্ষাবর্ষ ২০২৬</span>
                            </div>
                            <Link
                                to="/admin/fee-collection"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                            >
                                <Banknote className="w-4 h-4" />
                                <span>ফি কালেকশন</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8">

                {/* KPI METRICS GRID (6 TILES) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                বিদ্যালয়ের সার্বিক পরিসংখ্যান (Overview Metrics)
                            </h2>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">লাইভ ডাটাবেজ আপডেট</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        
                        {/* 1. Total Active Students */}
                        <MetricCard
                            title="নিয়মিত শিক্ষার্থী"
                            value={stats.total_students}
                            unit="জন"
                            subtitle="৬ষ্ঠ - ১০ম শ্রেণি"
                            icon={Users}
                            color="blue"
                            loading={loading}
                            linkTo="/admin/students"
                        />

                        {/* 2. Total Alumni / Ex-Students */}
                        <MetricCard
                            title="প্রাক্তন শিক্ষার্থী"
                            value={stats.total_alumni}
                            unit="জন"
                            subtitle="এসএসসি ব্যাচসমূহ"
                            icon={GraduationCap}
                            color="amber"
                            loading={loading}
                            linkTo="/admin/ex-students"
                        />

                        {/* 3. Teachers & Staff */}
                        <MetricCard
                            title="শিক্ষক ও স্টাফ"
                            value={stats.total_faculty}
                            unit="জন"
                            subtitle="প্রধান শিক্ষক ও সহকর্মী"
                            icon={UserCheck}
                            color="purple"
                            loading={loading}
                            linkTo="/admin/faculties"
                        />

                        {/* 4. Total Classes / Sections */}
                        <MetricCard
                            title="মোট শ্রেণি ও শাখা"
                            value={stats.total_courses}
                            unit="টি"
                            subtitle="বিজ্ঞান ও মানবিকসহ"
                            icon={BookOpen}
                            color="teal"
                            loading={loading}
                            linkTo="/admin/courses"
                        />

                        {/* 5. Total Fee Collected */}
                        <MetricCard
                            title="মোট আদায়কৃত ফি"
                            value={`৳ ${Number(stats.total_collected).toLocaleString("bn-BD")}`}
                            unit=""
                            subtitle="২০২৬ শিক্ষাবর্ষ"
                            icon={Banknote}
                            color="emerald"
                            loading={loading}
                            linkTo="/admin/fee-collection"
                        />

                        {/* 6. Stipends / Scholarships */}
                        <MetricCard
                            title="বৃত্তি ও উপবৃত্তি"
                            value={Number(stats.scholarships?.britti_count || 0) + Number(stats.scholarships?.upobritti_count || 0)}
                            unit="জন"
                            subtitle="বেতন মওকুফ সুবিধাপ্রাপ্ত"
                            icon={Award}
                            color="rose"
                            loading={loading}
                            linkTo="/admin/fee-collection"
                        />

                    </div>
                </section>

                {/* QUICK NAVIGATION LAUNCHPAD (8 MODULES) */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            গুরুত্বপূর্ণ মডিউল ও দ্রুত অ্যাকশন (Quick Launch Hub)
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <QuickLaunchTile
                            title="ফি আদায় ও রসিদ"
                            subtitle="মাসিক বেতন ও সকল ফি"
                            icon={Banknote}
                            to="/admin/fee-collection"
                            color="emerald"
                        />
                        <QuickLaunchTile
                            title="দৈনিক ক্লাস হাজিরা"
                            subtitle="১ম পিরিয়ড ও বিষয়ভিত্তিক"
                            icon={ClipboardCheck}
                            to="/admin/take-attendance"
                            color="blue"
                        />
                        <QuickLaunchTile
                            title="পরীক্ষার নম্বর এন্ট্রি"
                            subtitle="প্রাক-নির্বাচনী, টেস্ট ও বার্ষিক"
                            icon={GraduationCap}
                            to="/admin/enter-marks"
                            color="indigo"
                        />
                        <QuickLaunchTile
                            title="প্রাক্তন শিক্ষার্থী ও প্রশংসাপত্র"
                            subtitle="এসএসসি রেকর্ড ও টেস্টমোনিয়াল"
                            icon={Award}
                            to="/admin/ex-students"
                            color="amber"
                        />
                        <QuickLaunchTile
                            title="শ্রেণি শিক্ষক নির্ধারণ"
                            subtitle="বার্ষিক শিক্ষক নিয়োগ"
                            icon={UserCheck}
                            to="/admin/class-teachers"
                            color="purple"
                        />
                        <QuickLaunchTile
                            title="শ্রেণি পদোন্নতি (Promote)"
                            subtitle="পরবর্তী শ্রেণিতে উত্তীর্ণকরণ"
                            icon={TrendingUp}
                            to="/admin/promote-students"
                            color="teal"
                        />
                        <QuickLaunchTile
                            title="নম্বরপত্র প্রিন্ট (Marksheet)"
                            subtitle="অভিভাবক রিপোর্ট ও গ্রেড শিট"
                            icon={Printer}
                            to="/admin/print-marksheet"
                            color="rose"
                        />
                        <QuickLaunchTile
                            title="ফি রিপোর্ট ও লেজার"
                            subtitle="আদায় খতিয়ান ও হিসাব"
                            icon={BarChart3}
                            to="/admin/fee-report"
                            color="slate"
                        />
                    </div>
                </section>

                {/* MIDDLE SECTION: 2-COLUMN OPERATIONAL PANELS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left 2 Cols: Class-wise student distribution & scholarship breakdown */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Class Breakdown Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        শ্রেণিভিত্তিক শিক্ষার্থী সংখ্যা (Class Strength)
                                    </h3>
                                </div>
                                <Link to="/admin/students" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    সকল শিক্ষার্থী <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stats.class_breakdown.map((c) => (
                                    <div
                                        key={c.course_code}
                                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-900 transition-colors"
                                    >
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                                                {c.course_name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono block">
                                                {c.course_code}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                                                {c.student_count}
                                            </span>
                                            <span className="text-[10px] text-slate-400 ml-1">জন</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scholarship & Stipend Distribution Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    বৃত্তি ও উপবৃত্তি নীতি (Waiver & Scholarship Distribution)
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                                    <span className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                                        সরকারি উপবৃত্তিপ্রাপ্ত
                                    </span>
                                    <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 my-1 block">
                                        {stats.scholarships?.upobritti_count || 0} জন
                                    </span>
                                    <span className="text-[10px] text-emerald-600 font-bold block">
                                        মাসিক বেতন সম্পূর্ণ মওকুফ (৳০)
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                                    <span className="block text-[11px] font-bold text-amber-800 dark:text-amber-300">
                                        মেধা বৃত্তিপ্রাপ্ত
                                    </span>
                                    <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400 my-1 block">
                                        {stats.scholarships?.britti_count || 0} জন
                                    </span>
                                    <span className="text-[10px] text-amber-600 font-bold block">
                                        মাসিক বেতন সম্পূর্ণ মওকুফ (৳০)
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                        সাধারণ শিক্ষার্থী
                                    </span>
                                    <span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-200 my-1 block">
                                        {stats.scholarships?.regular_count || 0} জন
                                    </span>
                                    <span className="text-[10px] text-slate-500 block">
                                        নিয়মিত সরকারি বেতন (৳১৫/২০)
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right 1 Col: Recent Fee Collections & Admin Notice */}
                    <div className="space-y-6">
                        
                        {/* Recent Transactions */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        সাম্প্রতিক ফি আদায় (Recent Fees)
                                    </h3>
                                </div>
                                <Link to="/admin/fee-report" className="text-xs font-bold text-emerald-600 hover:underline">
                                    রিপোর্ট
                                </Link>
                            </div>

                            {stats.recent_transactions.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6">এখনো কোনো ফি আদায় রেকর্ড নেই</p>
                            ) : (
                                <div className="space-y-2.5">
                                    {stats.recent_transactions.map((tx, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                                        >
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                                                    {tx.student_name} (রোল: {tx.student_rollnumber})
                                                </span>
                                                <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                                                    {tx.fee_name} • {tx.course_code}
                                                </span>
                                            </div>

                                            <div className="text-right flex items-center gap-2">
                                                <div>
                                                    <span className="font-mono font-bold text-emerald-600 block">
                                                        ৳ {Number(tx.amount_paid)}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-mono">
                                                        {tx.receipt_no.split("-").slice(-2).join("-")}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleViewReceipt(tx.receipt_no)}
                                                    title="রসিদ দেখুন"
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Printer className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* System & Security Box */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4" />
                                <span>অ্যাডমিনিস্ট্রেটিভ নিরাপত্তা ও নিয়ন্ত্রণ</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                আপনি ডিমla সরকারি বালিকা উচ্চ বিদ্যালয়ের প্রধান কন্ট্রোল সেন্টারে সংযুক্ত আছেন। বিদ্যালয়ের সকল শ্রেণি, শিক্ষক, পরীক্ষার নম্বর, এবং ফি আদায়ের তথ্য এনক্রিপ্টেড ও সুরক্ষিত।
                            </p>
                            <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                                <span>ডাটাবেজ: PostgreSQL</span>
                                <span className="text-emerald-400 font-bold">● সচল</span>
                            </div>
                        </div>

                    </div>

                </div>

            </main>

            {/* MONEY RECEIPT MODAL */}
            <MoneyReceiptModal
                isOpen={!!activeReceipt}
                onClose={() => setActiveReceipt(null)}
                receipt={activeReceipt}
            />

        </div>
    );
}

/* ================= KPI METRIC CARD ================= */
const MetricCard = ({ title, value, unit, subtitle, icon: Icon, color, loading, linkTo }) => {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/40",
        teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200/60 dark:border-teal-800/40",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40",
        rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40",
    };

    const content = (
        <div className={`p-4 rounded-2xl border transition-all duration-200 ${colorStyles[color]} hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 truncate" title={title}>
                    {title}
                </span>
                <Icon className="w-4 h-4 opacity-75 flex-shrink-0" />
            </div>

            <div className="my-1">
                {loading ? (
                    <div className="h-7 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                        {value} {unit && <span className="text-xs font-semibold text-slate-500 font-sans">{unit}</span>}
                    </div>
                )}
            </div>

            <p className="text-[10px] opacity-75 truncate mt-1">
                {subtitle}
            </p>
        </div>
    );

    return linkTo ? <Link to={linkTo}>{content}</Link> : content;
};

/* ================= QUICK LAUNCH TILE ================= */
const QuickLaunchTile = ({ title, subtitle, icon: Icon, to, color }) => {
    const iconColors = {
        emerald: "bg-emerald-500 text-white",
        blue: "bg-blue-500 text-white",
        indigo: "bg-indigo-500 text-white",
        amber: "bg-amber-500 text-white",
        purple: "bg-purple-500 text-white",
        teal: "bg-teal-500 text-white",
        rose: "bg-rose-500 text-white",
        slate: "bg-slate-700 text-white",
    };

    return (
        <Link
            to={to}
            className="group p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${iconColors[color]} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {title}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                        {subtitle}
                    </p>
                </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-1 transition-all" />
        </Link>
    );
};
