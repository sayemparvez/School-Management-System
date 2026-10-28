import { useEffect, useState } from "react";
import api from "../../utils/api";
import MoneyReceiptModal from "../../components/modals/MoneyReceiptModal.jsx";
import {
  Banknote,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  RotateCcw,
  AlertCircle
} from "lucide-react";

export default function StudentFees() {
  const token = localStorage.getItem("token");

  const [student, setStudent] = useState(null);
  const [feesStructure, setFeesStructure] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchMyFees = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/fees/my-fees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(res.data.student);
      setFeesStructure(res.data.fees_structure || []);
      setPayments(res.data.payment_history || []);
    } catch (err) {
      console.error("Fetch my fees error:", err);
      setError("আপনার ফি বিবরণী লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyFees();
  }, [token]);

  const isScholarship = student?.scholarship_type === "britti" || student?.scholarship_type === "upobritti";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                আমার ফি বিবরণী ও মানি রসিদ (My Fees & Receipts)
              </h1>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block">
                শিক্ষার্থী পোর্টাল • ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
              </p>
            </div>
          </div>
          <button
            onClick={fetchMyFees}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* SCHOLARSHIP STATUS CARD */}
        {student && (
          <div className={`p-5 rounded-2xl border ${
            isScholarship 
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" 
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  শিক্ষার্থী তথ্য ও বৃত্তির বিবরণ
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {student.firstname} {student.lastname} (রোল: {student.rollnumber})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  শ্রেণি: {student.courcecode} • শিক্ষাবর্ষ: ২০২৬
                </p>
              </div>

              <div>
                {student.scholarship_type === "britti" ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center gap-2 shadow-md shadow-emerald-500/20">
                    <Award className="w-4 h-4" />
                    মেধা বৃত্তিপ্রাপ্ত শিক্ষার্থী (মাসিক বেতন মওকুফ)
                  </span>
                ) : student.scholarship_type === "upobritti" ? (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white flex items-center gap-2 shadow-md shadow-blue-500/20">
                    <Award className="w-4 h-4" />
                    সরকারি উপবৃত্তিপ্রাপ্ত শিক্ষার্থী (মাসিক বেতন মওকুফ)
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    সাধারণ শিক্ষার্থী
                  </span>
                )}
              </div>
            </div>

            {isScholarship && (
              <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                ✨ <strong>বিশেষ সুবিধা:</strong> আপনি বিদ্যালয়ের বৃত্তি/উপবৃত্তি প্রাপ্ত হওয়ায় বিদ্যালয়ের সরকারি নীতিমালা অনুযায়ী আপনাকে কোনো <strong>মাসিক বেতন (Monthly Tuition)</strong> পরিশোধ করতে হবে না। শুধুমাত্র অন্যান্য বাৎসরিক ও পরীক্ষার ফি প্রযোজ্য হবে।
              </div>
            )}
          </div>
        )}

        {/* PAYMENT HISTORY TABLE */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                আমার পরিশোধিত ফি এবং মানি রসিদ তালিকা
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                যেকোনো রসিদ দেখতে বা প্রিন্ট করতে ডানপাশের 'রসিদ প্রিন্ট' বাটনে চাপ দিন।
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {payments.length} টি পরিশোধ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">তারিখ</th>
                  <th className="px-4 py-3">রসিদ নং</th>
                  <th className="px-4 py-3">ফি-র বিবরণ</th>
                  <th className="px-4 py-3">মাস / বিবরণ</th>
                  <th className="px-4 py-3 text-right">টাকা (৳)</th>
                  <th className="px-4 py-3">আদায়কারী</th>
                  <th className="px-4 py-3 text-center">মানি রসিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500">
                      তথ্য লোড হচ্ছে...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      এখনো কোনো ফি পরিশোধ রেকর্ড নেই।
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                        {p.payment_date ? new Date(p.payment_date).toLocaleDateString("bn-BD") : "-"}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {p.receipt_no}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {p.fee_name || p.fee_type}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {p.month_name || "এককালীন"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-slate-900 dark:text-white">
                        ৳ {Number(p.amount_paid).toLocaleString("bn-BD")}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {p.collected_by_name} ({p.collected_by_role || "শ্রেণি শিক্ষক"})
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setActiveReceipt(p)}
                          className="px-3 py-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <Printer className="w-3.5 h-3.5" /> রসিদ দেখুন
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
