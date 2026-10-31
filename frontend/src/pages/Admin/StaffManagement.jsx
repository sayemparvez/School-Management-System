import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import AdminPageHeader from "../../components/ui/AdminPageHeader";
import Toast from "../../components/ui/Toast";
import { resolveMediaUrl, compressImage, createInstantPreview } from "../../utils/imageOptimizer";
import {
    Briefcase,
    Search,
    Plus,
    Edit2,
    Trash2,
    Phone,
    Mail,
    Award,
    Shield,
    Upload,
    Check,
    X,
    RotateCcw,
    Users,
    Filter,
    ExternalLink
} from "lucide-react";

const defaultStaffList = [
    {
        id: 1,
        name: "মোঃ মোখলেছুর রহমান",
        name_en: "Md. Mokhlesur Rahman",
        designation: "প্রধান অফিস সহকারী",
        designation_en: "Head Office Assistant",
        qualification: "B.A",
        phone: "০১৭৮৯-১২৩৪৫৬",
        email: "office.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        name: "মোঃ হাবিবুর রহমান",
        name_en: "Md. Habibur Rahman",
        designation: "হিসাব সহকারী",
        designation_en: "Accounts Assistant",
        qualification: "B.Com (Accounting)",
        phone: "০১৭৯০-২৩৪৫৬৭",
        email: "accounts.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        name: "মোছাঃ মমতাজ বেগম",
        name_en: "Mst. Momtaz Begum",
        designation: "লাইব্রেরি সহকারী",
        designation_en: "Library Assistant",
        qualification: "Diploma in Library Science",
        phone: "০১৭০১-৩৪৫৬৭৮",
        email: "library.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        name: "মোঃ এনামুল হক",
        name_en: "Md. Enamul Haque",
        designation: "ল্যাব সহকারী (বিজ্ঞান)",
        designation_en: "Lab Assistant (Science)",
        qualification: "H.S.C (Science)",
        phone: "০১৭১২-৪৫৬৭৮৯",
        email: "lab.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        name: "মোঃ আমিনুল ইসলাম",
        name_en: "Md. Aminul Islam",
        designation: "অফিস সহায়ক (MLSS)",
        designation_en: "Office Support Staff",
        qualification: "S.S.C",
        phone: "০১৭২৩-৫৬৭৮৯০",
        email: "support1.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 6,
        name: "মোঃ কাশেম আলী",
        name_en: "Md. Kashem Ali",
        designation: "নিরাপত্তা প্রহরী",
        designation_en: "Security Guard",
        qualification: "Eight Pass",
        phone: "০১৭৩৪-৬৭৮৯০১",
        email: "security.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    }
];

const sampleStaffAvatars = [
    { label: "স্টাফ ১", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ২", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৩", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৪", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৫", url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৬", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
];

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [designationFilter, setDesignationFilter] = useState("all");
    const [toast, setToast] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIdx, setEditingIdx] = useState(null);
    const [form, setForm] = useState({
        name: "",
        name_en: "",
        designation: "অফিস সহকারী",
        qualification: "H.S.C",
        phone: "",
        email: "",
        image: sampleStaffAvatars[0].url
    });

    // Fetch staff from website_cms
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/public/cms");
            const cmsData = res.data?.data || {};
            if (cmsData.staff && Array.isArray(cmsData.staff) && cmsData.staff.length > 0) {
                setStaffList(cmsData.staff);
            } else {
                setStaffList(defaultStaffList);
            }
        } catch (err) {
            console.error("Failed to load staff", err);
            setStaffList(defaultStaffList);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // Save staff list to database
    const saveStaffList = async (updatedList) => {
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/admin/cms/update", {
                section: "staff",
                data: updatedList
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ type: "success", message: "কর্মকর্তা ও কর্মচারীদের তালিকা সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!" });
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: "তথ্য সংরক্ষণে ত্রুটি দেখা দিয়েছে।" });
        }
    };

    const handleOpenAdd = () => {
        setEditingIdx(null);
        setForm({
            name: "",
            name_en: "",
            designation: "অফিস সহকারী",
            qualification: "H.S.C",
            phone: "",
            email: "",
            image: sampleStaffAvatars[Math.floor(Math.random() * sampleStaffAvatars.length)].url
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (idx) => {
        setEditingIdx(idx);
        const item = staffList[idx] || {};
        setForm({
            name: item.name || "",
            name_en: item.name_en || "",
            designation: item.designation || "অফিস সহকারী",
            qualification: item.qualification || "",
            phone: item.phone || "",
            email: item.email || "",
            image: item.image || item.image_url || sampleStaffAvatars[0].url
        });
        setModalOpen(true);
    };

    const handleSaveModal = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setToast({ type: "error", message: "কর্মকর্তা/কর্মচারীর নাম অবশ্যই পূরণ করুন!" });
            return;
        }

        let updated = [...staffList];
        if (editingIdx !== null) {
            updated[editingIdx] = {
                ...updated[editingIdx],
                ...form
            };
        } else {
            updated.push({
                id: Date.now(),
                ...form
            });
        }

        setStaffList(updated);
        setModalOpen(false);
        await saveStaffList(updated);
    };

    const handleDelete = async (idx) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই কর্মীর রেকর্ড মুছে ফেলতে চান?")) return;
        const updated = staffList.filter((_, i) => i !== idx);
        setStaffList(updated);
        await saveStaffList(updated);
    };

    const handleResetDefault = async () => {
        if (!window.confirm("ডিফল্ট স্টাফ তালিকা পুনরুদ্ধার করতে চান?")) return;
        setStaffList(defaultStaffList);
        await saveStaffList(defaultStaffList);
    };

    // Filtered staff
    const filteredStaff = staffList.filter((st) => {
        const matchesSearch =
            (st.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (st.designation || "").toLowerCase().includes(search.toLowerCase()) ||
            (st.qualification || "").toLowerCase().includes(search.toLowerCase()) ||
            (st.phone || "").includes(search);

        const matchesDesignation =
            designationFilter === "all" || (st.designation || "") === designationFilter;

        return matchesSearch && matchesDesignation;
    });

    const uniqueDesignations = Array.from(new Set(staffList.map((s) => s.designation).filter(Boolean)));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <AdminPageHeader
                    badge="প্রশাসনিক জনবল • বিদ্যালয় ব্যবস্থাপনা"
                    badgeIcon={Briefcase}
                    title="কর্মকর্তা ও কর্মচারী ব্যবস্থাপনা (Staff Management)"
                    subtitle="বিদ্যালয়ের প্রধান অফিস সহকারী, হিসাব সহকারী, লাইব্রেরিয়ান, ল্যাব সহকারী ও অন্যান্য কর্মকর্তা-কর্মচারীদের তথ্য পরিচালনা করুন।"
                >
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>নতুন কর্মকর্তা/কর্মচারী যোগ করুন</span>
                        </button>

                        <button
                            onClick={handleResetDefault}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer"
                            title="প্রাথমিক অফিসিয়াল তালিকা পুনরুদ্ধার"
                        >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                            <span className="hidden sm:inline">রিসেট তালিকা</span>
                        </button>
                    </div>
                </AdminPageHeader>

                {/* KPI METRIC CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">মোট স্টাফ ও কর্মকর্তা</span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {staffList.length} <span className="text-xs font-normal text-slate-400">জন</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">প্রশাসনিক ও অফিস</span>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {staffList.filter((s) => (s.designation || "").includes("অফিস") || (s.designation || "").includes("হিসাব")).length}{" "}
                            <span className="text-xs font-normal text-slate-400">জন</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">ল্যাব ও লাইব্রেরি</span>
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                            {staffList.filter((s) => (s.designation || "").includes("ল্যাব") || (s.designation || "").includes("লাইব্রেরি")).length}{" "}
                            <span className="text-xs font-normal text-slate-400">জন</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">সহায়ক ও নিরাপত্তা</span>
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                            {staffList.filter((s) => (s.designation || "").includes("সহায়ক") || (s.designation || "").includes("প্রহরী")).length}{" "}
                            <span className="text-xs font-normal text-slate-400">জন</span>
                        </div>
                    </div>
                </div>

                {/* SEARCH & FILTERS BAR */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="নাম, পদবি বা ফোন নম্বর দিয়ে খুঁজুন..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={designationFilter}
                            onChange={(e) => setDesignationFilter(e.target.value)}
                            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none cursor-pointer"
                        >
                            <option value="all">-- সকল পদবি --</option>
                            {uniqueDesignations.map((ds) => (
                                <option key={ds} value={ds}>
                                    {ds}
                                </option>
                            ))}
                        </select>

                        <a
                            href="#/staff"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>পাবলিক বাতায়ন</span>
                        </a>
                    </div>
                </div>

                {/* STAFF CARDS GRID */}
                {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400">ডাটা লোড হচ্ছে...</div>
                ) : filteredStaff.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                        কোনো কর্মকর্তা বা কর্মচারীর রেকর্ড পাওয়া যায়নি।
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStaff.map((st, idx) => (
                            <div
                                key={st.id || idx}
                                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div className="flex items-start gap-3.5 mb-3">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/30 flex-shrink-0 bg-slate-100 dark:bg-slate-800 shadow-xs">
                                        <img
                                            src={resolveMediaUrl(st.image, sampleStaffAvatars[0].url)}
                                            alt={st.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            onError={(e) => {
                                                e.target.src = sampleStaffAvatars[0].url;
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                                {st.designation || "কর্মচারী"}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {st.name}
                                        </h4>
                                        {st.qualification && (
                                            <p className="text-[11px] mt-0.5 text-slate-500 truncate font-medium">
                                                যোগ্যতা: {st.qualification}
                                            </p>
                                        )}
                                        <div className="mt-1 space-y-0.5 text-[10.5px] text-slate-500">
                                            {st.phone && <p className="truncate">📞 {st.phone}</p>}
                                            {st.email && <p className="truncate">✉️ {st.email}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => handleOpenEdit(idx)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>সম্পাদনা</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="p-1.5 rounded-xl text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                        title="মুছে ফেলুন"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ADD / EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-emerald-500" />
                                <span>{editingIdx !== null ? "কর্মকর্তা/কর্মচারীর তথ্য সম্পাদনা" : "নতুন কর্মকর্তা/কর্মচারী যোগ করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveModal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1.5">কর্মকর্তা/কর্মচারীর নাম *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="যেমন: মোঃ মোখলেছুর রহমান"
                                    className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">পদবি (Designation) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.designation}
                                        onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                        placeholder="যেমন: হিসাব সহকারী"
                                        className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none"
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {["প্রধান অফিস সহকারী", "হিসাব সহকারী", "লাইব্রেরি সহকারী", "ল্যাব সহকারী", "অফিস সহায়ক", "নিরাপত্তা প্রহরী"].map((ds) => (
                                            <button
                                                key={ds}
                                                type="button"
                                                onClick={() => setForm({ ...form, designation: ds })}
                                                className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                                    form.designation === ds
                                                        ? "bg-emerald-600 text-white border-emerald-500 font-bold"
                                                        : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                                }`}
                                            >
                                                {ds}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5">শিক্ষাগত যোগ্যতা</label>
                                    <input
                                        type="text"
                                        value={form.qualification}
                                        onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                                        placeholder="যেমন: B.Com / H.S.C / S.S.C"
                                        className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">মোবাইল নম্বর</label>
                                    <input
                                        type="text"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="০১৭৮৯-১২৩৪৫৬"
                                        className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5">ইমেইল ঠিকানা</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="staff@dimlagirls.edu.bd"
                                        className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Staff Photo */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold">ছবি (Photo)</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-800 flex-shrink-0 shadow-sm">
                                        <img
                                            src={resolveMediaUrl(form.image, sampleStaffAvatars[0].url)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = sampleStaffAvatars[0].url;
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="text"
                                            value={form.image}
                                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                                            placeholder="ছবির লিংক (Image URL)"
                                            className="w-full rounded-xl px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none font-mono"
                                        />
                                    </div>
                                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>আপলোড</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                // 1. Instant zero-delay preview
                                                const blobUrl = createInstantPreview(file);
                                                if (blobUrl) {
                                                    setForm((prev) => ({ ...prev, image: blobUrl }));
                                                }

                                                // 2. Client-side rapid canvas compression (~30ms)
                                                const optimizedFile = await compressImage(file, { maxWidth: 600, maxHeight: 600 });
                                                const uploadFormData = new FormData();
                                                uploadFormData.append("image", optimizedFile);

                                                try {
                                                    const res = await api.post("/api/admin/cms/upload", uploadFormData, {
                                                        headers: { "Content-Type": "multipart/form-data" }
                                                    });
                                                    if (res.data?.url) {
                                                        setForm((prev) => ({ ...prev, image: res.data.url }));
                                                        setToast({ type: "success", message: "ছবি সফলভাবে অপ্টিমাইজ ও আপলোড হয়েছে!" });
                                                    }
                                                } catch (err) {
                                                    setToast({ type: "error", message: "ছবি আপলোড ব্যর্থ হয়েছে" });
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <span className="text-[11px] block mb-1 font-semibold text-slate-500">
                                        অথবা ডেমো ছবি থেকে এক ক্লিকে পছন্দ করুন:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {sampleStaffAvatars.map((av, avIdx) => (
                                            <button
                                                key={avIdx}
                                                type="button"
                                                onClick={() => setForm({ ...form, image: av.url })}
                                                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                                    form.image === av.url ? "border-emerald-500 scale-110 shadow-md shadow-emerald-500/30" : "border-slate-700 opacity-70 hover:opacity-100"
                                                }`}
                                                title={av.label}
                                            >
                                                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{editingIdx !== null ? "সংরক্ষণ করুন" : "যুক্ত করুন"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
