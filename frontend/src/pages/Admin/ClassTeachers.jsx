import { useEffect, useState } from "react";
import api from "../../utils/api";
import Toast from "../../components/ui/Toast.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import {
  UserCheck,
  ShieldCheck,
  Users,
  Award,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  RotateCcw,
  BookOpen
} from "lucide-react";

export default function ClassTeachers() {
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [academicYear, setAcademicYear] = useState("2026");
  const [loading, setLoading] = useState(false);
  const [savingMap, setSavingMap] = useState({});
  const [selectedTeachers, setSelectedTeachers] = useState({});
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [isHeadOrAdmin, setIsHeadOrAdmin] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ctRes, facRes] = await Promise.all([
        api.get(`/api/fees/class-teachers?academic_year=${academicYear}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get("/api/faculty", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setClasses(ctRes.data.classes || []);
      setIsHeadOrAdmin(ctRes.data.isHeadOrAdmin);
      setFaculties(facRes.data || []);

      const initialMap = {};
      (ctRes.data.classes || []).forEach(c => {
        initialMap[c.course_code] = c.class_teacher ? String(c.class_teacher.faculty_id) : "";
      });
      setSelectedTeachers(initialMap);

    } catch (err) {
      console.error("Fetch class teachers error:", err);
      setError("তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token, academicYear]);

  const handleTeacherChange = (courseCode, facultyId) => {
    setSelectedTeachers(prev => ({
      ...prev,
      [courseCode]: facultyId
    }));
  };

  const handleSave = async (courseCode) => {
    const facultyId = selectedTeachers[courseCode];
    try {
      setSavingMap(prev => ({ ...prev, [courseCode]: true }));
      const res = await api.post("/api/fees/class-teachers/assign", {
        course_code: courseCode,
        academic_year: academicYear,
        faculty_id: facultyId ? Number(facultyId) : null
      }, { headers: { Authorization: `Bearer ${token}` } });

      setToast({ type: "success", message: res.data.message || "শ্রেণি শিক্ষক সফলভাবে নিয়োগ দেওয়া হয়েছে!" });
      fetchData();
    } catch (err) {
      console.error("Save class teacher error:", err);
      setToast({ type: "error", message: err.response?.data?.message || "নিয়োগ সংরক্ষণ ব্যর্থ হয়েছে।" });
    } finally {
      setSavingMap(prev => ({ ...prev, [courseCode]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminPageHeader
          badge={`শ্রেণি প্রশাসন • শিক্ষাবর্ষ ${academicYear}`}
          badgeIcon={UserCheck}
          title="শ্রেণি শিক্ষক নির্ধারণ (Class Teachers)"
          subtitle="প্রতিটি শ্রেণির সার্বিক তত্ত্বাবধান, নিয়মিত হাজিরা ও শৃঙ্খলার জন্য দায়িত্বপ্রাপ্ত শ্রেণি শিক্ষক বণ্টন ও অনুমোদন করুন।"
        >
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
            <span>রিফ্রেশ</span>
          </button>
        </AdminPageHeader>

        {/* GUIDANCE & POLICY BANNER */}
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-indigo-900 dark:text-indigo-300">
          <Award className="w-5 h-5 mt-0.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm">বিদ্যালয়ের শ্রেণি শিক্ষক দায়িত্ব ও নীতিমালা:</h3>
            <p>
              ১. প্রতি শিক্ষাবর্ষের শুরুতে <strong>প্রধান শিক্ষক মহোদয় অথবা অ্যাডমিন</strong> প্রতিটি শ্রেণির জন্য একজন শিক্ষককে শ্রেণি শিক্ষক (Class Teacher) হিসেবে নিয়োগ দেবেন।
            </p>
            <p>
              ২. নির্ধারিত শ্রেণি শিক্ষক উক্ত শ্রেণির প্রতিদিন ১ম পিরিয়ডে উপস্থিত থেকে ক্লাস ও দৈনিক হাজিরা গ্রহণ করবেন এবং সংশ্লিষ্ট শ্রেণির শিক্ষার্থীদের ফি আদায় পরিচালনা করবেন।
            </p>
            <p>
              ৩. জরুরি বা বিশেষ কারণে শ্রেণি শিক্ষক অনুপস্থিত থাকলে অন্য যে কোনো শিক্ষক উক্ত শ্রেণির ১ম পিরিয়ডে বদলি (Proxy) হিসেবে ক্লাস ও হাজিরা পরিচালনা করতে পারবেন।
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* CLASS TEACHER DIRECTORY TABLE */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                শ্রেণিভিত্তিক শ্রেণি শিক্ষক তালিকা ({classes.length}টি শ্রেণি)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রতিটি শ্রেণির জন্য ড্রপডাউন থেকে দায়িত্বপ্রাপ্ত শিক্ষক নির্বাচন করে সংরক্ষণ করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
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
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {classes.map((cls) => {
              const currentCt = cls.class_teacher;
              const selectedFacultyId = selectedTeachers[cls.course_code] ?? "";
              const isDirty = selectedFacultyId !== (currentCt ? String(currentCt.faculty_id) : "");
              const isSaving = savingMap[cls.course_code];

              return (
                <div
                  key={cls.course_code}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Class Info */}
                  <div className="flex items-start gap-3.5 min-w-[240px]">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cls.course_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {cls.course_code}
                        </span>
                        {currentCt ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> শ্রেণি শিক্ষক নিযুক্ত
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            নিয়োগ বাকি
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointed Teacher Current Info */}
                  <div className="flex-1 max-w-sm text-xs space-y-1">
                    {currentCt ? (
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {currentCt.name}
                        </div>
                        <div className="text-slate-500 flex items-center gap-2 text-[11px] mt-0.5">
                          <span>{currentCt.position || "সহকারী শিক্ষক"}</span>
                          {currentCt.phone && (
                            <span className="flex items-center gap-1">
                              • <Phone className="w-3 h-3" /> {currentCt.phone}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          নিয়োগকারী: {currentCt.assigned_by || "অ্যাডমিন"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">কোনো শ্রেণি শিক্ষক নিয়োগ দেওয়া হয়নি</span>
                    )}
                  </div>

                  {/* Appointment Selector & Action */}
                  <div className="flex items-center gap-2.5">
                    <select
                      value={selectedFacultyId}
                      onChange={(e) => handleTeacherChange(cls.course_code, e.target.value)}
                      disabled={!isHeadOrAdmin}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 min-w-[200px]"
                    >
                      <option value="">-- শ্রেণি শিক্ষক নির্বাচন করুন --</option>
                      {faculties.map((f) => (
                        <option key={f.sr_no} value={f.sr_no}>
                          {f.facultyname} ({f.position || "শিক্ষক"})
                        </option>
                      ))}
                    </select>

                    {isHeadOrAdmin && (
                      <button
                        onClick={() => handleSave(cls.course_code)}
                        disabled={isSaving || !isDirty}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          isDirty
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isSaving ? "সংরক্ষণ..." : "সংরক্ষণ"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
