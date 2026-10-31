import { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";
import Toast from "../../components/ui/Toast.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import {
    GraduationCap,
    Search,
    Filter,
    Plus,
    Printer,
    Edit3,
    Award,
    Calendar,
    Clock,
    Phone,
    MapPin,
    Users,
    Sparkles,
    CheckCircle2,
    X,
    FileText,
    BookOpen
} from "lucide-react";

export default function ExStudents() {
    const token = localStorage.getItem("token");

    const [alumni, setAlumni] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    // Filters
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTestimonialModal, setShowTestimonialModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        rollnumber: "",
        firstname: "",
        lastname: "",
        courcecode: "CLASS-10-SCI",
        ssc_passing_year: "2025",
        ssc_board_roll: "",
        ssc_reg_no: "",
        ssc_gpa: "",
        fathername: "",
        mothername: "",
        contactnumber: "",
        city: "ডিমলা, নীলফামারী",
        gender: "Female"
    });

    const [saving, setSaving] = useState(false);

    // Fetch Alumni
    const fetchAlumni = async () => {
        try {
            setLoading(true);
            setError("");
            let url = "/api/student/alumni?";
            if (selectedYear) url += `passing_year=${selectedYear}&`;
            if (selectedGroup) url += `course_code=${selectedGroup}&`;
            if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

            const res = await api.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAlumni(res.data?.students || []);
            setAvailableYears(res.data?.availableYears || []);
        } catch (err) {
            console.error("Failed to load alumni:", err);
            setError("প্রাক্তন শিক্ষার্থীদের তথ্য লোড করতে সমস্যা হয়েছে।");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, [selectedYear, selectedGroup, token]);

    // Handle Search with debounce or Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchAlumni();
    };

    // Open Edit Modal
    const handleOpenEdit = (student) => {
        setSelectedStudent(student);
        setFormData({
            rollnumber: student.rollnumber || "",
            firstname: student.firstname || "",
            lastname: student.lastname || "",
            courcecode: student.courcecode || "CLASS-10-SCI",
            ssc_passing_year: student.ssc_passing_year || "2025",
            ssc_board_roll: student.ssc_board_roll || "",
            ssc_reg_no: student.ssc_reg_no || "",
            ssc_gpa: student.ssc_gpa || "",
            fathername: student.fathername || "",
            mothername: student.mothername || "",
            contactnumber: student.contactnumber || "",
            city: student.city || "ডিমলা, নীলফামারী",
            gender: student.gender || "Female"
        });
        setShowEditModal(true);
    };

    // Save Edit
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return;
        try {
            setSaving(true);
            await api.put(`/api/student/alumni/${selectedStudent.sr_no}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ type: "success", message: "এসএসসি ও শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে।" });
            setShowEditModal(false);
            fetchAlumni();
        } catch (err) {
            setToast({ type: "error", message: err.response?.data?.message || "আপডেট ব্যর্থ হয়েছে।" });
        } finally {
            setSaving(false);
        }
    };

    // Save Add New
    const handleSaveAdd = async (e) => {
        e.preventDefault();
        if (!formData.rollnumber || !formData.firstname || !formData.ssc_passing_year) {
            setToast({ type: "error", message: "রোল, নাম এবং পাসের শিক্ষাবর্ষ আবশ্যক।" });
            return;
        }
        try {
            setSaving(true);
            await api.post("/api/student/alumni", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ type: "success", message: "নতুন প্রাক্তন শিক্ষার্থী সফলভাবে সংরক্ষিত হয়েছে।" });
            setShowAddModal(false);
            setFormData({
                rollnumber: "",
                firstname: "",
                lastname: "",
                courcecode: "CLASS-10-SCI",
                ssc_passing_year: "2025",
                ssc_board_roll: "",
                ssc_reg_no: "",
                ssc_gpa: "",
                fathername: "",
                mothername: "",
                contactnumber: "",
                city: "ডিমলা, নীলফামারী",
                gender: "Female"
            });
            fetchAlumni();
        } catch (err) {
            setToast({ type: "error", message: err.response?.data?.message || "সংরক্ষণ ব্যর্থ হয়েছে।" });
        } finally {
            setSaving(false);
        }
    };

    // Open Testimonial (Allowed only after passing SSC)
    const handleOpenTestimonial = (student) => {
        const hasPassed = student.ssc_board_roll && student.ssc_gpa && Number(student.ssc_gpa) >= 1.0;
        if (!hasPassed) {
            setToast({
                type: "warning",
                message: `${student.firstname}-এর এসএসসি পরীক্ষার ফলাফল এখনো এন্ট্রি করা হয়নি। শুধুমাত্র এসএসসি বোর্ড পরীক্ষায় উত্তীর্ণ হওয়ার পরেই প্রশংসাপত্র প্রদান করা যাবে। অনুগ্রহ করে প্রথমে 'সম্পাদনা' বাটনে ক্লিক করে বোর্ড রোল ও জিপিএ এন্ট্রি করুন।`
            });
            return;
        }
        setSelectedStudent(student);
        setShowTestimonialModal(true);
    };

    // Print Handler
    const handlePrintTestimonial = () => {
        window.print();
    };

    // Stats
    const stats = useMemo(() => {
        const total = alumni.length;
        const sci = alumni.filter(s => (s.courcecode || "").includes("SCI")).length;
        const arts = alumni.filter(s => (s.courcecode || "").includes("ARTS")).length;
        const gpa5 = alumni.filter(s => Number(s.ssc_gpa) >= 5.0).length;
        return { total, sci, arts, gpa5 };
    }, [alumni]);

    return (
        <div className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-16">
            <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 w-full print:p-0 print:m-0">
                <AdminPageHeader
                    badge="প্রাক্তন শিক্ষার্থী • এসএসসি অ্যালামনাই আর্কাইভ"
                    badgeIcon={GraduationCap}
                    title="প্রাক্তন শিক্ষার্থী রেকর্ড (Alumni Students)"
                    subtitle="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় হতে বিগত শিক্ষাবর্ষসমূহে এসএসসি উত্তীর্ণদের স্থায়ী ডিজিটাল তথ্যভাণ্ডার।"
                >
                    <button
                        onClick={() => {
                            setFormData({
                                rollnumber: "",
                                firstname: "",
                                lastname: "",
                                courcecode: "CLASS-10-SCI",
                                ssc_passing_year: selectedYear || "2025",
                                ssc_board_roll: "",
                                ssc_reg_no: "",
                                ssc_gpa: "",
                                fathername: "",
                                mothername: "",
                                contactnumber: "",
                                city: "ডিমলা, নীলফামারী",
                                gender: "Female"
                            });
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>প্রাক্তন শিক্ষার্থী যোগ করুন</span>
                    </button>
                </AdminPageHeader>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 print:hidden">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">মোট প্রাক্তন শিক্ষার্থী</div>
                            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.total} জন</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">বিজ্ঞান বিভাগ (Science)</div>
                            <div className="text-xl font-extrabold text-blue-600 font-mono">{stats.sci} জন</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">মানবিক বিভাগ (Humanities)</div>
                            <div className="text-xl font-extrabold text-emerald-600 font-mono">{stats.arts} জন</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">জিপিএ ৫.০০ (GPA 5.00)</div>
                            <div className="text-xl font-extrabold text-rose-600 font-mono">{stats.gpa5} জন</div>
                        </div>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 print:hidden">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
                        
                        {/* Passing Year / Sikkhaborsho */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                পাসের শিক্ষাবর্ষ / এসএসসি ব্যাচ (Passing Year)
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                                >
                                    <option value="">সকল শিক্ষাবর্ষ (All Batches)</option>
                                    <option value="2026">শিক্ষাবর্ষ ২০২৬ (Batch 2026)</option>
                                    <option value="2025">শিক্ষাবর্ষ ২০২৫ (Batch 2025)</option>
                                    <option value="2024">শিক্ষাবর্ষ ২০২৪ (Batch 2024)</option>
                                    <option value="2023">শিক্ষাবর্ষ ২০২৩ (Batch 2023)</option>
                                    {availableYears.filter(y => !["2026", "2025", "2024", "2023"].includes(y)).map(y => (
                                        <option key={y} value={y}>শিক্ষাবর্ষ {y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Group Selection */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                বিভাগ / শাখা (Group / Stream)
                            </label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                            >
                                <option value="">সকল বিভাগ (All Groups)</option>
                                <option value="CLASS-10-SCI">বিজ্ঞান বিভাগ (Science)</option>
                                <option value="CLASS-10-ARTS">মানবিক বিভাগ (Humanities)</option>
                            </select>
                        </div>

                        {/* Search keyword */}
                        <div className="lg:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                নাম / বোর্ড রোল / রেজিঃ নং দিয়ে খুঁজুন
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="শিক্ষার্থীর নাম, শ্রেণি রোল, এসএসসি বোর্ড রোল বা রেজিস্ট্রেশন..."
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                                >
                                    অনুসন্ধান
                                </button>
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearchTerm(""); setTimeout(fetchAlumni, 50); }}
                                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg"
                                    >
                                        রিসেট
                                    </button>
                                )}
                            </div>
                        </div>

                    </form>
                </section>

                {/* ALUMNI TABLE */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden print:hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-amber-500" />
                            <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                                প্রাক্তন শিক্ষার্থীদের তালিকা ({alumni.length} জন শিক্ষার্থী)
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-xs font-medium text-slate-500">প্রাক্তন শিক্ষার্থীদের রেকর্ড লোড হচ্ছে...</p>
                        </div>
                    ) : alumni.length === 0 ? (
                        <div className="py-20 text-center text-slate-400">
                            <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-30 text-amber-500" />
                            <p className="text-sm font-semibold">কোন প্রাক্তন শিক্ষার্থীর রেকর্ড পাওয়া যায়নি</p>
                            <p className="text-xs text-slate-500 mt-1">
                                শ্রেণি ১০ এর শিক্ষার্থীদের পদোন্নতি (Promote) দিলে অথবা উপর থেকে সরাসরি যুক্ত করলে এখানে প্রদর্শিত হবে।
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-4 py-3">শিক্ষার্থী ও রোল</th>
                                        <th className="px-3 py-3">পাসের শিক্ষাবর্ষ</th>
                                        <th className="px-3 py-3">বিভাগ / গ্রুপ</th>
                                        <th className="px-3 py-3 font-mono">বোর্ড রোল ও রেজিঃ</th>
                                        <th className="px-3 py-3 text-center">এসএসসি জিপিএ</th>
                                        <th className="px-3 py-3">যোগাযোগ ও ঠিকানা</th>
                                        <th className="px-4 py-3 text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                                    {alumni.map((s) => {
                                        const isSci = (s.courcecode || "").includes("SCI");
                                        const gpa = Number(s.ssc_gpa) || 0;
                                        return (
                                            <tr key={s.sr_no} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                                
                                                {/* Student Name and School Roll */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-600/30 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-amber-500/20">
                                                            {s.firstname?.[0] || "S"}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                                {s.firstname} {s.lastname}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-semibold text-slate-700 dark:text-slate-300">
                                                                    রোল: {s.rollnumber}
                                                                </span>
                                                                {s.fathername && <span>পিতা: {s.fathername}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Passing Year */}
                                                <td className="px-3 py-3">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                                                        <Calendar className="w-3 h-3" />
                                                        {s.ssc_passing_year || s.academic_year || "২০২৬"}
                                                    </span>
                                                </td>

                                                {/* Group */}
                                                <td className="px-3 py-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                                        isSci 
                                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" 
                                                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    }`}>
                                                        {isSci ? "বিজ্ঞান (Science)" : "মানবিক (Humanities)"}
                                                    </span>
                                                </td>

                                                {/* SSC Board Roll & Reg */}
                                                <td className="px-3 py-3 font-mono">
                                                    {s.ssc_board_roll ? (
                                                        <div>
                                                            <div className="font-bold text-slate-800 dark:text-slate-200">
                                                                রোল: {s.ssc_board_roll}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400">
                                                                রেজিঃ {s.ssc_reg_no || "—"}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px] italic">সংযুক্ত করা হয়নি</span>
                                                    )}
                                                </td>

                                                {/* SSC GPA & Status */}
                                                <td className="px-3 py-3 text-center font-mono">
                                                    {s.ssc_gpa && Number(s.ssc_gpa) >= 1.0 ? (
                                                        <div>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold ${
                                                                gpa >= 5.0
                                                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                                                                    : gpa >= 4.0
                                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                                                    : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                                                            }`}>
                                                                <Award className="w-3 h-3" />
                                                                জিপিএ {s.ssc_gpa}
                                                            </span>
                                                            <span className="block text-[9px] text-emerald-600 font-bold mt-0.5">
                                                                এসএসসি উত্তীর্ণ
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
                                                            <Clock className="w-3 h-3 text-amber-500" /> ফলাফল অপেক্ষমান
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Contact and City */}
                                                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        {s.contactnumber || "—"}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate max-w-[120px]">{s.city || "ডিমলা"}</span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {s.ssc_board_roll && s.ssc_gpa && Number(s.ssc_gpa) >= 1.0 ? (
                                                            <button
                                                                onClick={() => handleOpenTestimonial(s)}
                                                                title="এসএসসি উত্তীর্ণ প্রশংসাপত্র / প্রত্যয়নপত্র প্রিন্ট করুন"
                                                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer shadow-sm"
                                                            >
                                                                <Printer className="w-3.5 h-3.5" />
                                                                <span className="hidden sm:inline">প্রশংসাপত্র</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleOpenTestimonial(s)}
                                                                title="এসএসসি ফলাফল অপ্রকাশিত থাকলে প্রশংসাপত্র ইস্যু হবে না"
                                                                className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                                                            >
                                                                <Clock className="w-3 h-3 text-amber-500" />
                                                                <span className="hidden sm:inline">অপেক্ষমান</span>
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleOpenEdit(s)}
                                                            title="এসএসসি তথ্য সম্পাদনা করুন (বোর্ড রোল ও জিপিএ)"
                                                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
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

            {/* ADD EX-STUDENT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5 text-amber-600">
                                <GraduationCap className="w-5 h-5" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    নতুন প্রাক্তন শিক্ষার্থী যোগ করুন
                                </h3>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        শ্রেণি রোল (School Roll) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.rollnumber}
                                        onChange={(e) => setFormData({ ...formData, rollnumber: e.target.value })}
                                        placeholder="যেমন: ২৫০১"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        এসএসসি পাসের বছর (Batch) *
                                    </label>
                                    <select
                                        value={formData.ssc_passing_year}
                                        onChange={(e) => setFormData({ ...formData, ssc_passing_year: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold"
                                    >
                                        <option value="2026">২০২৬</option>
                                        <option value="2025">২০২৫</option>
                                        <option value="2024">২০২৪</option>
                                        <option value="2023">২০২৩</option>
                                        <option value="2022">২০২২</option>
                                        <option value="2021">২০২১</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        শিক্ষার্থীর নাম (First Name) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        placeholder="প্রথম নাম"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        পদবী / শেষ নাম (Last Name)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        placeholder="শেষ নাম"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    বিভাগ / শাখা (Group)
                                </label>
                                <select
                                    value={formData.courcecode}
                                    onChange={(e) => setFormData({ ...formData, courcecode: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold"
                                >
                                    <option value="CLASS-10-SCI">বিজ্ঞান বিভাগ (Science)</option>
                                    <option value="CLASS-10-ARTS">মানবিক বিভাগ (Humanities)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        বোর্ড রোল (Board Roll)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ssc_board_roll}
                                        onChange={(e) => setFormData({ ...formData, ssc_board_roll: e.target.value })}
                                        placeholder="যেমন: ৪১২৫৮৯"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        রেজিস্ট্রেশন নং (Reg No)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ssc_reg_no}
                                        onChange={(e) => setFormData({ ...formData, ssc_reg_no: e.target.value })}
                                        placeholder="২০১২৮৭৬৫৪৩"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        এসএসসি জিপিএ (GPA)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ssc_gpa}
                                        onChange={(e) => setFormData({ ...formData, ssc_gpa: e.target.value })}
                                        placeholder="৫.০০"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        পিতার নাম (Father's Name)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fathername}
                                        onChange={(e) => setFormData({ ...formData, fathername: e.target.value })}
                                        placeholder="পিতার নাম"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        মাতার নাম (Mother's Name)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.mothername}
                                        onChange={(e) => setFormData({ ...formData, mothername: e.target.value })}
                                        placeholder="মাতার নাম"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        মোবাইল নম্বর
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactnumber}
                                        onChange={(e) => setFormData({ ...formData, contactnumber: e.target.value })}
                                        placeholder="017xxxxxxxx"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        ঠিকানা / শহর
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="ডিমলা, নীলফামারী"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                                >
                                    {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT SSC INFO MODAL */}
            {showEditModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5 text-amber-600">
                                <Edit3 className="w-5 h-5" />
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        এসএসসি তথ্য সম্পাদনা
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        {selectedStudent.firstname} {selectedStudent.lastname} (রোল: {selectedStudent.rollnumber})
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    পাসের শিক্ষাবর্ষ (SSC Passing Year)
                                </label>
                                <input
                                    type="text"
                                    value={formData.ssc_passing_year}
                                    onChange={(e) => setFormData({ ...formData, ssc_passing_year: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        এসএসসি বোর্ড রোল
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ssc_board_roll}
                                        onChange={(e) => setFormData({ ...formData, ssc_board_roll: e.target.value })}
                                        placeholder="যেমন: ৪১২৫৮৯"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        এসএসসি রেজিস্ট্রেশন নং
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ssc_reg_no}
                                        onChange={(e) => setFormData({ ...formData, ssc_reg_no: e.target.value })}
                                        placeholder="২০১২৮৭৬৫৪৩"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    এসএসসি জিপিএ (GPA)
                                </label>
                                <input
                                    type="text"
                                    value={formData.ssc_gpa}
                                    onChange={(e) => setFormData({ ...formData, ssc_gpa: e.target.value })}
                                    placeholder="যেমন: ৫.০০"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    মোবাইল নম্বর
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactnumber}
                                    onChange={(e) => setFormData({ ...formData, contactnumber: e.target.value })}
                                    placeholder="017xxxxxxxx"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm"
                                >
                                    {saving ? "আপডেট হচ্ছে..." : "আপডেট সম্পন্ন করুন"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TESTIMONIAL / প্রশংসাপত্র MODAL */}
            {showTestimonialModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
                    <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-auto print:border-none print:shadow-none print:p-8">
                        
                        {/* Modal Action Bar (Hidden in Print) */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                                <Award className="w-4 h-4" /> প্রত্যয়নপত্র / প্রশংসাপত্র প্রিভিউ
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrintTestimonial}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer transition-all"
                                >
                                    <Printer className="w-4 h-4" /> প্রিন্ট করুন (Print)
                                </button>
                                <button
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Printable Testimonial Document Layout */}
                        <div className="border-4 border-double border-amber-900/30 p-6 sm:p-8 rounded-xl bg-amber-50/20 font-serif relative overflow-hidden">
                            
                            {/* Watermark / Logo background */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
                                <img src="/logo.png" alt="School Seal Watermark" className="w-80 h-80 object-contain" />
                            </div>

                            {/* Header with Official Seal */}
                            <div className="text-center space-y-1 mb-6 border-b-2 border-amber-900/20 pb-4 relative z-10">
                                <div className="flex justify-center mb-2">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 border-2 border-amber-800/40 bg-white shadow-sm flex items-center justify-center">
                                        <img src="/logo.png" alt="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <p className="text-[11px] font-sans font-bold tracking-widest text-slate-600 uppercase">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide font-sans">
                                    ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
                                </h2>
                                <p className="text-xs text-slate-700 font-sans">
                                    ডাকঘর ও উপজেলা: ডিমলা, জেলা: নীলফামারী • স্থাপিত: ১৯৬৭ খ্রিঃ
                                </p>
                                <div className="text-[11px] font-mono text-slate-600 flex justify-center gap-4 pt-1 font-semibold">
                                    <span>EIIN: ১২৪৭৫৪</span>
                                    <span>•</span>
                                    <span>বিদ্যালয় কোড: ৭৫০৫</span>
                                </div>
                            </div>

                            <div className="text-center my-4">
                                <span className="inline-block px-6 py-1.5 border-2 border-slate-800 rounded-full text-sm font-bold tracking-widest uppercase bg-amber-100/60 font-sans">
                                    প্রশংসাপত্র / TESTIMONIAL
                                </span>
                            </div>

                            {/* Body Paragraph */}
                            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 text-justify my-6 font-sans">
                                <p>
                                    এই মর্মে প্রত্যয়ন করা যাইতেছে যে, <span className="font-bold underline decoration-dotted underline-offset-4">{selectedStudent.firstname} {selectedStudent.lastname}</span>, 
                                    পিতা: <span className="font-bold underline decoration-dotted underline-offset-4">{selectedStudent.fathername || "..................................................."}</span>, 
                                    মাতা: <span className="font-bold underline decoration-dotted underline-offset-4">{selectedStudent.mothername || "..................................................."}</span>, 
                                    গ্রাম/শহর: <span className="font-bold underline decoration-dotted underline-offset-4">{selectedStudent.city || "ডিমলা, নীলফামারী"}</span>।
                                </p>
                                <p>
                                    সে এই বিদ্যালয় হইতে মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর-এর অধীনে অনুষ্ঠিত 
                                    <span className="font-bold"> {selectedStudent.ssc_passing_year || "২০২৫"} </span> সনের মাধ্যমিক স্কুল সার্টিফিকেট (এসএসসি) পরীক্ষায় 
                                    <span className="font-bold"> {(selectedStudent.courcecode || "").includes("SCI") ? " বিজ্ঞান " : " মানবিক "} </span> 
                                    শাখা হইতে অংশ গ্রহণ করিয়া জিপিএ (GPA) <span className="font-bold font-mono text-sm underline decoration-dotted underline-offset-4">{selectedStudent.ssc_gpa || "৫.০০"}</span> পাইয়া কৃতিত্বের সহিত উত্তীর্ণ হইয়াছে।
                                    তাহার বোর্ড রোল নম্বর: <span className="font-bold font-mono">{selectedStudent.ssc_board_roll || ".................."}</span> এবং রেজিস্ট্রেশন নম্বর: <span className="font-bold font-mono">{selectedStudent.ssc_reg_no || ".................."}</span>।
                                </p>
                                <p>
                                    বিদ্যালয়ে অধ্যয়নকালে তাহার চরিত্র ও আচরণ সন্তোষজনক এবং নীতিপর ছিল। বিদ্যালয় বা রাষ্ট্রবিরোধী কোনো কাজে তাহার লিপ্ত থাকার প্রমাণ নাই।
                                </p>
                                <p className="pt-2">
                                    আমি তাহার ভবিষ্যৎ জীবনের সর্বাঙ্গীন উন্নতি ও সাফল্য কামনা করি।
                                </p>
                            </div>

                            {/* Signature Footer */}
                            <div className="flex justify-between items-end pt-12 mt-8 text-center text-xs font-sans text-slate-800">
                                <div>
                                    <div className="w-32 border-t border-slate-700 mx-auto mb-1"></div>
                                    <p className="font-bold">শ্রেণি শিক্ষক</p>
                                    <p className="text-[10px] text-slate-500">ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়</p>
                                </div>
                                <div>
                                    <div className="w-20 h-20 border-2 border-dashed border-amber-900/30 rounded-full flex items-center justify-center text-[10px] text-slate-400 mx-auto mb-1">
                                        বিদ্যালয়ের সীল
                                    </div>
                                </div>
                                <div>
                                    <div className="w-36 border-t border-slate-700 mx-auto mb-1"></div>
                                    <p className="font-bold text-sm">প্রধান শিক্ষক</p>
                                    <p className="text-[10px] text-slate-600 font-semibold">ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়</p>
                                    <p className="text-[10px] text-slate-500">ডিমলা, নীলফামারী</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            )}

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
