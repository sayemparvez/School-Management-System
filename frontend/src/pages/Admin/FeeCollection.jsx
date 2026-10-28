import { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";
import Toast from "../../components/ui/Toast.jsx";
import MoneyReceiptModal from "../../components/modals/MoneyReceiptModal.jsx";
import {
  Banknote,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Calendar,
  Lock,
  UserCheck,
  Search,
  RotateCcw,
  ShieldCheck,
  Edit2,
  CheckSquare,
  Square,
  DollarSign,
  Layers,
  Sparkles,
  X
} from "lucide-react";

const MONTH_NAMES = [
  "জানুয়ারি (January)",
  "ফেব্রুয়ারি (February)",
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

export default function FeeCollection() {
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [academicYear, setAcademicYear] = useState("2026");
  const [feeType, setFeeType] = useState("monthly_tuition");
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);

  const [feeItem, setFeeItem] = useState(null);
  const [allFeeItems, setAllFeeItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [userPerm, setUserPerm] = useState({ allowed: true, role: "Admin" });
  const [appointedTeacher, setAppointedTeacher] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Multi-selection for Batch Collection
  const [selectedRolls, setSelectedRolls] = useState([]);

  // Single Student Multi-Fee Modal State
  const [singleModalStudent, setSingleModalStudent] = useState(null);
  const [selectedHeads, setSelectedHeads] = useState({});
  const [singleMonth, setSingleMonth] = useState(() => new Date().getMonth() + 1);
  const [payMethod, setPayMethod] = useState("cash");
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [payNotes, setPayNotes] = useState("");
  const [collecting, setCollecting] = useState(false);

  // Batch Collection Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchHeads, setBatchHeads] = useState({});
  const [batchMonth, setBatchMonth] = useState(() => new Date().getMonth() + 1);
  const [batchMethod, setBatchMethod] = useState("cash");
  const [batchDate, setBatchDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [batchNotes, setBatchNotes] = useState("");
  const [batchCollecting, setBatchCollecting] = useState(false);

  // View Receipt State
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Scholarship update state
  const [editingScholarshipRoll, setEditingScholarshipRoll] = useState(null);

  // 1. Fetch courses
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

  // 2. Fetch fee data & students
  const fetchFeeData = async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      setError("");
      const res = await api.get(
        `/api/fees/students?course_code=${selectedCourse}&academic_year=${academicYear}&fee_type=${feeType}&month_number=${selectedMonth}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeeItem(res.data.fee_item);
      setAllFeeItems(res.data.all_fee_items || []);
      setStudents(res.data.students || []);
      setStats(res.data.stats);
      setUserPerm(res.data.user_permission || { allowed: false, role: "none" });
      setAppointedTeacher(res.data.appointed_class_teacher);
      setSelectedRolls([]);
    } catch (err) {
      console.error("Error fetching fee data:", err);
      setError("ফি তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
  }, [selectedCourse, academicYear, feeType, selectedMonth, token]);

  // Handle Select All Checkbox
  const handleSelectAll = () => {
    if (selectedRolls.length === filteredStudents.length) {
      setSelectedRolls([]);
    } else {
      setSelectedRolls(filteredStudents.map(s => s.rollnumber));
    }
  };

  const toggleStudentSelect = (roll) => {
    setSelectedRolls(prev =>
      prev.includes(roll) ? prev.filter(r => r !== roll) : [...prev, roll]
    );
  };

  // Open Single Student Multi-Fee Modal
  const handleOpenSingleModal = (student) => {
    setSingleModalStudent(student);
    // Initialize active heads
    const initialHeads = {};
    allFeeItems.forEach(item => {
      // Default select monthly tuition and exam fee
      initialHeads[item.fee_type] = item.fee_type === "monthly_tuition";
    });
    setSelectedHeads(initialHeads);
    setSingleMonth(selectedMonth);
    setPayMethod("cash");
    setPayDate(new Date().toISOString().split("T")[0]);
    setPayNotes("");
  };

  // Calculate single modal total
  const singleModalTotal = useMemo(() => {
    if (!singleModalStudent) return 0;
    let sum = 0;
    allFeeItems.forEach(item => {
      if (selectedHeads[item.fee_type]) {
        if (item.fee_type === "monthly_tuition" && singleModalStudent.is_scholarship) {
          sum += 0; // Waived
        } else {
          sum += Number(item.amount) || 0;
        }
      }
    });
    return sum;
  }, [singleModalStudent, selectedHeads, allFeeItems]);

  // Submit Single Multi-Fee Collection
  const handleSingleMultiSubmit = async (e) => {
    e.preventDefault();
    if (!singleModalStudent) return;

    const itemsToPay = [];
    allFeeItems.forEach(item => {
      if (selectedHeads[item.fee_type]) {
        const isMonthly = item.fee_type === "monthly_tuition";
        const isWaived = isMonthly && singleModalStudent.is_scholarship;
        itemsToPay.push({
          fee_type: item.fee_type,
          fee_name: item.fee_name,
          month_number: isMonthly ? singleMonth : null,
          month_name: isMonthly ? MONTH_NAMES[singleMonth - 1] : null,
          amount_due: Number(item.amount),
          amount_paid: isWaived ? 0 : Number(item.amount),
          discount_waiver: isWaived ? Number(item.amount) : 0
        });
      }
    });

    if (itemsToPay.length === 0) {
      setToast({ type: "error", message: "অন্তত একটি ফি খাত নির্বাচন করুন।" });
      return;
    }

    try {
      setCollecting(true);
      const res = await api.post(
        "/api/fees/collect-multi",
        {
          student_rollnumber: singleModalStudent.rollnumber,
          course_code: selectedCourse,
          academic_year: academicYear,
          fee_items: itemsToPay,
          payment_method: payMethod,
          payment_date: payDate,
          notes: payNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({ type: "success", message: res.data.message });
      setSingleModalStudent(null);
      await fetchFeeData();

      // Show receipt
      if (res.data.receipt_no) {
        handleViewReceipt(res.data.receipt_no);
      }
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "ফি আদায় সম্পন্ন করা যায়নি।" });
    } finally {
      setCollecting(false);
    }
  };

  // Open Batch Modal
  const handleOpenBatchModal = () => {
    const initialHeads = {};
    allFeeItems.forEach(item => {
      initialHeads[item.fee_type] = item.fee_type === "monthly_tuition";
    });
    setBatchHeads(initialHeads);
    setBatchMonth(selectedMonth);
    setBatchMethod("cash");
    setBatchDate(new Date().toISOString().split("T")[0]);
    setBatchNotes("");
    setShowBatchModal(true);
  };

  // Submit Batch Fee Collection
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (selectedRolls.length === 0) return;

    const itemsToPay = [];
    allFeeItems.forEach(item => {
      if (batchHeads[item.fee_type]) {
        const isMonthly = item.fee_type === "monthly_tuition";
        itemsToPay.push({
          fee_type: item.fee_type,
          fee_name: item.fee_name,
          month_number: isMonthly ? batchMonth : null,
          month_name: isMonthly ? MONTH_NAMES[batchMonth - 1] : null,
          amount: Number(item.amount)
        });
      }
    });

    if (itemsToPay.length === 0) {
      setToast({ type: "error", message: "অন্তত একটি ফি খাত নির্বাচন করুন।" });
      return;
    }

    try {
      setBatchCollecting(true);
      const res = await api.post(
        "/api/fees/collect-batch",
        {
          student_rollnumbers: selectedRolls,
          course_code: selectedCourse,
          academic_year: academicYear,
          fee_items: itemsToPay,
          payment_method: batchMethod,
          payment_date: batchDate,
          notes: batchNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({ type: "success", message: res.data.message });
      setShowBatchModal(false);
      setSelectedRolls([]);
      await fetchFeeData();
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "একসাথে ফি আদায় সম্পন্ন করা যায়নি।" });
    } finally {
      setBatchCollecting(false);
    }
  };

  // View Receipt
  const handleViewReceipt = async (receiptNo) => {
    try {
      const res = await api.get(`/api/fees/receipt/${receiptNo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveReceipt(res.data);
    } catch (err) {
      setToast({ type: "error", message: "রসিদ প্রদর্শন করতে সমস্যা হয়েছে।" });
    }
  };

  // Update Scholarship Status
  const handleUpdateScholarship = async (rollnumber, newType) => {
    try {
      await api.put(
        `/api/fees/students/${rollnumber}/scholarship`,
        { scholarship_type: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingScholarshipRoll(null);
      setToast({ type: "success", message: "বৃত্তির তথ্য সফলভাবে হালনাগাদ করা হয়েছে!" });
      fetchFeeData();
    } catch (err) {
      setToast({ type: "error", message: "বৃত্তির তথ্য পরিবর্তন করা যায়নি।" });
    }
  };

  // Filter students by search
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        String(s.rollnumber).includes(term) ||
        (s.contactnumber && s.contactnumber.includes(term))
    );
  }, [students, searchTerm]);

  return (
    <div className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-24">
      
      {/* PLATFORM HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                ফি কালেকশন ও হিসাব (Class Fee Collection)
              </h1>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block">
                ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় • সকল খাতের সমন্বিত ফি ও রসিদ
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchFeeData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> রিফ্রেশ
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 w-full print:p-0">

        {/* ROLE BASED PERMISSION BANNER */}
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          userPerm.allowed 
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200" 
            : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200"
        }`}>
          <div className="flex items-center gap-2.5">
            {userPerm.allowed ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {userPerm.allowed ? "ফি আদায় অনুমতি অনুমোদিত:" : "ফি আদায় সংরক্ষিত (Restricted):"}
              </span>
              <span>
                {userPerm.allowed
                  ? `আপনার বর্তমান ভূমিকা: ${userPerm.role}। সরকারি বালিকা উচ্চ বিদ্যালয়ের নিয়ম অনুযায়ী আপনি এই শ্রেণির ফি গ্রহণ ও রসিদ প্রদান করতে পারবেন।`
                  : `এই শ্রেণির ফি শুধুমাত্র নির্ধারিত শ্রেণি শিক্ষক, প্রধান শিক্ষক এবং অ্যাডমিন গ্রহণ করতে পারবেন।`}
              </span>
            </div>
          </div>
          {appointedTeacher && (
            <div className="bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-[11px] font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>নির্ধারিত শ্রেণি শিক্ষক: <strong>{appointedTeacher.faculty_name}</strong></span>
            </div>
          )}
        </div>

        {/* ACTIVE FEE STRUCTURE RATES (GOVERNMENT GIRLS' SCHOOL) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                এই শ্রেণির সকল সক্রিয় ফি খাত ও সরকারি রেট (Govt School Rates)
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">
              * প্রধান শিক্ষক ও অ্যাডমিন 'Fee Structure' পেইজ থেকে যেকোনো সময় রেট পরিবর্তন করতে পারেন
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {allFeeItems.map(item => (
              <div key={item.fee_type} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="block text-[10px] text-slate-500 truncate" title={item.fee_name}>
                  {item.fee_name.split("(")[0]}
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                  ৳ {Number(item.amount)}
                </span>
                {item.fee_type === "monthly_tuition" && (
                  <span className="block text-[9px] text-emerald-600 font-bold">উপবৃত্তিতে ৳০</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CONTROLS & FILTER */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            
            {/* Class Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                শ্রেণি (Class)
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.course_code}>{c.course_name} ({c.course_code})</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                শিক্ষাবর্ষ (Academic Year)
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="2026">শিক্ষাবর্ষ ২০২৬ (2026)</option>
                <option value="2025">শিক্ষাবর্ষ ২০২৫ (2025)</option>
                <option value="2027">শিক্ষাবর্ষ ২০২৭ (2027)</option>
              </select>
            </div>

            {/* Monthly Tuition Month */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                মাসিক বেতনের মাস (Month)
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                শিক্ষার্থী খুঁজুন (Search)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="রোল, নাম বা মোবাইল..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

          </div>
        </section>

        {/* STUDENTS TABLE */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                {selectedRolls.length === filteredStudents.length && filteredStudents.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>সবাইকে নির্বাচন করুন ({selectedRolls.length}/{filteredStudents.length})</span>
              </button>
            </div>

            {/* Batch collection button if students selected */}
            {selectedRolls.length > 0 && userPerm.allowed && (
              <button
                onClick={handleOpenBatchModal}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all animate-in zoom-in-95 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>নির্বাচিত {selectedRolls.length} জন শিক্ষার্থীর ফি একসাথে আদায় করুন</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium text-slate-500">শিক্ষার্থীদের তথ্য ও ফি স্ট্যাটাস লোড হচ্ছে...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-500" />
              <p className="text-sm font-semibold">এই শ্রেণিতে কোনো শিক্ষার্থী পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-3 py-3 w-10 text-center">নির্বাচন</th>
                    <th className="px-3 py-3 w-16">রোল</th>
                    <th className="px-4 py-3">শিক্ষার্থীর নাম</th>
                    <th className="px-3 py-3">বৃত্তি ও উপবৃত্তি স্ট্যাটাস</th>
                    <th className="px-3 py-3 text-center">{MONTH_NAMES[selectedMonth - 1].split(" ")[0]} বেতন</th>
                    <th className="px-4 py-3 text-right">ফি গ্রহণ ও রসিদ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredStudents.map((st) => {
                    const isSelected = selectedRolls.includes(st.rollnumber);
                    return (
                      <tr key={st.rollnumber} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${isSelected ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""}`}>
                        
                        {/* Checkbox */}
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStudentSelect(st.rollnumber)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>
                        </td>

                        {/* Roll */}
                        <td className="px-3 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {st.rollnumber}
                        </td>

                        {/* Name & Contact */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {st.name}
                          </div>
                          {st.contactnumber && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {st.contactnumber}
                            </div>
                          )}
                        </td>

                        {/* Scholarship Status */}
                        <td className="px-3 py-3">
                          {editingScholarshipRoll === st.rollnumber ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                defaultValue={st.scholarship_type}
                                onChange={(e) => handleUpdateScholarship(st.rollnumber, e.target.value)}
                                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 rounded text-xs"
                              >
                                <option value="none">সাধারণ (কোনো বৃত্তি নেই)</option>
                                <option value="upobritti">সরকারি উপবৃত্তি (Upobritti)</option>
                                <option value="britti">মেধা বৃত্তি (Britti)</option>
                              </select>
                              <button onClick={() => setEditingScholarshipRoll(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {st.scholarship_type === "britti" ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                  মেধা বৃত্তি (বেতন মওকুফ)
                                </span>
                              ) : st.scholarship_type === "upobritti" ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  সরকারি উপবৃত্তি (বেতন মওকুফ)
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800">
                                  সাধারণ (নিয়মিত বেতন)
                                </span>
                              )}
                              <button
                                onClick={() => setEditingScholarshipRoll(st.rollnumber)}
                                title="বৃত্তির ধরন পরিবর্তন করুন"
                                className="p-1 text-slate-400 hover:text-blue-500 rounded cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Monthly Tuition Status */}
                        <td className="px-3 py-3 text-center">
                          {st.is_waived ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> ৳ ০ (মওকুফ)
                            </span>
                          ) : st.is_paid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> পরিশোধিত
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200">
                              <Clock className="w-3 h-3" /> বকেয়া (৳{st.amount_due})
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {userPerm.allowed && (
                              <button
                                onClick={() => handleOpenSingleModal(st)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                              >
                                <Banknote className="w-3.5 h-3.5" />
                                <span>ফি গ্রহণ করুন</span>
                              </button>
                            )}

                            {st.payment?.receipt_no && (
                              <button
                                onClick={() => handleViewReceipt(st.payment.receipt_no)}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>রসিদ</span>
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* SINGLE STUDENT MULTI-FEE MODAL */}
      {singleModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-emerald-600">
                <Banknote className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    একক সমন্বিত ফি আদায় (Multi-Fee Collection)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {singleModalStudent.name} • রোল: {singleModalStudent.rollnumber}
                  </p>
                </div>
              </div>
              <button onClick={() => setSingleModalStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {singleModalStudent.is_scholarship && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>
                  এই শিক্ষার্থী <strong>{singleModalStudent.scholarship_type === "britti" ? "মেধা বৃত্তিপ্রাপ্ত" : "সরকারি উপবৃত্তিপ্রাপ্ত"}</strong>। সরকারি নিয়মে তার <strong>মাসিক বেতন ৳০ (মওকুফ)</strong> থাকবে। অন্যান্য ফি প্রযোজ্য হবে।
                </span>
              </div>
            )}

            <form onSubmit={handleSingleMultiSubmit} className="space-y-4 text-xs">
              
              {/* Fee Heads Checklist */}
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-2">
                  কোন কোন খাতের ফি আদায় করা হচ্ছে নির্বাচন করুন:
                </label>
                <div className="space-y-2 border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
                  {allFeeItems.map(item => {
                    const isChecked = !!selectedHeads[item.fee_type];
                    const isMonthly = item.fee_type === "monthly_tuition";
                    const isWaived = isMonthly && singleModalStudent.is_scholarship;
                    const displayAmt = isWaived ? 0 : Number(item.amount);

                    return (
                      <div
                        key={item.fee_type}
                        onClick={() => setSelectedHeads(prev => ({ ...prev, [item.fee_type]: !prev[item.fee_type] }))}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-white dark:bg-slate-900 border-emerald-500 shadow-sm" 
                            : "bg-transparent border-slate-200 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              {item.fee_name}
                            </span>
                            {isMonthly && (
                              <span className="text-[10px] text-slate-500">
                                মাস: {MONTH_NAMES[singleMonth - 1]}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100">
                            ৳ {displayAmt}
                          </span>
                          {isWaived && (
                            <span className="block text-[9px] text-emerald-600 font-bold">মওকুফ</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Month selector for tuition if monthly fee is checked */}
              {selectedHeads["monthly_tuition"] && (
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    মাসিক বেতনের মাস নির্বাচন করুন
                  </label>
                  <select
                    value={singleMonth}
                    onChange={(e) => setSingleMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold"
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Total Calculation Display */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">সর্বমোট প্রদেয় টাকা</span>
                  <span className="text-[10px] text-emerald-600">সবগুলো নির্বাচিত খাতের যোগফল</span>
                </div>
                <div className="text-xl font-black font-mono text-emerald-700">
                  ৳ {singleModalTotal}
                </div>
              </div>

              {/* Payment Method & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    পরিশোধের তারিখ
                  </label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    পরিশোধ পদ্ধতি (Method)
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                  >
                    <option value="cash">নগদ (Cash)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="bank">ব্যাংক ড্রাফট (Bank)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  মন্তব্য / বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="যেমন: নিয়মিত ফি পরিশোধ"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSingleModalStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={collecting || singleModalTotal === 0 && !singleModalStudent.is_scholarship}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  {collecting ? "ফি আদায় হচ্ছে..." : "ফি আদায় সম্পন্ন করুন"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* BATCH / MULTIPLE STUDENTS COLLECTION MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-emerald-600">
                <Users className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    একসাথে একাধিক শিক্ষার্থীর ফি গ্রহণ (Batch Collection)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    নির্বাচিত শিক্ষার্থী সংখ্যা: {selectedRolls.length} জন
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchSubmit} className="space-y-4 text-xs">
              
              {/* Selected Rolls Chips */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">নির্বাচিত রোলসমূহ:</span>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {selectedRolls.map(r => (
                    <span key={r} className="px-2 py-0.5 bg-white dark:bg-slate-800 border rounded-md font-mono text-[11px] font-bold">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fee Heads Checklist */}
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-2">
                  কোন কোন ফি খাত আদায় করা হবে নির্বাচন করুন:
                </label>
                <div className="space-y-2 border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
                  {allFeeItems.map(item => {
                    const isChecked = !!batchHeads[item.fee_type];
                    return (
                      <div
                        key={item.fee_type}
                        onClick={() => setBatchHeads(prev => ({ ...prev, [item.fee_type]: !prev[item.fee_type] }))}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-white dark:bg-slate-900 border-emerald-500 shadow-sm" 
                            : "bg-transparent border-slate-200 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {item.fee_name}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ৳ {Number(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Month for tuition if checked */}
              {batchHeads["monthly_tuition"] && (
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    মাসিক বেতনের মাস
                  </label>
                  <select
                    value={batchMonth}
                    onChange={(e) => setBatchMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold"
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    পরিশোধের তারিখ
                  </label>
                  <input
                    type="date"
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    পরিশোধ পদ্ধতি
                  </label>
                  <select
                    value={batchMethod}
                    onChange={(e) => setBatchMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                  >
                    <option value="cash">নগদ (Cash)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="bank">ব্যাংক (Bank)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  মন্তব্য
                </label>
                <input
                  type="text"
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="যেমন: একসাথে ফি আদায়"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={batchCollecting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  {batchCollecting ? "প্রক্রিয়াকরণ হচ্ছে..." : `একসাথে ${selectedRolls.length} জনের ফি গ্রহণ করুন`}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MONEY RECEIPT MODAL */}
      <MoneyReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receipt={activeReceipt}
      />

      {/* TOAST */}
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
