import { useEffect, useState } from "react";
import api from "../../utils/api";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal.jsx";
import Toast from "../../components/ui/Toast.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import {
    GraduationCap,
    PlusCircle,
    Edit2,
    Trash2,
    X,
    CheckCircle2,
    AlertCircle,
    Calendar,
    BookOpen
} from "lucide-react";

const Courses = () => {
    const token = localStorage.getItem("token");

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        course_code: "",
        course_name: "",
        academic_year: "2026",
        total_semesters: "2",
        sem_or_year: "sem"
    });

    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const [toast, setToast] = useState(null);

    /* ================= DATA ENGINE ================= */
    const fetchCourses = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await api.get("/api/courses", { headers: { Authorization: `Bearer ${token}` } });
            setCourses(res.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load classes from the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(form.total_semesters) <= 0) {
            setError("Total exams/terms must be greater than 0.");
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                await api.put(`/api/courses/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
                setToast({ type: "success", message: "শ্রেণি সফলভাবে আপডেট হয়েছে!" });
            } else {
                await api.post("/api/courses", form, { headers: { Authorization: `Bearer ${token}` } });
                setToast({ type: "success", message: "নতুন শ্রেণি সফলভাবে যুক্ত হয়েছে!" });
            }

            setForm({ course_code: "", course_name: "", academic_year: "2026", total_semesters: "2", sem_or_year: "sem" });
            setEditingId(null);
            setError("");
            fetchCourses();
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "অপারেশন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।";
            setError(errorMessage);
            setToast({ type: "error", message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setForm({
            course_code: course.course_code,
            course_name: course.course_name,
            academic_year: course.academic_year || "2026",
            total_semesters: course.total_semesters || "2",
            sem_or_year: "sem"
        });
        setEditingId(course.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async () => {
        if (!courseToDelete) return;
        try {
            setLoading(true);
            await api.delete(`/api/courses/${courseToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
            setToast({ type: "success", message: "শ্রেণি সফলভাবে মুছে ফেলা হয়েছে।" });
            fetchCourses();
            setError("");
        } catch (err) {
            console.error(err);
            setError("এই শ্রেণির সাথে অন্যান্য রেকর্ড যুক্ত থাকায় মুছে ফেলা যাচ্ছে না।");
            setToast({ type: "error", message: "শ্রেণি মুছতে ব্যর্থ হয়েছে।" });
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setCourseToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-12">
            <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
                <AdminPageHeader
                    badge="একাডেমিক ব্যবস্থাপনা • শ্রেণি ও শিক্ষাবর্ষ"
                    badgeIcon={GraduationCap}
                    title="শ্রেণি ও শিক্ষাবর্ষ ব্যবস্থাপনা (Classes)"
                    subtitle="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ৬ষ্ঠ হতে ১০ম শ্রেণির শিক্ষাবর্ষ, শাখা ও সেশন পরিচালনা করুন।"
                />

                {/* ERROR STATE */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* FORM CARD */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 transition-all relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        {editingId ? <Edit2 className="w-4 h-4 text-blue-500" /> : <PlusCircle className="w-4 h-4 text-blue-500" />}
                        <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                            {editingId ? "শ্রেণি সম্পাদন (Edit Class)" : "নতুন শ্রেণি যুক্ত করুন (Add New Class)"}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Class Code */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                শ্রেণি কোড (Class Code)
                            </label>
                            <InputField 
                                name="course_code" 
                                value={form.course_code} 
                                onChange={handleChange} 
                                placeholder="যেমন: CLASS-9-SCI, CLASS-6" 
                            />
                        </div>

                        {/* Class Name */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                শ্রেণির নাম (Class Name)
                            </label>
                            <InputField 
                                name="course_name" 
                                value={form.course_name} 
                                onChange={handleChange} 
                                placeholder="যেমন: ৯ম শ্রেণি - বিজ্ঞান" 
                            />
                        </div>

                        {/* Academic Year (Replaces Semester/Year) */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                শিক্ষাবর্ষ (Academic Year)
                            </label>
                            <div className="relative">
                                <select 
                                    name="academic_year" 
                                    value={form.academic_year} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="2026">শিক্ষাবর্ষ ২০২৬ (2026)</option>
                                    <option value="2025">শিক্ষাবর্ষ ২০২৫ (2025)</option>
                                    <option value="2027">শিক্ষাবর্ষ ২০২৭ (2027)</option>
                                    <option value="2028">শিক্ষাবর্ষ ২০২৮ (2028)</option>
                                </select>
                            </div>
                        </div>

                        {/* Total Exams/Terms */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                পরীক্ষার সংখ্যা (Total Exams)
                            </label>
                            <InputField 
                                type="number" 
                                name="total_semesters" 
                                value={form.total_semesters} 
                                onChange={handleChange} 
                                placeholder="২টি পরীক্ষা (অর্ধ-বার্ষিক ও বার্ষিক)" 
                                min="1" 
                            />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="md:col-span-4 flex flex-col sm:flex-row sm:justify-end gap-3 mt-2 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setForm({ course_code: "", course_name: "", academic_year: "2026", total_semesters: "2", sem_or_year: "sem" }); }}
                                        className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
                                    <X className="w-4 h-4" /> বাতিল (Cancel)
                                </button>
                            )}
                            <button type="submit" disabled={loading}
                                    className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100">
                                {editingId ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                                {editingId ? "শ্রেণি আপডেট করুন" : "শ্রেণি যুক্ত করুন (Add Class)"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* DATA TABLE CARD */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <table className="w-full table-fixed">
                            <thead>
                            <tr>
                                <th className="w-[30%] sm:w-[20%] px-4 sm:px-6 py-3.5 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">শ্রেণি কোড (Code)</th>
                                <th className="w-[45%] sm:w-[35%] px-2 sm:px-4 py-3.5 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">শ্রেণির নাম (Class Name)</th>
                                <th className="hidden sm:table-cell sm:w-[15%] px-4 py-3.5 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">শিক্ষাবর্ষ</th>
                                <th className="hidden sm:table-cell sm:w-[15%] px-4 py-3.5 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">পরীক্ষার সংখ্যা</th>
                                <th className="w-[25%] sm:w-[15%] px-4 sm:px-6 py-3.5 text-right sm:text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                        </table>
                    </div>

                    <div className="w-full">
                        <table className="w-full table-fixed">
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {courses.length > 0 ? courses.map((course, idx) => (
                                <tr key={course.id} className={`${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-slate-800/20'} hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors`}>
                                    <td className="w-[30%] sm:w-[20%] px-4 sm:px-6 py-4">
                                        <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-slate-100 truncate">{course.course_code}</div>
                                    </td>
                                    <td className="w-[45%] sm:w-[35%] px-2 sm:px-4 py-4">
                                        <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title={course.course_name}>{course.course_name}</div>
                                    </td>
                                    <td className="hidden sm:table-cell sm:w-[15%] px-4 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold tracking-wide">
                                            <Calendar className="w-3 h-3" />
                                            {course.academic_year || "2026"}
                                        </span>
                                    </td>
                                    <td className="hidden sm:table-cell sm:w-[15%] px-4 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <BookOpen className="w-3 h-3 text-slate-400" />
                                            {course.total_semesters}টি পরীক্ষা
                                        </span>
                                    </td>
                                    <td className="w-[25%] sm:w-[15%] px-4 sm:px-6 py-3 text-right sm:text-center">
                                        <div className="flex items-center justify-end sm:justify-center gap-1 sm:gap-2">
                                            <button onClick={() => handleEdit(course)}
                                                    className="p-2 sm:px-3 sm:py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center justify-center"
                                                    title="সম্পাদন করুন">
                                                <Edit2 className="w-4 h-4" />
                                                <span className="hidden xl:inline text-xs font-bold ml-1.5">Edit</span>
                                            </button>
                                            <button onClick={() => { setCourseToDelete(course.id); setShowDeleteModal(true); }}
                                                    className="p-2 sm:px-3 sm:py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center"
                                                    title="মুছে ফেলুন">
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden xl:inline text-xs font-bold ml-1.5">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                                        কোনো শ্রেণি পাওয়া যায়নি।
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <ConfirmDeleteModal
                show={showDeleteModal}
                title="শ্রেণি মুছে ফেলার নিশ্চিতকরণ"
                message="আপনি কি নিশ্চিত যে এই শ্রেণিটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।"
                loading={loading}
                onCancel={() => { setShowDeleteModal(false); setCourseToDelete(null); }}
                onConfirm={handleDelete}
            />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </div>
    );
};

/* ================= COMPONENT: INPUT FIELD ================= */
const InputField = ({ type = "text", name, value, onChange, placeholder, min }) => (
    <div className="w-full">
        <input
            type={type} name={name} value={value} onChange={onChange} required min={min} placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
        />
    </div>
);

export default Courses;
