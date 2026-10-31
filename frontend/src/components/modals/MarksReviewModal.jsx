import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { 
  X, 
  Award, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  BarChart3,
  FileText,
  UserCheck,
  Edit3
} from "lucide-react";

export default function MarksReviewModal({ 
  isOpen, 
  onClose, 
  course, 
  sem, 
  subject, 
  onApprove, 
  canApprove = false 
}) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleGoToEdit = () => {
    const isFaculty = location.pathname.startsWith("/faculty");
    const targetUrl = isFaculty
      ? `/faculty/enter-marks?course=${encodeURIComponent(course)}&sem=${encodeURIComponent(sem)}&subject=${encodeURIComponent(subject)}`
      : `/admin/enter-marks?course=${encodeURIComponent(course)}&sem=${encodeURIComponent(sem)}&subject=${encodeURIComponent(subject)}`;
    onClose();
    navigate(targetUrl);
  };

  useEffect(() => {
    if (!isOpen || !course || !sem || !subject) {
      setData(null);
      setError("");
      return;
    }

    const fetchReview = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(
          `/api/marks/review?course=${course}&sem=${sem}&subject=${subject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error("Fetch review error:", err);
        setError(err.response?.data?.message || "রিভিউ লোড করতে ব্যর্থ হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [isOpen, course, sem, subject, token]);

  if (!isOpen) return null;

  const isClass10 = String(course).toUpperCase().includes("10");
  const examName = isClass10
    ? (Number(sem) === 1 ? "Pre-Test Exam (প্রাক-নির্বাচনী)" : "Test Exam (নির্বাচনী পরীক্ষা)")
    : (Number(sem) === 1 ? "Half Yearly Exam (অর্ধ-বার্ষিক)" : "Final Exam (বার্ষিক পরীক্ষা)");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  নম্বর পর্যালোচনা ও সারসংক্ষেপ (Marks Review)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {examName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {course} • বিষয়: {data?.subject?.subjectname || subject} ({data?.subject?.subjectcode || subject})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoToEdit}
              className="px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="এই বিষয়ের নম্বর এন্ট্রি বা এডিট পেজে যান"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">নম্বর এডিট করুন (Edit Marks)</span>
              <span className="sm:hidden">এডিট</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-slate-500">নম্বর বিবরণী ও পরিসংখ্যান প্রস্তুত হচ্ছে...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : data ? (
            <>
              {/* EVALUATOR & APPROVAL STATUS BANNER */}
              <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">খাতা মূল্যায়নকারী শিক্ষক: </span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">
                      {data.evaluator?.name || "অনুমোদিত বিষয়ভিত্তিক শিক্ষক"}
                    </strong>
                    {data.evaluator?.position && (
                      <span className="ml-1 text-slate-500">({data.evaluator.position})</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                    data.isPublished
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : data.isFullyEntered
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}>
                    {data.isPublished ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ফলাফল অনুমোদিত ও প্রকাশিত
                      </>
                    ) : data.isFullyEntered ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        খাতা মূল্যায়ন সম্পন্ন • প্রধান শিক্ষক/অ্যাডমিন অনুমোদনের অপেক্ষায়
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        নম্বর এন্ট্রি চলমান ({data.enteredCount}/{data.totalStudents})
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">মোট শিক্ষার্থী</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-200">{data.totalStudents}</span>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">নম্বর প্রদানকৃত</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{data.enteredCount}</span>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 block">নম্বর বাকি</span>
                  <span className="text-lg font-black text-amber-700 dark:text-amber-300">{data.pendingCount}</span>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">সর্বোচ্চ নম্বর</span>
                  <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">{data.highestMark}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">সর্বনিম্ন নম্বর</span>
                  <span className="text-lg font-black text-slate-700 dark:text-slate-300">{data.lowestMark}</span>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block">শ্রেণি গড় (Average)</span>
                  <span className="text-lg font-black text-purple-700 dark:text-purple-300">{data.averageMark}</span>
                </div>
              </div>

              {/* GRADE DISTRIBUTION */}
              <div className="bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-2">
                  গ্রেড অনুযায়ী শিক্ষার্থীদের অবস্থান (NCTB Grade Matrix)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(data.gradeCounts || {}).map(([grade, count]) => (
                    <div 
                      key={grade} 
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                        grade === "A+" 
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700" 
                          : grade === "F" 
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700" 
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <span className="font-extrabold">{grade}:</span>
                      <span>{count} জন</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STUDENTS MARKS TABLE */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider z-10 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-4 py-2.5">রোল</th>
                        <th className="px-4 py-2.5">শিক্ষার্থীর নাম</th>
                        <th className="px-3 py-2.5 text-center">CQ</th>
                        <th className="px-3 py-2.5 text-center">MCQ</th>
                        <th className="px-3 py-2.5 text-center">ব্যবহারিক</th>
                        <th className="px-3 py-2.5 text-center">মোট নম্বর</th>
                        <th className="px-4 py-2.5 text-center">প্রাপ্ত গ্রেড</th>
                        <th className="px-4 py-2.5 text-right">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data.students.map((st, i) => (
                        <tr 
                          key={st.rollnumber} 
                          className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-950/40"}
                        >
                          <td className="px-4 py-2 font-mono font-bold text-slate-700 dark:text-slate-300">{st.rollnumber}</td>
                          <td className="px-4 py-2 font-semibold text-slate-900 dark:text-white">{st.studentname}</td>
                          <td className="px-3 py-2 text-center font-mono">{st.cq}</td>
                          <td className="px-3 py-2 text-center font-mono">{st.mcq}</td>
                          <td className="px-3 py-2 text-center font-mono">{st.practical}</td>
                          <td className="px-3 py-2 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {st.total}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {st.has_marks ? (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                st.grade === "A+" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                                st.grade === "F" ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" :
                                "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              }`}>
                                {st.grade}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {st.has_marks ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">✓ এন্ট্রি সম্পন্ন</span>
                            ) : (
                              <span className="text-amber-500 font-semibold text-[10px]">অপেক্ষমাণ</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <p className="text-[11px] text-slate-500">
            {data?.isPublished 
              ? "এই ফলাফল ইতিমধ্যে প্রধান শিক্ষক বা অ্যাডমিন কর্তৃক প্রকাশিত।" 
              : "ফলাফল প্রকাশের পূর্বে প্রধান শিক্ষক ও অ্যাডমিন এটি যাচাই করছেন।"}
          </p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleGoToEdit}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>✏️ নম্বর পরিবর্তন / সংশোধন (Edit)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              বন্ধ করুন (Close)
            </button>
            {canApprove && onApprove && (
              <button
                onClick={() => { onClose(); onApprove(); }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                ফলাফল অনুমোদন ও প্রকাশ করুন
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
