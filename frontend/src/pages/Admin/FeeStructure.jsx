import { useEffect, useState } from "react";
import api from "../../utils/api";
import Toast from "../../components/ui/Toast.jsx";
import {
  Banknote,
  Filter,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Award,
  Layers
} from "lucide-react";

export default function FeeStructure() {
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [academicYear, setAcademicYear] = useState("2026");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  // Load courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedCourse(res.data[0].course_code);
        }
      } catch (err) {
        console.error("Courses fetch error:", err);
      }
    };
    if (token) fetchCourses();
  }, [token]);

  // Load fee structure
  const fetchFeeStructure = async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      setError("");
      const res = await api.get(
        `/api/fees/structure?course_code=${selectedCourse}&academic_year=${academicYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data.fees || []);
    } catch (err) {
      console.error("Fee structure fetch error:", err);
      setError("ফি কাঠামো লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructure();
  }, [selectedCourse, academicYear, token]);

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddNewItem = () => {
    setItems(prev => [
      ...prev,
      {
        fee_type: `custom_${Date.now()}`,
        fee_name: "নতুন ফি (New Fee)",
        amount: 100,
        applies_to: "all",
        is_active: true
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.post(
        "/api/fees/structure",
        {
          course_code: selectedCourse,
          academic_year: academicYear,
          items
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ type: "success", message: res.data.message || "ফি কাঠামো সংরক্ষিত হয়েছে!" });
      fetchFeeStructure();
    } catch (err) {
      console.error("Save fee structure error:", err);
      setToast({ type: "error", message: err.response?.data?.message || "ফি কাঠামো সংরক্ষণ ব্যর্থ হয়েছে।" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                শ্রেণিভিত্তিক ফি কাঠামো (Fee Structure Settings)
              </h1>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block">
                প্রধান শিক্ষক ও অ্যাডমিন পোর্টাল • ফি তালিকা ও হার নির্ধারণ
              </p>
            </div>
          </div>
          <button
            onClick={fetchFeeStructure}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* POLICY BANNER */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-emerald-900 dark:text-emerald-300">
          <Award className="w-5 h-5 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm">বৃত্তি ও উপবৃত্তি সম্পর্কিত ফি নীতিমালা:</h3>
            <p>
              • <strong>মাসিক বেতন (Monthly Tuition):</strong> শুধুমাত্র সাধারণ শিক্ষার্থীদের জন্য প্রযোজ্য। যে সকল শিক্ষার্থী মেধা বৃত্তি বা সরকারি উপবৃত্তি পায় তাদের <strong>মাসিক বেতন দিতে হবে না (মওকুফ)</strong>।
            </p>
            <p>
              • <strong>অন্যান্য সকল ফি (ভর্তি, পরীক্ষা, সেশন, লাইব্রেরি ইত্যাদি):</strong> বিদ্যালয়ের সকল শিক্ষার্থীর (বৃত্তিপ্রাপ্ত ও সাধারণ) জন্য সমান প্রযোজ্য।
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FILTER CARD */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-500" />
              <label className="text-xs font-bold uppercase text-slate-500">শ্রেণি:</label>
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer min-w-[220px]"
            >
              {courses.map((c) => (
                <option key={c.course_code} value={c.course_code}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500">শিক্ষাবর্ষ:</span>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="2026">২০২৬</option>
              <option value="2025">২০২৫</option>
            </select>
          </div>
        </section>

        {/* FEE TABLE */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {selectedCourse} শ্রেণির ফি আইটেম ও টাকার পরিমাণ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                টাকার পরিমাণ পরিবর্তন করে নিচের 'সংরক্ষণ করুন' বাটনে চাপ দিন।
              </p>
            </div>
            <button
              onClick={handleAddNewItem}
              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> নতুন ফি যোগ করুন
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">ক্র.</th>
                  <th className="px-4 py-3">ফি-র নাম (বিবরণ)</th>
                  <th className="px-4 py-3">ফি-র ধরন (Type)</th>
                  <th className="px-4 py-3 text-right">টাকার পরিমাণ (৳)</th>
                  <th className="px-4 py-3 text-center">কার ক্ষেত্রে প্রযোজ্য?</th>
                  <th className="px-4 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      কোনো ফি আইটেম পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const isMonthly = item.fee_type === "monthly_tuition";
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.fee_name}
                            onChange={(e) => handleItemChange(idx, "fee_name", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                          {item.fee_type}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <span className="text-slate-400">৳</span>
                            <input
                              type="number"
                              min="0"
                              value={item.amount}
                              onChange={(e) => handleItemChange(idx, "amount", e.target.value)}
                              className="w-24 px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-right text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isMonthly ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              শুধু সাধারণ শিক্ষার্থী (বৃত্তি/উপবৃত্তি মওকুফ)
                            </span>
                          ) : (
                            <select
                              value={item.applies_to || "all"}
                              onChange={(e) => handleItemChange(idx, "applies_to", e.target.value)}
                              className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold outline-none"
                            >
                              <option value="all">সকলের জন্য সমান</option>
                              <option value="non_scholarship">শুধু সাধারণ শিক্ষার্থী</option>
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            disabled={isMonthly}
                            className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-20 transition-colors"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              মোট ফি আইটেম: {items.length}টি
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "সংরক্ষণ করা হচ্ছে..." : "ফি কাঠামো সংরক্ষণ করুন"}
            </button>
          </div>
        </section>

      </main>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
