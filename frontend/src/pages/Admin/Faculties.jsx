import { useEffect, useState } from "react";
import api from "../../utils/api";
import FacultyProfile from "./FacultyProfile";
import ImportFacultyModal from "../../components/modals/ImportFacultyModal.jsx";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal.jsx";
import Toast from "../../components/ui/Toast.jsx";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import {
    Users,
    Search,
    Filter,
    Plus,
    UploadCloud,
    Edit2,
    Trash2,
    AlertCircle,
    ListChecks,
    Briefcase,
    Key
} from "lucide-react";

const getEnglishName = (name) => {
    if (!name) return "";
    const match = name.match(/\(([^)]+)\)/);
    if (match && /[a-zA-Z]/.test(match[1])) return match[1].trim();
    if (/[\u0980-\u09FF]/.test(name) && /[a-zA-Z]/.test(name)) {
        const cleaned = name.replace(/[\u0980-\u09FF]/g, "").replace(/^[()/\-\s]+|[()/\-\s]+$/g, "").trim();
        if (cleaned) return cleaned;
    }
    return name;
};

const Faculties = () => {
    const BASE_URL = api.defaults.baseURL;
    const token = localStorage.getItem("token");

    const [faculties, setFaculties] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");

    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [isNew, setIsNew] = useState(false);

    const [showImportModal, setShowImportModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [toast, setToast] = useState(null);

    /* ================= FETCH FACULTIES ================= */

    const fetchFaculties = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const res = await api.get(
                "/api/faculty",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFaculties(Array.isArray(res.data) ? res.data : []);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load faculties.");
        } finally {
            setLoading(false);
        }
    };

    /* ================= FETCH COURSES ================= */

    const fetchCourses = async () => {
        try {
            const res = await api.get(
                "/api/courses",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCourses(res.data || []);
        } catch {
            setCourses([]);
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchCourses();
    }, []);

    /* ================= DELETE ================= */

    const handleResetPassword = async (faculty) => {
        const confirmReset = window.confirm(`আপনি কি ${faculty.facultyname}-এর পাসওয়ার্ড রিসেট করতে চান? ডিফল্ট পাসওয়ার্ড হবে @DGGHS123@।`);
        if (!confirmReset) return;

        try {
            const res = await api.post(`/api/faculty/${faculty.sr_no}/reset-password`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ type: "success", message: res.data.message || "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।" });
        } catch (err) {
            setToast({ type: "error", message: "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।" });
        }
    };

    const handleDelete = async () => {
        if (!facultyToDelete) return;

        try {
            await api.delete(
                `/api/faculty/${facultyToDelete}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setToast({ type: "success", message: "Faculty deleted successfully." });
            fetchFaculties();
        } catch (err) {
            console.error(err);
            setError("Failed to delete faculty.");
            setToast({ type: "error", message: "Failed to delete faculty." });
        } finally {
            setShowDeleteModal(false);
            setFacultyToDelete(null);
        }
    };

    /* ================= FILTER ================= */

    const filteredFaculties = faculties.filter((faculty) => {
        const q = search.toLowerCase();
        const matchesSearch =
            !search ||
            faculty?.facultyname?.toLowerCase().includes(q) ||
            faculty?.emailid?.toLowerCase().includes(q) ||
            faculty?.contactnumber?.toLowerCase().includes(q) ||
            faculty?.pdsid?.toLowerCase().includes(q) ||
            faculty?.subject?.toLowerCase().includes(q) ||
            faculty?.position?.toLowerCase().includes(q);

        const matchesStatus =
            !statusFilter ||
            String(faculty?.activestatus) === statusFilter;

        const matchesSubject =
            !subjectFilter ||
            (faculty?.subject && faculty.subject.toLowerCase().includes(subjectFilter.toLowerCase()));

        return matchesSearch && matchesStatus && matchesSubject;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-12">
            <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
                <AdminPageHeader
                    badge="শিক্ষকবৃন্দ • শিক্ষক ডিরেক্টরি"
                    badgeIcon={Briefcase}
                    title="সম্মানিত শিক্ষক তালিকা (Teachers Directory)"
                    subtitle="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের শিক্ষক-শিক্ষিকাবৃন্দের পদবি, বিষয় ও যোগাযোগ তথ্য ব্যবস্থাপনা।"
                >
                    <button onClick={() => setShowImportModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer">
                        <UploadCloud className="w-4 h-4 text-emerald-300" />
                        <span>এক্সেল ইমপোর্ট</span>
                    </button>
                    <button onClick={() => { setIsNew(true); setSelectedFaculty({}); }}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>নতুন শিক্ষক যোগ করুন</span>
                    </button>
                </AdminPageHeader>

                {/* ERROR STATE */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* FILTER & SEARCH CARD */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-4 h-4 text-blue-500" />
                        <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Search & Filter</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input type="text" placeholder="শিক্ষকের নাম, মোবাইল, PDS বা বিষয় খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)}
                                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>

                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
                            <option value="">সকল স্ট্যাটাস (All Status)</option>
                            <option value="1">সক্রিয় শিক্ষক (Active)</option>
                            <option value="0">নিষ্ক্রিয় (Inactive)</option>
                        </select>

                        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
                            <option value="">সকল বিষয় (All Subjects)</option>
                            <option value="বাংলা">বাংলা (Bangla)</option>
                            <option value="ইংরেজি">ইংরেজি (English)</option>
                            <option value="গণিত">গণিত (Mathematics)</option>
                            <option value="বিজ্ঞান">বিজ্ঞান (Science)</option>
                            <option value="সামাজিক">সামাজিক বিজ্ঞান (Social Science)</option>
                            <option value="তথ্য ও যোগাযোগ">তথ্য ও যোগাযোগ প্রযুক্তি (ICT)</option>
                            <option value="ধর্ম">ধর্ম ও নৈতিক শিক্ষা (Religion)</option>
                        </select>
                    </div>
                </section>

                {/* FACULTY DIRECTORY TABLE - ZERO HORIZONTAL SCROLL ON MOBILE */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <table className="w-full table-fixed">
                            <thead>
                            <tr>
                                <th className="w-[15%] sm:w-[8%] px-2 sm:px-4 py-3.5 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">DP</th>
                                <th className="w-[55%] sm:w-[25%] px-2 sm:px-4 py-3.5 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">শিক্ষকের নাম ও PDS ID</th>
                                <th className="hidden sm:table-cell sm:w-[18%] px-4 py-3.5 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">পদবি (Designation)</th>
                                <th className="hidden lg:table-cell lg:w-[20%] px-4 py-3.5 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">পাঠদানের বিষয় (Subject)</th>
                                <th className="hidden md:table-cell sm:w-[12%] px-4 py-3.5 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="w-[30%] sm:w-[20%] px-2 sm:px-4 py-3.5 text-right sm:text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                        </table>
                    </div>

                    <div className="w-full">
                        <table className="w-full table-fixed">
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                                        Loading faculty registry...
                                    </td>
                                </tr>
                            ) : filteredFaculties.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800">
                                                <ListChecks className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Records Found</h3>
                                            <p className="text-xs text-slate-500 mt-1">Adjust your search or filter parameters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredFaculties.map((faculty, idx) => (
                                    <tr key={faculty.sr_no} className={`${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-slate-800/20'} hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors`}>
                                        <td className="w-[15%] sm:w-[8%] px-2 sm:px-4 py-3 text-center">
                                            <img
                                                src={faculty.profilepic ? (faculty.profilepic.startsWith("http") ? faculty.profilepic : `${BASE_URL}/uploads/faculties/${faculty.profilepic}`) : `${BASE_URL}/uploads/faculties/default.png`}
                                                alt="profile"
                                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm mx-auto"
                                            />
                                        </td>

                                        <td className="w-[55%] sm:w-[25%] px-2 sm:px-4 py-3">
                                            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                                {getEnglishName(faculty.facultyname)}
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate flex items-center gap-1.5">
                                                {faculty.pdsid ? (
                                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.2 rounded font-bold">
                                                        PDS: {faculty.pdsid}
                                                    </span>
                                                ) : (
                                                    <span>ID: {faculty.facultyid}</span>
                                                )}
                                                {faculty.contactnumber && <span>• 📞 {faculty.contactnumber}</span>}
                                            </div>
                                        </td>

                                        <td className="hidden sm:table-cell sm:w-[15%] px-4 py-3">
                                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                {faculty.position}
                                            </div>
                                        </td>

                                        <td className="hidden lg:table-cell lg:w-[20%] px-4 py-3">
                                            {faculty.subject && faculty.subject !== "NOT ASSIGNED" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg border border-indigo-200/60 dark:border-indigo-800/40 truncate max-w-full" title={faculty.subject}>
                                                    📚 {faculty.subject}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-[9px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded uppercase tracking-wider">
                                                    অনির্ধারিত
                                                </span>
                                            )}
                                        </td>

                                        <td className="hidden md:table-cell sm:w-[12%] px-4 py-3 text-center">
                                            {faculty.activestatus ? (
                                                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">
                                                        Active
                                                    </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded uppercase tracking-wider border border-red-200 dark:border-red-500/20">
                                                        Inactive
                                                    </span>
                                            )}
                                        </td>

                                        <td className="w-[30%] sm:w-[20%] px-2 sm:px-4 py-3 text-right sm:text-center">
                                            <div className="flex items-center justify-end sm:justify-center gap-1 sm:gap-2">
                                                <button onClick={() => handleResetPassword(faculty)}
                                                        className="p-1.5 sm:px-2.5 sm:py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg transition-all flex items-center justify-center cursor-pointer active:scale-95"
                                                        title="পাসওয়ার্ড রিসেট করুন">
                                                    <Key className="w-3.5 h-3.5" />
                                                    <span className="hidden xl:inline text-[11px] font-bold ml-1">Reset Pass</span>
                                                </button>
                                                <button onClick={() => { setIsNew(false); setSelectedFaculty(faculty); }}
                                                        className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-all flex items-center justify-center cursor-pointer active:scale-95"
                                                        title="সম্পাদন করুন">
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="hidden xl:inline text-xs font-bold ml-1">Edit</span>
                                                </button>
                                                <button onClick={() => { setFacultyToDelete(faculty.sr_no); setShowDeleteModal(true); }}
                                                        className="p-1.5 sm:px-3 sm:py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-all flex items-center justify-center cursor-pointer active:scale-95"
                                                        title="Delete Faculty">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="hidden xl:inline text-xs font-bold ml-2">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* MODALS & TOASTS */}
            <ConfirmDeleteModal
                show={showDeleteModal}
                title="Authorization Required"
                message="Are you sure you want to delete this faculty record? This action cannot be reversed."
                loading={loading}
                onCancel={() => { setShowDeleteModal(false); setFacultyToDelete(null); }}
                onConfirm={handleDelete}
            />

            {selectedFaculty !== null && (
                <FacultyProfile
                    faculty={selectedFaculty}
                    isNew={isNew}
                    onClose={() => setSelectedFaculty(null)}
                    onUpdated={() => { fetchFaculties(); setToast({ type: "success", message: "Faculty details saved successfully!" }); }}
                />
            )}

            {showImportModal && (
                <ImportFacultyModal
                    token={token}
                    onClose={() => setShowImportModal(false)}
                    onImportSuccess={() => { fetchFaculties(); setToast({ type: "success", message: "Faculties imported successfully!" }); }}
                />
            )}

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Faculties;