import { useEffect, useState } from "react";
import api from "../../utils/api";
import MoneyReceiptModal from "../../components/modals/MoneyReceiptModal.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import {
  BarChart3,
  Filter,
  Printer,
  Calendar,
  Search,
  RotateCcw,
  Banknote,
  FileText
} from "lucide-react";

const MONTH_NAMES = [
  "জানুয়ারি (January)",
  "ফেব্রুয়ারি (February)",
  "মার্চ (March)",
  "এপ্রিল (April)",
  "মে (May)",
  "জুন (June)",
  "জুলাই (July)",
  "আগস্ট (August)",
  "সেপ্টেম্বর (September)",
  "অক্টোবর (October)",
  "নভেম্বর (November)",
  "ডিসেম্বর (December)"
];

export default function FeeReport() {
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [academicYear, setAcademicYear] = useState("2026");
  const [feeType, setFeeType] = useState("");
  const [monthNumber, setMonthNumber] = useState("");
  const [reportData, setReportData] = useState({ total_records: 0, total_collected: 0, records: [] });
  const [loading, setLoading] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data || []);
      } catch (err) {
        console.error("Courses fetch error:", err);
      }
    };
    if (token) fetchCourses();
  }, [token]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      let url = `/api/fees/report?academic_year=${academicYear}`;
      if (selectedCourse) url += `&course_code=${selectedCourse}`;
      if (feeType) url += `&fee_type=${feeType}`;
      if (monthNumber) url += `&month_number=${monthNumber}`;

      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(res.data);
    } catch (err) {
      console.error("Report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedCourse, academicYear, feeType, monthNumber, token]);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminPageHeader
          badge="হিসাবরক্ষণ ও অডিট • ফি লেজার"
          badgeIcon={BarChart3}
          title="ফি আদায় প্রতিবেদন ও লেজার (Fee Report)"
          subtitle="দৈনিক, মাসিক ও খাতভিত্তিক মোট আদায়, ছাত্রীদের বকেয়া ও আয়-ব্যয় অডিট রিপোর্ট বিশ্লেষণ করুন।"
        >
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span>রিপোর্ট প্রিন্ট করুন</span>
          </button>
          <button
            onClick={fetchReport}
            className="p-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer"
            title="রিফ্রেশ"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
          </button>
        </AdminPageHeader>

        {/* PRINT HEADER ONLY VISIBLE WHEN PRINTING */}
        <div className="hidden print:block text-center border-b pb-4 mb-4 text-black">
          <h2 className="text-xl font-bold">ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়</h2>
          <p className="text-xs">ফি আদায় প্রতিবেদন ও জাবেদা বিবরণী</p>
          <p className="text-[11px] font-mono mt-1">শিক্ষাবর্ষ: {academicYear} • তারিখ: {new Date().toLocaleDateString("bn-BD")}</p>
        </div>

        {/* FILTER BAR */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                শ্রেণি নির্বাচন:
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="">সকল শ্রেণি (All Classes)</option>
                {courses.map((c) => (
                  <option key={c.course_code} value={c.course_code}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                ফি-র ধরন:
              </label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="">সকল ধরনের ফি</option>
                <option value="monthly_tuition">মাসিক বেতন</option>
                <option value="admission">ভর্তি / সেশন ফি</option>
                <option value="exam_fee">পরীক্ষার ফি</option>
                <option value="development">উন্নয়ন ফি</option>
                <option value="library_sports">লাইব্রেরি ও ক্রীড়া ফি</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                মাস:
              </label>
              <select
                value={monthNumber}
                onChange={(e) => setMonthNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="">সকল মাস</option>
                {MONTH_NAMES.map((mName, i) => (
                  <option key={i + 1} value={i + 1}>
                    {mName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                শিক্ষাবর্ষ:
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="2026">২০২৬</option>
                <option value="2025">২০২৫</option>
              </select>
            </div>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">মোট আদায়কৃত লেনদেন</span>
              <strong className="text-2xl font-black text-slate-800 dark:text-slate-100">{reportData.total_records} টি</strong>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">সর্বমোট আদায়কৃত অর্থ</span>
              <strong className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                ৳ {Number(reportData.total_collected).toLocaleString("bn-BD")}
              </strong>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 rounded-xl">
              <Banknote className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ফি আদায়ের বিস্তারিত বিবরণী
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              মোট: {reportData.records.length} টি রেকর্ড
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-3 py-3">তারিখ</th>
                  <th className="px-3 py-3">রসিদ নং</th>
                  <th className="px-3 py-3">রোল</th>
                  <th className="px-3 py-3">শিক্ষার্থীর নাম</th>
                  <th className="px-3 py-3">শ্রেণি</th>
                  <th className="px-3 py-3">ফি-র বিবরণ</th>
                  <th className="px-3 py-3">মাস</th>
                  <th className="px-3 py-3 text-right">আদায় (৳)</th>
                  <th className="px-3 py-3">আদায়কারী</th>
                  <th className="px-3 py-3 text-center print:hidden">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-slate-500">
                      রিপোর্ট লোড হচ্ছে...
                    </td>
                  </tr>
                ) : reportData.records.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-slate-400">
                      কোনো লেনদেন রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  reportData.records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                        {r.payment_date ? new Date(r.payment_date).toLocaleDateString("bn-BD") : "-"}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {r.receipt_no}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {r.student_rollnumber}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white">
                        {r.student_name}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-600 dark:text-slate-400">
                        {r.course_code}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        {r.fee_name || r.fee_type}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {r.month_name || "-"}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-black text-slate-900 dark:text-white">
                        ৳ {Number(r.amount_paid).toLocaleString("bn-BD")}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold block">{r.collected_by_name}</span>
                        <span className="text-[10px] text-slate-400">({r.collected_by_role || "কর্মকর্তা"})</span>
                      </td>
                      <td className="px-3 py-2.5 text-center print:hidden">
                        <button
                          onClick={() => setActiveReceipt(r)}
                          className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" /> রসিদ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <MoneyReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receipt={activeReceipt}
      />

    </div>
  );
}
