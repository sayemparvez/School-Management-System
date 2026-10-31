import React, { useState, useEffect } from "react";
import {
    Globe, Save, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon,
    Bell, Clock, Award, Users, BookOpen, ExternalLink, Trash2, Plus, Upload, Eye
} from "lucide-react";
import api from "../../utils/api";
import { useCMS } from "../../context/CMSContext";

export default function WebsiteCMS() {
    const { cms, refreshCMS } = useCMS();
    const [activeTab, setActiveTab] = useState("general");
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [uploading, setUploading] = useState(false);

    // Form states initialized with CMS context
    const [general, setGeneral] = useState(cms.general || {});
    const [emergencyNotice, setEmergencyNotice] = useState(cms.emergency_notice || {});
    const [headmaster, setHeadmaster] = useState(cms.headmaster || {});
    const [schoolStory, setSchoolStory] = useState(cms.school_story || {});
    const [timings, setTimings] = useState(cms.timings || {});
    const [achievers, setAchievers] = useState(cms.achievers || []);
    const [gallery, setGallery] = useState(cms.gallery || []);

    // New item inputs
    const [newAchiever, setNewAchiever] = useState({
        name: "", exam: "SSC 2025", gpa: "GPA 5.00", award: "মেধাবৃত্তি প্রাপ্ত", image: ""
    });
    const [newGalleryItem, setNewGalleryItem] = useState({
        title: "", image_url: "", category: "Academic"
    });

    useEffect(() => {
        if (cms) {
            if (cms.general) setGeneral(cms.general);
            if (cms.emergency_notice) setEmergencyNotice(cms.emergency_notice);
            if (cms.headmaster) setHeadmaster(cms.headmaster);
            if (cms.school_story) setSchoolStory(cms.school_story);
            if (cms.timings) setTimings(cms.timings);
            if (cms.achievers) setAchievers(cms.achievers);
            if (cms.gallery) setGallery(cms.gallery);
        }
    }, [cms]);

    const showToast = (text, type = "success") => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
    };

    // Generic section saver
    const handleSaveSection = async (sectionName, sectionData) => {
        setSaving(true);
        setStatusMessage({ text: "", type: "" });
        try {
            const res = await api.post("/api/admin/cms/update", {
                section: sectionName,
                data: sectionData
            });
            if (res.data && res.data.success) {
                showToast("পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে!", "success");
                await refreshCMS();
            } else {
                showToast(res.data?.message || "সংরক্ষণ ব্যর্থ হয়েছে!", "error");
            }
        } catch (err) {
            console.error("Save error:", err);
            showToast(err.response?.data?.message || "সার্ভার এরর, আবার চেষ্টা করুন।", "error");
        } finally {
            setSaving(false);
        }
    };

    // File uploader handler
    const handleFileUpload = async (e, callback) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const res = await api.post("/api/admin/cms/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data && res.data.url) {
                const fullUrl = `${api.defaults.baseURL || ""}${res.data.url}`;
                callback(fullUrl);
                showToast("ছবি সফলভাবে আপলোড হয়েছে!", "success");
            }
        } catch (err) {
            console.error("Upload error:", err);
            showToast("ছবি আপলোড ব্যর্থ হয়েছে!", "error");
        } finally {
            setUploading(false);
        }
    };

    // Achiever Management
    const handleAddAchiever = async (e) => {
        e.preventDefault();
        if (!newAchiever.name.trim()) return;

        const updated = [
            ...achievers,
            {
                id: Date.now(),
                ...newAchiever,
                image: newAchiever.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
            }
        ];
        setAchievers(updated);
        setNewAchiever({ name: "", exam: "SSC 2025", gpa: "GPA 5.00", award: "মেধাবৃত্তি প্রাপ্ত", image: "" });
        await handleSaveSection("achievers", updated);
    };

    const handleDeleteAchiever = async (id) => {
        const updated = achievers.filter(a => a.id !== id);
        setAchievers(updated);
        await handleSaveSection("achievers", updated);
    };

    // Gallery Management
    const handleAddGalleryItem = async (e) => {
        e.preventDefault();
        if (!newGalleryItem.title.trim() || !newGalleryItem.image_url.trim()) return;

        const updated = [
            ...gallery,
            {
                id: Date.now(),
                ...newGalleryItem
            }
        ];
        setGallery(updated);
        setNewGalleryItem({ title: "", image_url: "", category: "Academic" });
        await handleSaveSection("gallery", updated);
    };

    const handleDeleteGalleryItem = async (id) => {
        const updated = gallery.filter(g => g.id !== id);
        setGallery(updated);
        await handleSaveSection("gallery", updated);
    };

    const tabs = [
        { id: "general", label: "সাধারণ তথ্য", icon: Globe },
        { id: "notice", label: "জরুরি নোটিশ", icon: Bell },
        { id: "headmaster", label: "প্রধান শিক্ষক ও গল্প", icon: Users },
        { id: "timings", label: "প্রতিষ্ঠানের সময়সূচি", icon: Clock },
        { id: "achievers", label: "কৃতি শিক্ষার্থী", icon: Award },
        { id: "gallery", label: "ছবি গ্যালারি", icon: ImageIcon }
    ];

    return (
        <div className="space-y-6 pb-12">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur">
                        <Globe className="w-3.5 h-3.5" />
                        Website Content Management System (CMS)
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        পাবলিক ওয়েবসাইট কন্ট্রোল প্যানেল
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
                        কোডিং ছাড়াই সরাসরি এখান থেকে স্কুলের নাম, নোটিশ, সময়সূচি, প্রধান শিক্ষকের বাণী, কৃতি শিক্ষার্থী ও ছবি নিয়ন্ত্রণ করুন।
                    </p>
                </div>

                <div className="flex items-center gap-2.5 z-10 flex-wrap">
                    <a
                        href="#/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 backdrop-blur transition-all flex items-center gap-1.5 shadow-sm"
                    >
                        <Eye className="w-4 h-4" />
                        <span>লাইভ ওয়েবসাইট দেখুন</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>

                    <button
                        onClick={refreshCMS}
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all"
                        title="রিফ্রেশ করুন"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Notification Alert */}
            {statusMessage.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
                    statusMessage.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                        : "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                }`}>
                    {statusMessage.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                    )}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            {/* Tab Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                                isActive
                                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-emerald-200" : "text-slate-400"}`} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: General Info */}
            {activeTab === "general" && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            সাধারণ তথ্য ও ব্র্যান্ডিং (General Information)
                        </h2>
                        <p className="text-xs text-slate-500">
                            পাবলিক ওয়েবসাইটের হেডার, ফুটার ও ব্যানারে প্রদর্শিত প্রাতিষ্ঠানিক তথ্য।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                বিদ্যালয়ের নাম (বাংলা)
                            </label>
                            <input
                                type="text"
                                value={general.school_name_bn || ""}
                                onChange={(e) => setGeneral({ ...general, school_name_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                বিদ্যালয়ের নাম (ইংরেজি)
                            </label>
                            <input
                                type="text"
                                value={general.school_name_en || ""}
                                onChange={(e) => setGeneral({ ...general, school_name_en: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                ইআইআইএন (EIIN)
                            </label>
                            <input
                                type="text"
                                value={general.eiin || ""}
                                onChange={(e) => setGeneral({ ...general, eiin: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                স্থাপিত সন (Established Year)
                            </label>
                            <input
                                type="text"
                                value={general.est_year || ""}
                                onChange={(e) => setGeneral({ ...general, est_year: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                অফিসিয়াল হেল্পলাইন নম্বর
                            </label>
                            <input
                                type="text"
                                value={general.phone || ""}
                                onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                অফিসিয়াল ইমেইল
                            </label>
                            <input
                                type="email"
                                value={general.email || ""}
                                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                পূর্ণ ঠিকানা (বাংলা)
                            </label>
                            <input
                                type="text"
                                value={general.address_bn || ""}
                                onChange={(e) => setGeneral({ ...general, address_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                শিক্ষা বোর্ড
                            </label>
                            <input
                                type="text"
                                value={general.board_name || ""}
                                onChange={(e) => setGeneral({ ...general, board_name: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                প্রাতিষ্ঠানিক স্লোগান (Slogan)
                            </label>
                            <input
                                type="text"
                                value={general.slogan_bn || ""}
                                onChange={(e) => setGeneral({ ...general, slogan_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveSection("general", general)}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "তথ্য সংরক্ষণ করুন"}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: Emergency Notice */}
            {activeTab === "notice" && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                জরুরি নোটিশ টিকার (Emergency Notice Ticker)
                            </h2>
                            <p className="text-xs text-slate-500">
                                ওয়েবসাইটের একদম উপরে লাল ব্যাজে স্ক্রলিং নোটিশ ম্যানেজ করুন।
                            </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emergencyNotice.is_active ?? true}
                                onChange={(e) => setEmergencyNotice({ ...emergencyNotice, is_active: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            <span className="ml-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                {emergencyNotice.is_active ? "সক্রিয় (Active)" : "বন্ধ (Inactive)"}
                            </span>
                        </label>
                    </div>

                    {/* Live Preview Box */}
                    <div className="p-3 bg-emerald-900 text-white rounded-xl text-xs flex items-center gap-2 overflow-hidden shadow-inner">
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex-shrink-0">
                            লাইভ প্রিভিউ
                        </span>
                        <div className="overflow-hidden whitespace-nowrap text-emerald-100 text-[11px]">
                            <marquee scrollamount="5">
                                {emergencyNotice.notice_bn || "কোনো নোটিশ নেই"}
                            </marquee>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                বাংলা নোটিশ টেক্সট
                            </label>
                            <textarea
                                rows="3"
                                value={emergencyNotice.notice_bn || ""}
                                onChange={(e) => setEmergencyNotice({ ...emergencyNotice, notice_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="বাংলায় নোটিশ লিখুন..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                ইংরেজি নোটিশ টেক্সট
                            </label>
                            <textarea
                                rows="3"
                                value={emergencyNotice.notice_en || ""}
                                onChange={(e) => setEmergencyNotice({ ...emergencyNotice, notice_en: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="English notice text..."
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveSection("emergency_notice", emergencyNotice)}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "নোটিশ আপডেট করুন"}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 3: Headmaster & School Story */}
            {activeTab === "headmaster" && (
                <div className="space-y-6">
                    {/* Headmaster Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                প্রতিষ্ঠান প্রধানের বাণী (Headmaster's Message)
                            </h2>
                            <p className="text-xs text-slate-500">
                                হোমপেইজে প্রতিষ্ঠান প্রধানের প্রোফাইল ও আনুষ্ঠানিক বক্তব্য।
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                            {/* Photo & Upload */}
                            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <img
                                    src={headmaster.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"}
                                    alt="Headmaster"
                                    className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm mb-3"
                                />
                                <label className="cursor-pointer px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{uploading ? "আপলোড হচ্ছে..." : "নতুন ছবি আপলোড"}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, (url) => setHeadmaster({ ...headmaster, image_url: url }))}
                                    />
                                </label>
                                <span className="text-[10px] text-slate-400 mt-2">JPG, PNG বা WebP</span>
                            </div>

                            {/* Details & Message */}
                            <div className="sm:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            প্রধান শিক্ষকের নাম (বাংলা)
                                        </label>
                                        <input
                                            type="text"
                                            value={headmaster.name_bn || ""}
                                            onChange={(e) => setHeadmaster({ ...headmaster, name_bn: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            পদবি (Designation)
                                        </label>
                                        <input
                                            type="text"
                                            value={headmaster.designation_bn || ""}
                                            onChange={(e) => setHeadmaster({ ...headmaster, designation_bn: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        প্রধান শিক্ষকের বাণী (বাংলা)
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={headmaster.message_bn || ""}
                                        onChange={(e) => setHeadmaster({ ...headmaster, message_bn: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => handleSaveSection("headmaster", headmaster)}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>বাণী সংরক্ষণ করুন</span>
                            </button>
                        </div>
                    </div>

                    {/* School Story Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                প্রতিষ্ঠানের গল্প ও ক্যাম্পাস পরিচিতি (Campus Story)
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    শিরোনাম
                                </label>
                                <input
                                    type="text"
                                    value={schoolStory.title_bn || ""}
                                    onChange={(e) => setSchoolStory({ ...schoolStory, title_bn: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    ক্যাম্পাস ছবির লিঙ্ক
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={schoolStory.image_url || ""}
                                        onChange={(e) => setSchoolStory({ ...schoolStory, image_url: e.target.value })}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                    />
                                    <label className="cursor-pointer px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>আপলোড</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, (url) => setSchoolStory({ ...schoolStory, image_url: url }))}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    সংক্ষিপ্ত ইতিহাস ও পরিচিতি
                                </label>
                                <textarea
                                    rows="4"
                                    value={schoolStory.content_bn || ""}
                                    onChange={(e) => setSchoolStory({ ...schoolStory, content_bn: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => handleSaveSection("school_story", schoolStory)}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>গল্প সংরক্ষণ করুন</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: Timings */}
            {activeTab === "timings" && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            প্রতিষ্ঠানের সময়সূচি উইজেট (School Timings)
                        </h2>
                        <p className="text-xs text-slate-500">
                            সাইডবারের নীল সময়সূচি উইজেটের ক্লাস ও অফিসের সময় সরাসরি এখান থেকে এডিট করুন।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                ক্লাস শুরু
                            </label>
                            <input
                                type="text"
                                value={timings.class_start_bn || ""}
                                onChange={(e) => setTimings({ ...timings, class_start_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                placeholder="০৯:০০ AM"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                টিফিন বিরতি
                            </label>
                            <input
                                type="text"
                                value={timings.tiffin_break_bn || ""}
                                onChange={(e) => setTimings({ ...timings, tiffin_break_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                placeholder="০১:০০ PM - ০২:০০ PM"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                ক্লাস শেষ
                            </label>
                            <input
                                type="text"
                                value={timings.class_end_bn || ""}
                                onChange={(e) => setTimings({ ...timings, class_end_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                placeholder="০৪:০০ PM"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                অফিস সময়
                            </label>
                            <input
                                type="text"
                                value={timings.office_hours_bn || ""}
                                onChange={(e) => setTimings({ ...timings, office_hours_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                placeholder="০৯:০০ AM - ০৪:০০ PM"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                সাপ্তাহিক ছুটির বিবরণ
                            </label>
                            <input
                                type="text"
                                value={timings.weekend_note_bn || ""}
                                onChange={(e) => setTimings({ ...timings, weekend_note_bn: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="ছুটির দিন: শুক্রবার ও শনিবার"
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveSection("timings", timings)}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>সময়সূচি সংরক্ষণ করুন</span>
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 5: Achievers */}
            {activeTab === "achievers" && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                কৃতি শিক্ষার্থী ম্যানেজমেন্ট (Achievers Showcase)
                            </h2>
                            <p className="text-xs text-slate-500">
                                হোমপেইজের কৃতি শিক্ষার্থীদের তালিকা ও ফলাফল নিয়ন্ত্রণ করুন।
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                            মোট: {achievers.length} জন
                        </span>
                    </div>

                    {/* Add New Achiever Form */}
                    <form onSubmit={handleAddAchiever} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-emerald-600" />
                            নতুন কৃতি শিক্ষার্থী যোগ করুন
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">শিক্ষার্থীর নাম *</label>
                                <input
                                    type="text"
                                    required
                                    value={newAchiever.name}
                                    onChange={(e) => setNewAchiever({ ...newAchiever, name: e.target.value })}
                                    placeholder="যেমন: সুমাইয়া জাহান"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">পরীক্ষা / সাল</label>
                                <input
                                    type="text"
                                    value={newAchiever.exam}
                                    onChange={(e) => setNewAchiever({ ...newAchiever, exam: e.target.value })}
                                    placeholder="SSC 2025"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">জিপিএ (GPA)</label>
                                <input
                                    type="text"
                                    value={newAchiever.gpa}
                                    onChange={(e) => setNewAchiever({ ...newAchiever, gpa: e.target.value })}
                                    placeholder="GPA 5.00 (Golden)"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">অর্জিত স্বীকৃতি / বৃত্তি</label>
                                <input
                                    type="text"
                                    value={newAchiever.award}
                                    onChange={(e) => setNewAchiever({ ...newAchiever, award: e.target.value })}
                                    placeholder="মেধাবৃত্তি প্রাপ্ত"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <div className="w-full sm:w-auto flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newAchiever.image}
                                    onChange={(e) => setNewAchiever({ ...newAchiever, image: e.target.value })}
                                    placeholder="ছবির লিঙ্ক (URL) বা আপলোড বাটন চাপুন"
                                    className="flex-1 sm:w-80 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                                />
                                <label className="cursor-pointer px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>আপলোড</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, (url) => setNewAchiever({ ...newAchiever, image: url }))}
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>তালিকায় যোগ করুন</span>
                            </button>
                        </div>
                    </form>

                    {/* Existing Achievers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {achievers.map((stu) => (
                            <div
                                key={stu.id}
                                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-xs"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img
                                        src={stu.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                                        alt={stu.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
                                    />
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                            {stu.name}
                                        </h4>
                                        <div className="text-[10px] text-emerald-600 font-bold">
                                            {stu.gpa}
                                        </div>
                                        <div className="text-[10px] text-slate-400 truncate">
                                            {stu.exam} • {stu.award}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteAchiever(stu.id)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                                    title="মুছে ফেলুন"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 6: Gallery */}
            {activeTab === "gallery" && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                ফটো ও ইভেন্ট গ্যালারি (Photo Gallery)
                            </h2>
                            <p className="text-xs text-slate-500">
                                স্কুলের অনুষ্ঠান, জাতীয় দিবস ও উৎসবের ছবিসমূহ প্রকাশ ও ম্যানেজ করুন।
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                            মোট: {gallery.length} টি ছবি
                        </span>
                    </div>

                    {/* Add Photo Form */}
                    <form onSubmit={handleAddGalleryItem} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-emerald-600" />
                            গ্যালারিতে নতুন ছবি যোগ করুন
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="sm:col-span-2">
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">ছবির শিরোনাম / ক্যাপশন *</label>
                                <input
                                    type="text"
                                    required
                                    value={newGalleryItem.title}
                                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                                    placeholder="যেমন: বিজ্ঞান মেলা ও প্রজেক্ট প্রদর্শনী ২০২৬"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">ক্যাটাগরি</label>
                                <select
                                    value={newGalleryItem.category}
                                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
                                >
                                    <option value="Academic">অ্যাকাডেমিক ও ক্লাস</option>
                                    <option value="Sports">বার্ষিক ক্রীড়া</option>
                                    <option value="Cultural">সাংস্কৃতিক অনুষ্ঠান</option>
                                    <option value="National">জাতীয় দিবস</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <div className="w-full sm:w-auto flex items-center gap-2">
                                <input
                                    type="text"
                                    required
                                    value={newGalleryItem.image_url}
                                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image_url: e.target.value })}
                                    placeholder="ছবির লিংক (URL) অথবা আপলোড বাটন চাপুন"
                                    className="flex-1 sm:w-96 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                                />
                                <label className="cursor-pointer px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>আপলোড</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, (url) => setNewGalleryItem({ ...newGalleryItem, image_url: url }))}
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>গ্যালারিতে যুক্ত করুন</span>
                            </button>
                        </div>
                    </form>

                    {/* Gallery Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {gallery.map((item) => (
                            <div
                                key={item.id}
                                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                            >
                                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteGalleryItem(item.id)}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-sm cursor-pointer"
                                        title="মুছে ফেলুন"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">
                                        {item.category}
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 mt-0.5">
                                        {item.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
