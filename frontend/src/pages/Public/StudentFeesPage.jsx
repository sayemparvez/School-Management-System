import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search, CreditCard, Receipt, Download, Printer, CheckCircle2,
    AlertCircle, User, BookOpen, Calendar, Clock, DollarSign,
    Sparkles, ArrowRight, ShieldCheck, FileText, Phone, X, RefreshCw,
    Building2, CheckCircle, HelpCircle, ChevronRight, Award
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import RightSidebar from "../../components/Public/RightSidebar";
import api from "../../utils/api";

const StudentFeesPage = () => {
    const { lang, t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    // Multi-field search states (like Rangpur Zilla School's payment-history.aspx)
    const [searchTerm, setSearchTerm] = useState(searchParams.get("id") || searchParams.get("roll") || "");
    const [academicYear, setAcademicYear] = useState(searchParams.get("year") || "2026");
    const [selectedClass, setSelectedClass] = useState(searchParams.get("class") || "all");
    const [selectedSection, setSelectedSection] = useState(searchParams.get("section") || "all");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [feeData, setFeeData] = useState(null);

    // Selected receipt for official voucher modal & printing
    const [activeReceipt, setActiveReceipt] = useState(null);
    const [loadingReceipt, setLoadingReceipt] = useState(false);

    // 12 Months Bengali Names for Year Fee Calendar Tracker
    const banglaMonths = [
        { key: "January", bn: "জানুয়ারি", num: 1 },
        { key: "February", bn: "ফেব্রুয়ারি", num: 2 },
        { key: "March", bn: "মার্চ", num: 3 },
        { key: "April", bn: "এপ্রিল", num: 4 },
        { key: "May", bn: "মে", num: 5 },
        { key: "June", bn: "জুন", num: 6 },
        { key: "July", bn: "জুলাই", num: 7 },
        { key: "August", bn: "আগস্ট", num: 8 },
        { key: "September", bn: "সেপ্টেম্বর", num: 9 },
        { key: "October", bn: "অক্টোবর", num: 10 },
        { key: "November", bn: "নভেম্বর", num: 11 },
        { key: "December", bn: "ডিসেম্বর", num: 12 }
    ];

    const handleSearch = async (queryToSearch) => {
        const query = queryToSearch || searchTerm;
        if (!query || !query.trim()) {
            setError("অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর বা আইডি প্রদান করুন।");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/api/public/student-fees/${encodeURIComponent(query.trim())}`, {
                params: {
                    academic_year: academicYear
                }
            });
            if (res.data && res.data.success) {
                setFeeData(res.data);
                if (res.data.student?.course_code) {
                    setSelectedClass(res.data.student.course_code);
                }
            } else {
                setError(res.data.message || "কোনো ফি বা পেমেন্ট তথ্য পাওয়া যায়নি।");
                setFeeData(null);
            }
        } catch (err) {
            console.error("Student fee search error:", err);
            setError(err.response?.data?.message || "শিক্ষার্থীর ফি তথ্য পাওয়া যায়নি। রোল নম্বর সঠিকভাবে যাচাই করুন।");
            setFeeData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setAcademicYear("2026");
        setSelectedClass("all");
        setSelectedSection("all");
        setFeeData(null);
        setError("");
    };

    useEffect(() => {
        const query = searchParams.get("id") || searchParams.get("roll");
        if (query) {
            setSearchTerm(query);
            handleSearch(query);
        }
    }, [searchParams]);

    const handleViewReceipt = async (receiptNo) => {
        setLoadingReceipt(true);
        try {
            const res = await api.get(`/api/public/fees/receipt/${encodeURIComponent(receiptNo)}`);
            if (res.data && res.data.success) {
                setActiveReceipt(res.data.receipt);
            }
        } catch (err) {
            console.error("Fetch receipt error:", err);
            alert("মানি রসিদের বিস্তারিত লোড করতে ব্যর্থ হয়েছে।");
        } finally {
            setLoadingReceipt(false);
        }
    };

    // Calculate month-by-month paid status
    const getMonthStatus = (monthName, monthNum) => {
        if (!feeData || !feeData.payments) return null;
        const match = feeData.payments.find(p => 
            (p.month_number && Number(p.month_number) === monthNum) ||
            (p.month_name && (p.month_name.toLowerCase().includes(monthName.toLowerCase()) || p.fee_name?.toLowerCase().includes(monthName.toLowerCase())))
        );
        return match || null;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Content Area (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. INSTITUTIONAL HEADER & PORTAL BANNER (Rangpur Zilla School Style + Modern Glassmorphism) */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white border border-emerald-500/30 shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                    <span>ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় • EIIN: ১২৪৭৫৪</span>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30">
                                    স্থাপিত: ১৯৬৭ খ্রি.
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                                শিক্ষার্থী পেমেন্ট হিস্ট্রি ও ফি লেজার বাতায়ন
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                                ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের অফিসিয়াল অনলাইন পেমেন্ট ও ফি যাচাইকরণ বাতায়ন। শিক্ষার্থীর রোল নম্বর বা আইডি প্রদান করে পরিশোধিত ফি'র ইতিহাস, বর্তমান বকেয়া এবং সরকারি মানি রসিদ (Money Receipt) সরাসরি যাচাই, প্রিন্ট বা PDF ডাউনলোড করুন।
                            </p>
                        </div>
                    </div>

                    {/* 2. ADVANCED MULTI-FIELD SEARCH PANEL (Exact Match to Rangpur Zilla School payment-history.aspx + Instant Fast React) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>পেমেন্ট অনুসন্ধান ফর্ম (Payment History Search)</span>
                            </h3>
                            <span className="text-[11px] text-slate-400 font-mono">
                                e-Services Ledger v2.1
                            </span>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                {/* Field 1: Student Roll / ID (Required) */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        শিক্ষার্থীর আইডি / শ্রেণি রোল নম্বর <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="রোল লিখুন (উদাঃ 602, 702, 801, 902, 1051)"
                                            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-mono font-bold transition-all"
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Field 2: Academic Year / Session */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        শিক্ষাবর্ষ (Session)
                                    </label>
                                    <select
                                        value={academicYear}
                                        onChange={(e) => setAcademicYear(e.target.value)}
                                        className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 font-medium"
                                    >
                                        <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                                        <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                                        <option value="2024">২০২৪ শিক্ষাবর্ষ</option>
                                    </select>
                                </div>

                                {/* Field 3: Class / শ্রেণি */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        শ্রেণি (Class)
                                    </label>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 font-medium"
                                    >
                                        <option value="all">সকল শ্রেণি (Auto)</option>
                                        <option value="CLASS-6">৬ষ্ঠ শ্রেণি (Class 6)</option>
                                        <option value="CLASS-7">৭ম শ্রেণি (Class 7)</option>
                                        <option value="CLASS-8">৮ম শ্রেণি (Class 8)</option>
                                        <option value="CLASS-9-SCI">৯ম শ্রেণি - বিজ্ঞান (Science)</option>
                                        <option value="CLASS-9-ARTS">৯ম শ্রেণি - মানবিক (Arts)</option>
                                        <option value="CLASS-10-SCI">১০ম শ্রেণি - বিজ্ঞান (Science)</option>
                                        <option value="CLASS-10-ARTS">১০ম শ্রেণি - মানবিক (Arts)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons: Search & Reset */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                                    <span className="font-semibold text-slate-700 dark:text-slate-400">দ্রুত রোল নমুনা:</span>
                                    {["602", "702", "801", "802", "902", "1051"].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => {
                                                setSearchTerm(r);
                                                handleSearch(r);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-mono font-bold transition-all border border-emerald-200 dark:border-emerald-800/50 cursor-pointer shadow-xs"
                                        >
                                            #{r}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                                    >
                                        রিসেট
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>অনুসন্ধান হচ্ছে...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4" />
                                                <span>ফি হিস্ট্রি খুঁজুন</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* 3. SEARCH RESULTS AREA (Visible when student found) */}
                    {feeData && feeData.student && (
                        <div className="space-y-6 animate-in fade-in">
                            
                            {/* Academic Identity Ledger Profile Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20">
                                            {feeData.student.fullname?.charAt(0) || "S"}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                                                    {feeData.student.fullname}
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    <span>নিয়মিত শিক্ষার্থী</span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                পিতা: <strong className="text-slate-700 dark:text-slate-300">{feeData.student.fathername || "তথ্য নেই"}</strong> • মাতা: <strong className="text-slate-700 dark:text-slate-300">{feeData.student.mothername || "তথ্য নেই"}</strong>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold">
                                            আইডি / রোল: <span className="text-emerald-600 dark:text-emerald-400 font-black">{feeData.student.rollnumber}</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                            {feeData.student.course_name}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Academic Meta Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">শিক্ষাবর্ষ:</span>
                                        <strong className="text-slate-800 dark:text-slate-200 font-mono">{feeData.student.academic_year || "2026"} খ্রি.</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">শিফট / বিভাগ:</span>
                                        <strong className="text-slate-800 dark:text-slate-200">দিবা শিফট (Day)</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">মোবাইল ব্যাংকিং হিসাব:</span>
                                        <strong className="text-slate-800 dark:text-slate-200 font-mono">{feeData.student.contactnumber || "০১৭১২-xxxxxx"}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">বৃত্তি / উপবৃত্তি ধরণ:</span>
                                        <strong className="text-emerald-600 dark:text-emerald-400">{feeData.student.scholarship_type || "সাধারণ সরকারি উপবৃত্তি"}</strong>
                                    </div>
                                </div>

                                {/* 4 Key Performance Financial Stat Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                                    <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
                                        <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold block">
                                            মোট ধার্যকৃত ফি (বার্ষিক)
                                        </span>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                            ৳ {Number(feeData.summary.annual_payable).toLocaleString()}
                                        </div>
                                        <span className="text-[10px] text-blue-600/80 dark:text-blue-400 block">
                                            সরকারি বোর্ড ও স্কুল সিলেবাস
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                                        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold block">
                                            পরিশোধিত মোট টাকা
                                        </span>
                                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                            ৳ {Number(feeData.summary.total_paid).toLocaleString()}
                                        </div>
                                        <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400 font-bold block flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            <span>{feeData.summary.payment_count}টি রসিদ সম্পন্ন</span>
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 space-y-1">
                                        <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold block">
                                            মওকুফ / ছাড় (Waiver)
                                        </span>
                                        <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">
                                            ৳ {Number(feeData.summary.total_waiver || 0).toLocaleString()}
                                        </div>
                                        <span className="text-[10px] text-teal-600/80 dark:text-teal-400 block">
                                            মেধাবৃত্তি বা বিশেষ ছাড়
                                        </span>
                                    </div>

                                    <div className={`p-4 rounded-2xl border space-y-1 ${
                                        Number(feeData.summary.total_due) > 0
                                            ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                                            : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
                                    }`}>
                                        <span className={`text-xs font-semibold block ${
                                            Number(feeData.summary.total_due) > 0 ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"
                                        }`}>
                                            বর্তমান নিট বকেয়া (Due)
                                        </span>
                                        <div className={`text-2xl font-black font-mono ${
                                            Number(feeData.summary.total_due) > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                                        }`}>
                                            ৳ {Number(feeData.summary.total_due).toLocaleString()}
                                        </div>
                                        <span className={`text-[10px] font-bold block ${
                                            Number(feeData.summary.total_due) > 0 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
                                        }`}>
                                            {Number(feeData.summary.total_due) > 0 ? "বকেয়া ফি পরিশোধ করুন" : "কোনো বকেয়া নেই (Cleared)"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 4. ADVANCED 12-MONTH FEE SCHEDULE TRACKER (Advance Feature: Month-by-month Visual Grid) */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-600" />
                                            <span>১২ মাসের মাসিক বেতন স্ট্যাটাস ক্যালেন্ডার (২০২৬)</span>
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            কোন কোন মাসের ফি পরিশোধিত হয়েছে এবং কোন মাস বকেয়া রয়েছে তা এক নজরে দেখুন।
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {banglaMonths.map((m) => {
                                        const payment = getMonthStatus(m.key, m.num);
                                        const isPaid = !!payment;
                                        return (
                                            <div
                                                key={m.num}
                                                className={`p-3 rounded-2xl border text-center transition-all ${
                                                    isPaid
                                                        ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs"
                                                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1 text-[11px]">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">{m.bn}</span>
                                                    <span className={`w-2 h-2 rounded-full ${isPaid ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                                                </div>

                                                {isPaid ? (
                                                    <div className="space-y-1">
                                                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                                                            পরিশোধিত ৳{Number(payment.amount_paid).toLocaleString()}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewReceipt(payment.receipt_no)}
                                                            className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-mono block mx-auto cursor-pointer"
                                                        >
                                                            রসিদ: {payment.receipt_no}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                                                            বকেয়া ফি
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 block font-mono">
                                                            ধার্য ৳২০০
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 5. OFFICIAL PAYMENT TRANSACTION LEDGER TABLE (Rangpur Zilla School Style Detailed Ledger) */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4 p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                            <Receipt className="w-4 h-4 text-emerald-600" />
                                            <span>ফি আদায়ের বিস্তারিত হিস্ট্রি ও ট্রানজেকশন লেজার ({feeData.payments.length}টি)</span>
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            প্রতিটি ফি জমার তারিখ, রসিদ নম্বর ও পেমেন্ট মাধ্যম বিস্তারিত দেখুন।
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>পুরো লেজার প্রিন্ট</span>
                                    </button>
                                </div>

                                {feeData.payments.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10.5px] bg-slate-50/70 dark:bg-slate-800/40">
                                                    <th className="py-3 px-3">ক্র.নং</th>
                                                    <th className="py-3 px-3">মানি রসিদ নম্বর</th>
                                                    <th className="py-3 px-3">ফি'র খাত ও মাস</th>
                                                    <th className="py-3 px-3">পরিশোধের তারিখ</th>
                                                    <th className="py-3 px-3">পেমেন্ট মাধ্যম</th>
                                                    <th className="py-3 px-3 text-right">জমার পরিমাণ</th>
                                                    <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                                                    <th className="py-3 px-3 text-center">অ্যাকশন</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {feeData.payments.map((p, pIdx) => (
                                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="py-3.5 px-3 font-mono text-slate-400 text-center">
                                                            {pIdx + 1}
                                                        </td>
                                                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                                            {p.receipt_no}
                                                        </td>
                                                        <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                                            {p.fee_name || p.fee_type}
                                                            {p.month_name && (
                                                                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">
                                                                    {p.month_name}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                                                            {p.payment_date ? new Date(p.payment_date).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                                                        </td>
                                                        <td className="py-3.5 px-3">
                                                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border border-slate-200 dark:border-slate-700">
                                                                {p.payment_method || "নগদ (Cash)"}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                                            ৳ {Number(p.amount_paid).toLocaleString()}
                                                        </td>
                                                        <td className="py-3.5 px-3 text-center">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
                                                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                                                <span>পরিশোধিত</span>
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-3 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleViewReceipt(p.receipt_no)}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-300 dark:border-emerald-700 shadow-xs"
                                                            >
                                                                <Printer className="w-3.5 h-3.5" />
                                                                <span>রসিদ প্রিন্ট</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                                        এই শিক্ষার্থীর এখনো কোনো ফি জমার ট্রানজেকশন রেকর্ড নেই।
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar (4 cols) */}
                <div className="lg:col-span-4">
                    <RightSidebar />
                </div>
            </div>

            {/* 6. OFFICIAL 2-PART GOVERNMENT MONEY RECEIPT MODAL (Student Copy & Office Copy) */}
            {activeReceipt && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 animate-in fade-in">
                    <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[95vh] overflow-y-auto print:shadow-none print:border-none print:max-h-none print:rounded-none">
                        
                        {/* Modal Header Controls (Hidden in Print) */}
                        <div className="print:hidden flex items-center justify-between pb-3 border-b border-slate-200">
                            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>সরকারি ২-অংশের মানি রসিদ (Official Double-Part Receipt Slip)</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>রসিদ প্রিন্ট / PDF সংরক্ষণ</span>
                                </button>
                                <button
                                    onClick={() => setActiveReceipt(null)}
                                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 2-Part Printable Voucher Grid (Side-by-side: Student Copy & Office Copy) */}
                        <div id="printable-receipt" className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 font-sans text-slate-900">
                            
                            {/* PART 1: শিক্ষার্থীর কপি (Student Copy) */}
                            <div className="p-5 border-2 border-emerald-800 rounded-2xl space-y-4 bg-white relative">
                                <div className="text-center space-y-1 pb-3 border-b-2 border-emerald-800">
                                    <div className="flex items-center justify-center gap-2.5">
                                        <div className="w-9 h-9 shrink-0">
                                            <img src="/logo.png" alt="School Seal" className="w-full h-full object-contain" />
                                        </div>
                                        <h3 className="text-base font-black text-emerald-950 tracking-tight">
                                            ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
                                        </h3>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-semibold">
                                        ডিমলা, নীলফামারী • EIIN: ১২৪৭৫৪ • দিনাজপুর শিক্ষা বোর্ড
                                    </p>
                                    <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase border border-emerald-400">
                                        মানি রসিদ • শিক্ষার্থীর কপি (Student Copy)
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight">
                                    <div><span className="text-slate-500">রসিদ নং:</span> <strong className="font-mono">{activeReceipt.receipt_no}</strong></div>
                                    <div className="text-right"><span className="text-slate-500">তারিখ:</span> <strong>{activeReceipt.payment_date ? new Date(activeReceipt.payment_date).toLocaleDateString("bn-BD") : "—"}</strong></div>
                                    <div><span className="text-slate-500">নাম:</span> <strong>{activeReceipt.student_name}</strong></div>
                                    <div className="text-right"><span className="text-slate-500">শ্রেণি:</span> <strong>{activeReceipt.course_name}</strong></div>
                                    <div><span className="text-slate-500">রোল নং:</span> <strong className="font-mono font-black">{activeReceipt.student_rollnumber}</strong></div>
                                    <div className="text-right"><span className="text-slate-500">মাধ্যম:</span> <strong>{activeReceipt.payment_method || "নগদ"}</strong></div>
                                </div>

                                <table className="w-full text-[11px] border border-slate-300 text-left">
                                    <thead className="bg-emerald-50 text-emerald-900 border-b border-slate-300 font-bold">
                                        <tr>
                                            <th className="p-1.5 border-r border-slate-300">ফি'র বিবরণ</th>
                                            <th className="p-1.5 text-right">আদায়ের টাকা</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {activeReceipt.items?.map((it, idx) => (
                                            <tr key={idx}>
                                                <td className="p-1.5 border-r border-slate-200">
                                                    {it.fee_name} {it.month_name ? `(${it.month_name})` : ""}
                                                </td>
                                                <td className="p-1.5 text-right font-mono font-bold">
                                                    ৳ {Number(it.amount_paid).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t-2 border-emerald-800 bg-slate-50 font-bold">
                                        <tr>
                                            <td className="p-1.5 text-right text-slate-700">সর্বমোট আদায়:</td>
                                            <td className="p-1.5 text-right font-mono text-emerald-800 font-black">
                                                ৳ {Number(activeReceipt.total_paid).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="pt-6 flex items-center justify-between text-[10px] text-slate-600">
                                    <div className="text-center">
                                        <div className="w-20 border-b border-slate-400 mb-1"></div>
                                        <span>হিসাবরক্ষক</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 border-b border-slate-400 mb-1"></div>
                                        <span>প্রধান শিক্ষক</span>
                                    </div>
                                </div>
                            </div>

                            {/* PART 2: অফিস কপি (Office Copy) */}
                            <div className="p-5 border-2 border-slate-800 rounded-2xl space-y-4 bg-white relative">
                                <div className="text-center space-y-1 pb-3 border-b-2 border-slate-800">
                                    <div className="flex items-center justify-center gap-2.5">
                                        <div className="w-9 h-9 shrink-0">
                                            <img src="/logo.png" alt="School Seal" className="w-full h-full object-contain" />
                                        </div>
                                        <h3 className="text-base font-black text-slate-950 tracking-tight">
                                            ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
                                        </h3>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-semibold">
                                        ডিমলা, নীলফামারী • EIIN: ১২৪৭৫৪ • দিনাজপুর শিক্ষা বোর্ড
                                    </p>
                                    <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-black text-[10px] uppercase border border-slate-400">
                                        মানি রসিদ • অফিস কপি (Office Copy)
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight">
                                    <div><span className="text-slate-500">রসিদ নং:</span> <strong className="font-mono">{activeReceipt.receipt_no}</strong></div>
                                    <div className="text-right"><span className="text-slate-500">তারিখ:</span> <strong>{activeReceipt.payment_date ? new Date(activeReceipt.payment_date).toLocaleDateString("bn-BD") : "—"}</strong></div>
                                    <div><span className="text-slate-500">নাম:</span> <strong>{activeReceipt.student_name}</strong></div>
                                    <div className="text-right"><span className="text-slate-500">শ্রেণি:</span> <strong>{activeReceipt.course_name}</strong></div>
                                    <div><span className="text-slate-500">রোল নং:</span> <strong className="font-mono font-black">{activeReceipt.student_rollnumber}</strong></div>
                                    <div className="text-right"><span className="text-slate-500">মাধ্যম:</span> <strong>{activeReceipt.payment_method || "নগদ"}</strong></div>
                                </div>

                                <table className="w-full text-[11px] border border-slate-300 text-left">
                                    <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold">
                                        <tr>
                                            <th className="p-1.5 border-r border-slate-300">ফি'র বিবরণ</th>
                                            <th className="p-1.5 text-right">আদায়ের টাকা</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {activeReceipt.items?.map((it, idx) => (
                                            <tr key={idx}>
                                                <td className="p-1.5 border-r border-slate-200">
                                                    {it.fee_name} {it.month_name ? `(${it.month_name})` : ""}
                                                </td>
                                                <td className="p-1.5 text-right font-mono font-bold">
                                                    ৳ {Number(it.amount_paid).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t-2 border-slate-800 bg-slate-50 font-bold">
                                        <tr>
                                            <td className="p-1.5 text-right text-slate-700">সর্বমোট আদায়:</td>
                                            <td className="p-1.5 text-right font-mono text-slate-900 font-black">
                                                ৳ {Number(activeReceipt.total_paid).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="pt-6 flex items-center justify-between text-[10px] text-slate-600">
                                    <div className="text-center">
                                        <div className="w-20 border-b border-slate-400 mb-1"></div>
                                        <span>হিসাবরক্ষক</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 border-b border-slate-400 mb-1"></div>
                                        <span>প্রধান শিক্ষক</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeesPage;
