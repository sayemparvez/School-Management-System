import React, { useState } from "react";
import {
    Search, GraduationCap, Award, Printer, CheckCircle, XCircle,
    Calendar, User, BookOpen, AlertCircle, FileText, ArrowRight
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";
import api from "../../utils/api";

const InternalResultsPage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const gData = cms?.general || {};
    const [rollInput, setRollInput] = useState("");
    const [termInput, setTermInput] = useState("half_yearly");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultData, setResultData] = useState(null);

    // Auto-detect exam type based on roll number pattern (e.g. 1001, 1051 = Class 10)
    const handleRollChange = (val) => {
        setRollInput(val);
        const clean = val.trim();
        if (clean.startsWith("10") && clean.length >= 3) {
            // Suggest class 10 exams
            if (termInput === "half_yearly") setTermInput("pre_test");
            else if (termInput === "annual") setTermInput("test");
        } else if ((clean.startsWith("6") || clean.startsWith("7") || clean.startsWith("8") || clean.startsWith("9")) && clean.length >= 3) {
            // Suggest class 6-9 exams
            if (termInput === "pre_test") setTermInput("half_yearly");
            else if (termInput === "test") setTermInput("annual");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!rollInput.trim()) {
            setError(lang === "bn" ? "দয়া করে শিক্ষার্থীর রোল বা রেজিস্ট্রেশন নম্বর লিখুন।" : "Please enter student roll or registration number.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await api.get(`/api/public/results/search?roll=${encodeURIComponent(rollInput.trim())}&term=${termInput}`);
            if (res.data && res.data.found) {
                setResultData(res.data);
            } else {
                setError(lang === "bn" ? "প্রদত্ত রোল নম্বরে কোনো ফলাফল পাওয়া যায়নি।" : "No examination results found for this roll.");
                setResultData(null);
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || (lang === "bn" ? "প্রদত্ত রোল নম্বরে কোনো ফলাফল পাওয়া যায়নি।" : "No examination results found for this roll.");
            setError(msg);
            setResultData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 print:p-0 print:m-0 print:space-y-0">
            {/* Header Banner (Hidden during Print) */}
            <div className="print:hidden bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "ফলাফল অনুসন্ধান পোর্টাল" : "Examination Results Portal"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navInternalExam")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "শিক্ষার্থীর রোল বা রেজিস্ট্রেশন নম্বর দিয়ে ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের অভ্যন্তরীণ পরীক্ষার পূর্ণাঙ্গ ফলাফল ও মার্কশিট দেখুন।"
                            : "Search and view individual internal examination results and official marksheets using Student Roll or Registration ID."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:m-0 print:p-0">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6 print:w-full print:m-0 print:p-0 print:space-y-0">
                    {/* Search Card (Hidden during Print) */}
                    <div className="print:hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                            <Search className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-slate-800 dark:text-white text-base">
                                {lang === "bn" ? "পরীক্ষার ফলাফল অনুসন্ধান করুন" : "Search Examination Result"}
                            </h3>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Roll or Reg Input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        {lang === "bn" ? "শিক্ষার্থীর রোল / রেজিস্ট্রেশন নম্বর *" : "Student Roll / Registration No *"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={rollInput}
                                        onChange={(e) => handleRollChange(e.target.value)}
                                        placeholder={lang === "bn" ? "যেমন: 1051, 1001, 601, 602..." : "e.g. 1051, 1001, 601, 602..."}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {lang === "bn" ? "পরামর্শ: টেস্ট করার জন্য '1051', '1001' বা '602' লিখুন" : "Tip: Enter '1051', '1001' or '602' to test records"}
                                    </p>
                                </div>

                                {/* Examination Term */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        {lang === "bn" ? "পরীক্ষার ধরন নির্বাচন করুন *" : "Select Examination *"}
                                    </label>
                                    <select
                                        value={termInput}
                                        onChange={(e) => setTermInput(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                                    >
                                        <optgroup label={lang === "bn" ? "৬ষ্ঠ হতে ৯ম শ্রেণি" : "Class 6 to 9"}>
                                            <option value="half_yearly">
                                                {lang === "bn" ? "অর্ধবার্ষিক পরীক্ষা (Half-Yearly Exam)" : "Half-Yearly Examination"}
                                            </option>
                                            <option value="annual">
                                                {lang === "bn" ? "বার্ষিক পরীক্ষা (Annual Exam)" : "Annual Examination"}
                                            </option>
                                        </optgroup>
                                        <optgroup label={lang === "bn" ? "১০ম শ্রেণি (SSC পরীক্ষার্থী)" : "Class 10 (SSC Candidates)"}>
                                            <option value="pre_test">
                                                {lang === "bn" ? "প্রাক-নির্বাচনী পরীক্ষা (Pre-Test Exam)" : "Pre-Test Examination"}
                                            </option>
                                            <option value="test">
                                                {lang === "bn" ? "নির্বাচনী পরীক্ষা (Test Exam)" : "Test Examination"}
                                            </option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    {lang === "bn" ? "সরাসরি ডাটাবেজ থেকে ভেরিফাইড ফলাফল" : "Direct verified results from institutional database"}
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 text-xs sm:text-sm active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span>{lang === "bn" ? "অনুসন্ধান চলছে..." : "Searching..."}</span>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4" />
                                            <span>{lang === "bn" ? "ফলাফল দেখুন" : "Get Result"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Results Display / Official Marksheet */}
                    {resultData && resultData.student && (
                        <div
                            id="marksheet"
                            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-600/60 dark:border-emerald-700/60 shadow-lg overflow-hidden relative print:border-2 print:border-emerald-700 print:rounded-none print:shadow-none"
                        >
                            {/* Watermark Crest */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] print:opacity-[0.06] select-none">
                                <img src="/logo.png" alt="School Seal Watermark" className="w-80 h-80 object-contain" />
                            </div>

                            {/* Marksheet Official Header */}
                            <div className="p-4 sm:p-6 print:p-3 text-center border-b-2 border-emerald-600/30 dark:border-emerald-700/30 relative bg-gradient-to-b from-emerald-50/70 via-white to-white dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-900 print:bg-white">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-0.5 border border-emerald-600/30 flex items-center justify-center shadow-sm">
                                        <img src="/logo.png" alt="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <h3 className="text-xl sm:text-2xl print:text-xl font-black text-emerald-950 dark:text-white print:text-emerald-900 tracking-tight">
                                    {gData.school_name_bn || t("schoolName")}
                                </h3>
                                <p className="text-xs sm:text-sm print:text-xs font-bold text-slate-700 dark:text-slate-300 print:text-slate-700">
                                    {gData.school_name_en || t("schoolNameEn")}
                                </p>
                                <p className="text-[11px] print:text-[10px] text-slate-500 font-semibold mt-0.5">
                                    EIIN: {gData.eiin || t("eiin")} • স্থাপিত: {gData.est_year || "১৯৬৭"} খ্রি. • {gData.address_bn || "ডাকঘর ও উপজেলা: ডিমলা, জেলা: নীলফামারী"}
                                </p>
                                <div className="mt-2.5 print:mt-1.5">
                                    <span className="inline-block px-4 py-1 print:py-0.5 rounded-full bg-emerald-700 text-white font-extrabold text-xs print:text-[11px] uppercase tracking-wider shadow-xs">
                                        একাডেমিক মূল্যায়ন ও অগ্রগতি পত্র (PROGRESS REPORT)
                                    </span>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="absolute top-4 right-4 print:hidden px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition-all"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>{lang === "bn" ? "প্রিন্ট মার্কশিট" : "Print Marksheet"}</span>
                                </button>
                            </div>

                            {/* Student Info Grid */}
                            <div className="p-4 sm:p-5 print:p-2.5 bg-slate-50/70 dark:bg-slate-800/30 print:bg-slate-50/50 border-b border-slate-200 dark:border-slate-800 print:border-slate-400">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs print:text-[11px]">
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">শিক্ষার্থীর নাম (Student Name)</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white print:text-black text-xs sm:text-sm">{resultData.student.fullname}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">রোল নম্বর (Roll No)</span>
                                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400 print:text-emerald-800 text-xs sm:text-sm">#{resultData.student.rollnumber}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">শ্রেণি ও বিভাগ (Class / Group)</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black text-xs">{resultData.student.course_name}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">পরীক্ষার নাম (Exam Term)</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black text-xs">{resultData.student.term_name}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">পিতার নাম (Father's Name)</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-300 print:text-black text-xs">{resultData.student.fathername}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">মাতার নাম (Mother's Name)</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-300 print:text-black text-xs">{resultData.student.mothername}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">শিক্ষাবর্ষ (Session)</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black text-xs">{resultData.student.academic_year || "2026"}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 print:bg-transparent p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 print:border-none">
                                        <span className="text-slate-400 print:text-slate-600 block text-[9px] uppercase font-bold">ফলাফল স্থিতি (Status)</span>
                                        <span className={`inline-block font-black text-xs px-2 py-0.5 rounded ${
                                            resultData.summary.result_status === "Passed"
                                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 print:bg-emerald-100 print:text-emerald-900"
                                                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 print:bg-red-100 print:text-red-900"
                                        }`}>
                                            {resultData.summary.result_status === "Passed" ? "কৃতকার্য (PASSED)" : "অকৃতকার্য (FAILED)"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Marks Table */}
                            <div className="p-3 sm:p-5 print:p-2">
                                <table className="w-full text-xs text-left border-collapse border border-slate-300 dark:border-slate-700 print:border-slate-500">
                                    <thead className="bg-emerald-800/10 dark:bg-slate-800 print:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold uppercase text-[10px] sm:text-[11px] print:text-[9.5px]">
                                        <tr>
                                            <th className="py-2 px-2.5 print:py-1 print:px-1.5 border border-slate-300 dark:border-slate-700 print:border-slate-500">বিষয় কোড ও নাম (Subject)</th>
                                            <th className="py-2 px-2 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500">সৃজনশীল (CQ)</th>
                                            <th className="py-2 px-2 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500">বহুনির্বাচনী (MCQ)</th>
                                            <th className="py-2 px-2 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500">ব্যবহারিক (Prac)</th>
                                            <th className="py-2 px-2.5 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500 font-black">মোট প্রাপ্ত</th>
                                            <th className="py-2 px-2 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500">পূর্ণমান</th>
                                            <th className="py-2 px-2 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500">লেটার গ্রেড</th>
                                            <th className="py-2 px-2 print:py-1 print:px-1 text-center border border-slate-300 dark:border-slate-700 print:border-slate-500 font-black">পয়েন্ট (GP)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-400">
                                        {resultData.marks.map((m, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 print:hover:bg-transparent">
                                                <td className="py-2 px-2.5 print:py-0.5 print:px-1.5 print:text-[9.5px] font-semibold text-slate-900 dark:text-white print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    <span className="font-mono text-emerald-700 font-bold mr-1.5">{m.subjectcode}:</span>
                                                    {m.subjectname}
                                                </td>
                                                <td className="py-2 px-2 print:py-0.5 print:px-1 print:text-[9.5px] text-center text-slate-700 dark:text-slate-300 print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    {m.cq_marks}
                                                </td>
                                                <td className="py-2 px-2 print:py-0.5 print:px-1 print:text-[9.5px] text-center text-slate-700 dark:text-slate-300 print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    {m.mcq_marks}
                                                </td>
                                                <td className="py-2 px-2 print:py-0.5 print:px-1 print:text-[9.5px] text-center text-slate-700 dark:text-slate-300 print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    {m.practical_marks}
                                                </td>
                                                <td className="py-2 px-2.5 print:py-0.5 print:px-1 print:text-[9.5px] text-center font-bold text-slate-900 dark:text-white print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    {m.total_marks}
                                                </td>
                                                <td className="py-2 px-2 print:py-0.5 print:px-1 print:text-[9.5px] text-center text-slate-600 dark:text-slate-400 print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    {m.max_marks}
                                                </td>
                                                <td className="py-2 px-2 print:py-0.5 print:px-1 print:text-[9.5px] text-center font-bold border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    <span className={`px-2 py-0.5 rounded font-black ${
                                                        m.grade === "A+" ? "bg-emerald-100 text-emerald-900 print:bg-transparent" :
                                                        m.grade === "A" ? "bg-blue-100 text-blue-900 print:bg-transparent" :
                                                        m.grade === "F" ? "bg-red-100 text-red-900 print:bg-transparent" : "bg-slate-100 text-slate-800 print:bg-transparent"
                                                    }`}>
                                                        {m.grade}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-2 print:py-0.5 print:px-1 print:text-[9.5px] text-center font-black text-emerald-700 dark:text-emerald-400 print:text-black border border-slate-300 dark:border-slate-700 print:border-slate-400">
                                                    {m.point.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Performance Footer Banner */}
                            <div className="p-4 sm:p-5 print:p-2 border-t-2 border-slate-200 dark:border-slate-800 print:border-slate-400 bg-slate-50/50 dark:bg-slate-900/50 print:bg-white">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                                    <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 print:bg-white rounded-xl border border-slate-200 dark:border-slate-700 print:border-slate-400">
                                        <span className="text-[9px] print:text-[8.5px] text-slate-500 uppercase font-bold block">সর্বমোট প্রাপ্ত নম্বর</span>
                                        <span className="text-base sm:text-lg print:text-base font-black text-slate-900 dark:text-white print:text-black">
                                            {resultData.summary.total_marks_obtained} / {resultData.summary.total_max_marks}
                                        </span>
                                    </div>
                                    <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 print:bg-white rounded-xl border border-slate-200 dark:border-slate-700 print:border-slate-400">
                                        <span className="text-[9px] print:text-[8.5px] text-slate-500 uppercase font-bold block">মোট জিপিএ (GPA)</span>
                                        <span className="text-base sm:text-lg print:text-base font-black text-emerald-700 dark:text-emerald-400 print:text-black">
                                            {resultData.summary.gpa}
                                        </span>
                                    </div>
                                    <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 print:bg-white rounded-xl border border-slate-200 dark:border-slate-700 print:border-slate-400">
                                        <span className="text-[9px] print:text-[8.5px] text-slate-500 uppercase font-bold block">লেটার গ্রেড (Grade)</span>
                                        <span className="text-base sm:text-lg print:text-base font-black text-emerald-800 dark:text-emerald-300 print:text-black">
                                            {resultData.summary.final_grade}
                                        </span>
                                    </div>
                                    <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 print:bg-white rounded-xl border border-slate-200 dark:border-slate-700 print:border-slate-400">
                                        <span className="text-[9px] print:text-[8.5px] text-slate-500 uppercase font-bold block">ফলাফল মন্তব্য</span>
                                        <span className="text-xs sm:text-sm print:text-xs font-black text-emerald-800 dark:text-emerald-300 print:text-black">
                                            {resultData.summary.result_status === "Passed" ? "মেধাবী ও কৃতিত্বপূর্ণ উত্তীর্ণ" : "পুনঃমূল্যায়ন প্রয়োজন"}
                                        </span>
                                    </div>
                                </div>

                                {/* Grading Scale Legend */}
                                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[8.5px] sm:text-[9.5px] print:text-[8px] text-slate-600 dark:text-slate-400 print:text-black">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black">গ্রেডিং স্কেল:</span>
                                    <span>A+ (৮০-১০০ = ৫.০)</span>
                                    <span>•</span>
                                    <span>A (৭০-৭৯ = ৪.০)</span>
                                    <span>•</span>
                                    <span>A- (৬০-৬৯ = ৩.৫)</span>
                                    <span>•</span>
                                    <span>B (৫০-৫৯ = ৩.০)</span>
                                    <span>•</span>
                                    <span>C (৪০-৪৯ = ২.০)</span>
                                    <span>•</span>
                                    <span>D (৩৩-৩৯ = ১.০)</span>
                                    <span>•</span>
                                    <span>F (০-৩২ = ০.০)</span>
                                </div>

                                {/* Official Signatures Section for Printing */}
                                <div className="mt-8 print:mt-5 pt-4 print:pt-2 grid grid-cols-3 gap-6 text-center text-xs print:text-[9.5px] text-slate-700 dark:text-slate-300 print:text-black">
                                    <div className="border-t border-slate-500 pt-1 font-medium">
                                        শ্রেণি শিক্ষকের স্বাক্ষর
                                    </div>
                                    <div className="border-t border-slate-500 pt-1 font-medium">
                                        অভিভাবকের স্বাক্ষর
                                    </div>
                                    <div className="border-t border-slate-500 pt-1 font-bold">
                                        প্রধান শিক্ষকের স্বাক্ষর ও সিল
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar (4 cols - Hidden during Print) */}
                <div className="print:hidden lg:col-span-4">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default InternalResultsPage;
