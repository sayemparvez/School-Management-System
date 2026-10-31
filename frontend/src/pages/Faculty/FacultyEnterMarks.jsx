import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import ConfirmSaveModal from "../../components/modals/ConfirmSaveModal";
import MarksReviewModal from "../../components/modals/MarksReviewModal";
import { Eye } from "lucide-react";
import ImportMarksModal from "./ImportMarksModal";
import { 
  ListChecks, 
  Save, 
  RotateCcw, 
  FileUp, 
  BookOpen,
  ClipboardCheck,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function FacultyEnterMarks() {
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Custom Selection (Any class & subject)
  const [entryMode, setEntryMode] = useState("assigned"); // "assigned" | "custom"
  const [allCourses, setAllCourses] = useState([]);
  const [customCourse, setCustomCourse] = useState("");
  const [customSem, setCustomSem] = useState("1");
  const [customSubjects, setCustomSubjects] = useState([]);
  const [customSubject, setCustomSubject] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const qCourse = searchParams.get("course");
    const qSem = searchParams.get("sem");
    const qSubject = searchParams.get("subject");
    if (qCourse) {
      setEntryMode("custom");
      setCustomCourse(qCourse);
      if (qSem) setCustomSem(qSem);
      if (qSubject) setCustomSubject(qSubject);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const [subRes, courseRes] = await Promise.all([
          api.get("/api/faculty/assigned-subjects", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/courses", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAssignedSubjects(subRes.data || []);
        setAllCourses(courseRes.data || []);
        if (courseRes.data && courseRes.data.length > 0) {
          setCustomCourse(courseRes.data[0].course_code);
        }
        // If teacher has no assigned subjects, auto-switch to custom selection
        if (!subRes.data || subRes.data.length === 0) {
          setEntryMode("custom");
        }
      } catch (err) {
        setError("Failed to load assigned subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    if (token) fetchAssignedSubjects();
  }, [token]);

  // Load custom subjects when customCourse or customSem changes
  useEffect(() => {
    if (entryMode !== "custom" || !customCourse || !customSem) return;
    const fetchCustomSubs = async () => {
      try {
        const res = await api.get(`/api/subjects?course_code=${customCourse}&sem=${customSem}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomSubjects(res.data || []);
        const qSub = searchParams.get("subject");
        if (qSub && res.data && res.data.some(s => s.subjectcode === qSub)) {
          setCustomSubject(qSub);
        } else if (res.data && res.data.length > 0) {
          setCustomSubject(res.data[0].subjectcode);
        } else {
          setCustomSubject("");
        }
      } catch (err) {
        console.error("Custom subjects error:", err);
      }
    };
    fetchCustomSubs();
  }, [entryMode, customCourse, customSem, token]);

  const isClass10Custom = useMemo(() => String(customCourse).toUpperCase().includes("10"), [customCourse]);

  const selectedSubjectObj = useMemo(() => {
    if (entryMode === "assigned") {
      return assignedSubjects.find(
        (item) => String(item.subjectcode) === String(selectedSubject)
      );
    } else {
      return customSubjects.find(
        (item) => String(item.subjectcode) === String(customSubject)
      );
    }
  }, [entryMode, assignedSubjects, selectedSubject, customSubjects, customSubject]);

  const selectedCourse = entryMode === "assigned" ? (selectedSubjectObj?.courcecode || "") : customCourse;
  const selectedSem = entryMode === "assigned" ? (selectedSubjectObj?.semoryear || "") : customSem;
  const activeSubjectCode = entryMode === "assigned" ? selectedSubject : customSubject;

  useEffect(() => {
    if (!selectedCourse || !selectedSem || !activeSubjectCode) {
      setStudents([]);
      setMarks({});
      return;
    }
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        setError("");
        const res = await api.get(
          `/api/marks/students?course=${selectedCourse}&sem=${selectedSem}&subject=${activeSubjectCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data || []);
        const initialMarks = {};
        (res.data || []).forEach((student) => {
          initialMarks[student.rollnumber] = {
            cq: student.cq_marks !== null && student.cq_marks !== undefined ? String(student.cq_marks) : "",
            mcq: student.mcq_marks !== null && student.mcq_marks !== undefined ? String(student.mcq_marks) : "",
            practical: student.practicalmarks !== null && student.practicalmarks !== undefined ? String(student.practicalmarks) : "",
            theory: student.theorymarks !== null && student.theorymarks !== undefined ? String(student.theorymarks) : ""
          };
        });
        setMarks(initialMarks);
      } catch (err) {
        setError("Failed to load students.");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse, selectedSem, token]);

  const handleMarkChange = (rollnumber, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [rollnumber]: { ...prev[rollnumber], [field]: value },
    }));
  };

  const handleReset = () => {
    setSelectedSubject("");
    setStudents([]);
    setMarks({});
    setError("");
  };

  const hasCQ = Number(selectedSubjectObj?.cq_max_marks || 0) > 0;
  const hasMCQ = Number(selectedSubjectObj?.mcq_max_marks || 0) > 0;
  const hasPractical = Number(selectedSubjectObj?.practicalmarks || 0) > 0;
  const hasLegacyTheory = !hasCQ && !hasMCQ && Number(selectedSubjectObj?.theorymarks || 0) > 0;

  const [savingMarks, setSavingMarks] = useState(false);

  const saveMarks = async () => {
    try {
      setSavingMarks(true);
      setError("");
      setSuccess("");

      const records = students.map(student => {
        const m = marks[student.rollnumber] || {};
        const hasCq = m.cq !== "" && m.cq !== null && m.cq !== undefined;
        const hasMcq = m.mcq !== "" && m.mcq !== null && m.mcq !== undefined;
        const hasPrac = m.practical !== "" && m.practical !== null && m.practical !== undefined;
        const hasTh = m.theory !== "" && m.theory !== null && m.theory !== undefined;

        // Skip completely empty students so untouched records aren't saved with 0
        if (!hasCq && !hasMcq && !hasPrac && !hasTh) {
          return null;
        }

        const cq = hasCq ? Number(m.cq) : 0;
        const mcq = hasMcq ? Number(m.mcq) : 0;
        const practical = hasPractical ? (hasPrac ? Number(m.practical) : 0) : 0;
        const theory = hasLegacyTheory ? (hasTh ? Number(m.theory) : 0) : (cq + mcq);
        return {
          rollnumber: student.rollnumber,
          cq_marks: cq,
          mcq_marks: mcq,
          theorymarks: theory,
          practicalmarks: practical
        };
      }).filter(Boolean);

      if (records.length === 0) {
        setError("অনুগ্রহ করে অন্তত একজন শিক্ষার্থীর নম্বর প্রবেশ করুন।");
        setShowSaveModal(false);
        return;
      }

      await api.post("/api/marks/save", {
        course: selectedCourse,
        sem: Number(selectedSem),
        subject: activeSubjectCode,
        subjectname: selectedSubjectObj?.subjectname,
        marks: records
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess(`${records.length} জন শিক্ষার্থীর নম্বর সফলভাবে সংরক্ষিত হয়েছে! বাকি শিক্ষার্থীদের নম্বর আপনি যেকোনো সময় পুনরায় প্রবেশ করতে পারবেন।`);
      setError("");
      setShowSaveModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save marks. Please try again.");
      setShowSaveModal(false);
    } finally {
      setSavingMarks(false);
    }
  };

  const isReady = activeSubjectCode && selectedCourse && selectedSem;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* HEADER - Changed from 'sticky top-0' to 'relative' so it scrolls away */}
      <header className="relative z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-500/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight text-slate-900 dark:text-white">Log Marks</h1>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block">Faculty Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewModal(true)}
              disabled={!isReady}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-md transition-all disabled:opacity-30 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" /> <span>নম্বর রিভিউ (Review)</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <button 
              onClick={() => setShowImportModal(true)}
              disabled={!isReady}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors disabled:opacity-30"
            >
              <FileUp className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Import Data</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reset Form</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Added extra bottom padding (pb-32) to account for the fixed footer */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 pb-32">
        
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm font-semibold animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p>{success}</p>
          </div>
        )}

        {/* DROPDOWN CARD WITH MODE SWITCH */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 transition-colors">
          
          {/* Mode Switch Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                বিষয় ও খাতা মূল্যায়ন নির্বাচন (Subject & Evaluation Selection)
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                আপনার দায়িত্বপ্রাপ্ত খাতা অথবা বিদ্যালয়ের যেকোনো শ্রেণির বিষয়ের খাতার নম্বর এন্ট্রি করতে পারেন
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setEntryMode("assigned")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  entryMode === "assigned"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                দায়িত্বপ্রাপ্ত খাতা ({assignedSubjects.length})
              </button>
              <button
                type="button"
                onClick={() => setEntryMode("custom")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  entryMode === "custom"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                অন্যান্য শ্রেণির বিষয়
              </button>
            </div>
          </div>

          {entryMode === "assigned" ? (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 ml-1">
                আমার দায়িত্বপ্রাপ্ত বিষয় ও শ্রেণি (Assigned Subject)
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-semibold"
              >
                <option value="">{loadingSubjects ? "লোড হচ্ছে..." : "বিষয় নির্বাচন করুন..."}</option>
                {assignedSubjects.map((sub, index) => (
                  <option key={index} value={sub.subjectcode}>
                    {sub.courcecode} • {sub.subjectname} ({sub.subjectcode})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  শ্রেণি (Class)
                </label>
                <select
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {allCourses.map((c) => (
                    <option key={c.course_code} value={c.course_code}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  পরীক্ষা (Exam Term)
                </label>
                <select
                  value={customSem}
                  onChange={(e) => setCustomSem(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {isClass10Custom ? (
                    <>
                      <option value="1">Pre-Test Exam (প্রাক-নির্বাচনী)</option>
                      <option value="2">Test Exam (নির্বাচনী পরীক্ষা)</option>
                    </>
                  ) : (
                    <>
                      <option value="1">Half Yearly Exam (অর্ধ-বার্ষিক)</option>
                      <option value="2">Final Exam (বার্ষিক পরীক্ষা)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  বিষয় (Subject)
                </label>
                <select
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {customSubjects.map((sub) => (
                    <option key={sub.subjectcode} value={sub.subjectcode}>
                      {sub.subjectname} ({sub.subjectcode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* DETAILS INFO SECTION */}
          {selectedSubjectObj && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Class</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase">{selectedCourse}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Exam</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  {String(selectedCourse).toUpperCase().includes("10")
                    ? (Number(selectedSem) === 1 ? "Pre-Test" : "Test")
                    : (Number(selectedSem) === 1 ? "Half Yearly" : "Final")}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500 tracking-wider">
                  {hasCQ ? `Max CQ` : "Max Theory"}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  {hasCQ ? (selectedSubjectObj?.cq_max_marks ?? 0) : (selectedSubjectObj?.theorymarks ?? 100)}
                  {hasMCQ && ` + ${selectedSubjectObj?.mcq_max_marks ?? 0} MCQ`}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500 tracking-wider">Max Practical</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{selectedSubjectObj?.practicalmarks ?? 0}</p>
              </div>
            </div>
          )}
        </section>

        {/* TABLE SECTION */}
        {isReady && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 transition-colors">
              <h2 className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-500" /> Student Profile
              </h2>
              <div className="flex gap-6 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest pr-10">
                {hasCQ && <span>CQ/{Number(selectedSubjectObj?.cq_max_marks)}</span>}
                {hasMCQ && <span>MCQ/{Number(selectedSubjectObj?.mcq_max_marks)}</span>}
                {hasLegacyTheory && <span>Theory</span>}
                {hasPractical && <span>Practical</span>}
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {students.map((student) => (
                <div key={student.rollnumber} className="px-6 py-4 flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">{student.rollnumber}</span>
                      {(marks[student.rollnumber]?.cq !== "" || marks[student.rollnumber]?.mcq !== "" || marks[student.rollnumber]?.theory !== "" || marks[student.rollnumber]?.practical !== "") ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">✓ সংরক্ষিত (Saved)</span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.2 rounded-full">বাকি (Pending)</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{student.firstname} {student.lastname}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    {hasCQ && (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">CQ</span>
                        <input
                          type="number" min="0" max={selectedSubjectObj?.cq_max_marks}
                          value={marks[student.rollnumber]?.cq ?? ""}
                          onChange={(e) => handleMarkChange(student.rollnumber, "cq", e.target.value)}
                          className="w-16 px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-center font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    )}
                    {hasMCQ && (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">MCQ</span>
                        <input
                          type="number" min="0" max={selectedSubjectObj?.mcq_max_marks}
                          value={marks[student.rollnumber]?.mcq ?? ""}
                          onChange={(e) => handleMarkChange(student.rollnumber, "mcq", e.target.value)}
                          className="w-16 px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-center font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    )}
                    {hasLegacyTheory && (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Theory</span>
                        <input
                          type="number" min="0" max={selectedSubjectObj?.theorymarks}
                          value={marks[student.rollnumber]?.theory ?? ""}
                          onChange={(e) => handleMarkChange(student.rollnumber, "theory", e.target.value)}
                          className="w-16 px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-center font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    )}
                    {hasPractical && (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Practical</span>
                        <input
                          type="number" min="0" max={selectedSubjectObj?.practicalmarks}
                          value={marks[student.rollnumber]?.practical ?? ""}
                          onChange={(e) => handleMarkChange(student.rollnumber, "practical", e.target.value)}
                          className="w-16 px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-center font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER BAR - Stays fixed to the bottom */}
      {isReady && students.length > 0 && (
        <div className="fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Active logging for {students.length} students
            </div>
            <button 
              onClick={() => setShowSaveModal(true)}
              className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" /> Save Marks
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <ConfirmSaveModal show={showSaveModal} onCancel={() => setShowSaveModal(false)} onConfirm={saveMarks} loading={savingMarks} />
      {showImportModal && (
        <ImportMarksModal 
          token={token} 
          course={selectedCourse} 
          sem={selectedSem} 
          subject={activeSubjectCode} 
          onClose={() => setShowImportModal(false)} 
        />
      )}
      <MarksReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        course={selectedCourse}
        sem={selectedSem}
        subject={activeSubjectCode}
      />
    </div>
  );
}