import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Calendar, Clock, BookOpen, Users, Printer, Plus, Trash2,
    Edit3, Save, CheckCircle2, Sparkles, MapPin, Coffee, ArrowRight,
    AlertCircle, Check, X, Shield, FileSpreadsheet, RefreshCw
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";
import api from "../../utils/api";

// Standard School Curriculum & Teacher Rosters for Dimla Govt Girls' High School
const routineSubjectsJunior = [
    "বাংলা ১ম পত্র", "বাংলা ২য় পত্র", "ইংরেজি ১ম পত্র", "ইংরেজি ২য় পত্র",
    "সাধারণ গণিত", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়",
    "তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)", "ইসলাম ও নৈতিক শিক্ষা",
    "হিন্দুধর্ম ও নৈতিক শিক্ষা", "চারু ও কারুকলা", "শারীরিক শিক্ষা ও স্বাস্থ্য",
    "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "সহশিক্ষা ও স্কাউটিং"
];

const routineSubjectsSenior = [
    "বাংলা ১ম পত্র", "বাংলা ২য় পত্র", "ইংরেজি ১ম পত্র", "ইংরেজি ২য় পত্র",
    "সাধারণ গণিত", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান",
    "তথ্য ও যোগাযোগ প্রযুক্তি", "ইতিহাস ও সামাজিক বিজ্ঞান", "ভূগোল ও পরিবেশ",
    "অর্থনীতি", "পৌরনীতি ও নাগরিকতা", "বাংলাদেশ ও বিশ্বপরিচয়",
    "ইসলাম ও নৈতিক শিক্ষা", "হিন্দুধর্ম ও নৈতিক শিক্ষা", "শারীরিক শিক্ষা ও ক্যারিয়ার শিক্ষা"
];

const routineTeachers = [
    "মোছাঃ সেলিনা আক্তার", "মোঃ রফিকুল ইসলাম", "মিজানুর রহমান", "মোছাঃ ফাতেমা বেগম",
    "মোঃ হাফিজুর রহমান", "ফারহানা হক", "ড. শফিকুল ইসলাম", "প্রভাষক কামরুল হাসান",
    "মাহমুদা খাতুন", "আব্দুল কাদের জিলানী", "মোছাঃ নাজনীন জাহান", "মুহাম্মদ আলী",
    "মাওলানা আব্দুর রশিদ", "সুবোধ রায়", "আব্দুল মজিদ", "নিলুফার ইয়াসমিন",
    "শামসুন্নাহার পারভীন", "ইঞ্জি. তারেক মাহমুদ", "সুলতানা রাজিয়া", "আসমা খাতুন",
    "মোজাম্মেল হক", "স্বপন কুমার"
];

const routineRooms = [
    "১০১", "১০২", "১০৩", "২০১", "২০২", "২০৩", "২০৪",
    "কম্পিউটার ল্যাব", "বিজ্ঞানাগার (ল্যাব)", "খেলার মাঠ", "অডিটোরিয়াম"
];

const ClassRoutinePage = ({ isAdmin = false }) => {
    const { lang, t } = useLanguage();
    const { cms, refreshCMS } = useCMS();
    const location = useLocation();

    // Check if viewed inside Admin ERP dashboard
    const isAdminView = isAdmin || location.pathname.includes("/admin");

    const [selectedClass, setSelectedClass] = useState("class_6");
    const [selectedDay, setSelectedDay] = useState("সকল দিন");
    const [routinesData, setRoutinesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Period Edit / Add Modal State
    const [periodModalOpen, setPeriodModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editDay, setEditDay] = useState("রবিবার");
    const [editIndex, setEditIndex] = useState(-1);
    const [periodForm, setPeriodForm] = useState({
        period: "১ম পিরিয়ড",
        time: "১০:১৫ - ১১:০০ AM",
        subject: "",
        teacher: "",
        room: "১০১"
    });

    const daysList = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];

    const classTabs = [
        { id: "class_6", nameBn: "৬ষ্ঠ শ্রেণি", nameEn: "Class 6", periods: 6 },
        { id: "class_7", nameBn: "৭ম শ্রেণি", nameEn: "Class 7", periods: 6 },
        { id: "class_8", nameBn: "৮ম শ্রেণি", nameEn: "Class 8", periods: 6 },
        { id: "class_9", nameBn: "৯ম শ্রেণি", nameEn: "Class 9", periods: 7 },
        { id: "class_10", nameBn: "১০ম শ্রেণি (এসএসসি ২০২৭)", nameEn: "Class 10 (SSC 2027)", periods: 7 }
    ];

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    const fetchRoutines = async () => {
        try {
            const res = await api.get("/api/public/class-routines");
            if (res.data && res.data.success && res.data.data) {
                setRoutinesData(res.data.data);
            }
        } catch (err) {
            console.warn("Could not load dynamic class routines, using CMS fallback:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    const sourceData = routinesData || cms?.class_routines;
    const isNineOrTen = selectedClass === "class_9" || selectedClass === "class_10";
    const totalDailyPeriods = isNineOrTen ? 7 : 6;

    const currentClassInfo = sourceData?.classes?.[selectedClass] || {
        name_bn: selectedClass === "class_6" ? "৬ষ্ঠ শ্রেণি" :
                 selectedClass === "class_7" ? "৭ম শ্রেণি" :
                 selectedClass === "class_8" ? "৮ম শ্রেণি" :
                 selectedClass === "class_9" ? "৯ম শ্রেণি" : "১০ম শ্রেণি (এসএসসি ২০২৭)",
        name_en: selectedClass.replace("_", " ").toUpperCase(),
        section_bn: isNineOrTen ? "বিজ্ঞান ও মানবিক শাখা" : "কোনো শাখা নেই (সাধারণ)",
        room_no: isNineOrTen ? "২০১ ও ২০২" : selectedClass === "class_6" ? "১০১" : selectedClass === "class_7" ? "১০২" : "১০৩",
        class_teacher: isNineOrTen ? (selectedClass === "class_9" ? "ড. শফিকুল ইসলাম" : "প্রভাষক কামরুল হাসান") :
                       selectedClass === "class_6" ? "মোছাঃ সেলিনা আক্তার" : selectedClass === "class_7" ? "মোঃ রফিকুল ইসলাম" : "মিজানুর রহমান",
        daily_periods: totalDailyPeriods,
        schedule: {}
    };

    const getPeriodTime = (period, classId = selectedClass) => {
        const isSenior = classId === "class_9" || classId === "class_10";
        if (period.includes("১ম")) return "১০:১৫ - ১১:০০ AM";
        if (period.includes("২য়")) return "১১:০০ - ১১:৪৫ AM";
        if (period.includes("৩য়")) return "১১:৪৫ - ১২:৩০ PM";
        if (period.includes("৪র্থ")) return "১২:৩০ - ০১:১৫ PM";
        if (period.includes("টিফিন")) return "০১:১৫ - ০২:০০ PM";
        if (period.includes("৫ম")) return isSenior ? "০২:০০ - ০২:৪০ PM" : "০২:০০ - ০৩:০০ PM";
        if (period.includes("৬ষ্ঠ")) return isSenior ? "০২:৪০ - ০৩:২০ PM" : "০৩:০০ - ০৪:০০ PM";
        if (period.includes("৭ম")) return "০৩:২০ - ০৪:০০ PM";
        return "১০:১৫ AM - ০৪:০০ PM";
    };

    // Open Modal to Add a new Period
    const handleOpenAddModal = (day = "রবিবার") => {
        setIsEditing(false);
        setEditDay(day);
        setEditIndex(-1);
        setPeriodForm({
            period: "১ম পিরিয়ড",
            time: getPeriodTime("১ম পিরিয়ড", selectedClass),
            subject: "",
            teacher: "",
            room: currentClassInfo.room_no || "১০১"
        });
        setPeriodModalOpen(true);
    };

    // Open Modal to Edit an Existing Period
    const handleOpenEditModal = (day, pIdx, periodObj) => {
        setIsEditing(true);
        setEditDay(day);
        setEditIndex(pIdx);
        setPeriodForm({
            period: periodObj.period || "১ম পিরিয়ড",
            time: periodObj.time || getPeriodTime(periodObj.period, selectedClass),
            subject: periodObj.subject || "",
            teacher: periodObj.teacher || "",
            room: periodObj.room || currentClassInfo.room_no || "১০১"
        });
        setPeriodModalOpen(true);
    };

    // Save Period changes to local state & persist to DB
    const handleSavePeriodForm = async (e) => {
        e.preventDefault();
        if (!periodForm.subject.trim() || !periodForm.teacher.trim()) {
            showToast("বিষয়ের নাম ও শিক্ষকের নাম আবশ্যক!", "error");
            return;
        }

        const updatedData = JSON.parse(JSON.stringify(sourceData || {
            academic_year: "২০২৬",
            classes: {}
        }));

        if (!updatedData.classes) updatedData.classes = {};
        if (!updatedData.classes[selectedClass]) {
            updatedData.classes[selectedClass] = { ...currentClassInfo, schedule: {} };
        }
        if (!updatedData.classes[selectedClass].schedule) {
            updatedData.classes[selectedClass].schedule = {};
        }
        if (!updatedData.classes[selectedClass].schedule[editDay]) {
            updatedData.classes[selectedClass].schedule[editDay] = [];
        }

        const daySchedule = [...updatedData.classes[selectedClass].schedule[editDay]];

        const newPeriodObj = {
            period: periodForm.period,
            time: periodForm.time || getPeriodTime(periodForm.period, selectedClass),
            subject: periodForm.subject.trim(),
            teacher: periodForm.teacher.trim(),
            room: periodForm.room.trim() || currentClassInfo.room_no
        };

        if (isEditing && editIndex >= 0) {
            daySchedule[editIndex] = newPeriodObj;
        } else {
            daySchedule.push(newPeriodObj);
        }

        updatedData.classes[selectedClass].schedule[editDay] = daySchedule;
        updatedData.classes[selectedClass].daily_periods = totalDailyPeriods;
        updatedData.classes[selectedClass].section_bn = isNineOrTen ? "বিজ্ঞান ও মানবিক শাখা" : "কোনো শাখা নেই (সাধারণ)";

        setRoutinesData(updatedData);
        setPeriodModalOpen(false);

        // Auto save to database
        await handleSaveAllRoutines(updatedData);
    };

    // Delete a period slot
    const handleDeletePeriod = async (day, pIdx) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই পিরিয়ডটি মুছে ফেলতে চান?")) return;

        const updatedData = JSON.parse(JSON.stringify(sourceData || { classes: {} }));
        if (updatedData.classes?.[selectedClass]?.schedule?.[day]) {
            updatedData.classes[selectedClass].schedule[day] = updatedData.classes[selectedClass].schedule[day].filter((_, i) => i !== pIdx);
            setRoutinesData(updatedData);
            await handleSaveAllRoutines(updatedData);
        }
    };

    // Save full routine to DB
    const handleSaveAllRoutines = async (dataToPersist = sourceData) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/admin/cms/update", {
                section: "class_routines",
                data: dataToPersist
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await refreshCMS();
            showToast("ক্লাস রুটিন সফলভাবে সংরক্ষিত ও লাইভ আপডেট সম্পন্ন হয়েছে!");
        } catch (err) {
            console.error("Save error:", err);
            showToast("রুটিন সংরক্ষণে সমস্যা হয়েছে। অ্যাডমিন টোকেন যাচাই করুন।", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`space-y-6 ${isAdminView ? "p-4 sm:p-6" : "max-w-7xl mx-auto px-4 sm:px-8 py-8"}`}>
            
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border animate-in slide-in-from-bottom-5 ${
                    toast.type === "success"
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-red-600 text-white border-red-400"
                }`}>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* 1. Header Banner */}
            <div className={`print:hidden rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden ${
                isAdminView
                    ? "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800"
                    : "bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white"
            }`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                                {isAdminView
                                    ? "একাডেমিক ইআরপি • ক্লাস রুটিন ম্যানেজমেন্ট ২০২৬"
                                    : (lang === "bn" ? "একাডেমিক সময়সূচি ও ক্লাস রুটিন ২০২৬" : "Academic Schedule & Timetable 2026")}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black">
                            {isAdminView ? "শ্রেণিভিত্তিক ক্লাস রুটিন পরিচালনা ও সময়সূচি" : (lang === "bn" ? "শ্রেণিভিত্তিক ক্লাস রুটিন" : "Class Routine & Timetable")}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                            {isNineOrTen
                                ? "৯ম ও ১০ম শ্রেণির শিক্ষার্থীদের জন্য বিজ্ঞান ও মানবিক বিভাগের প্রতিদিন ৭টি ক্লাস ও টিফিন বিরতি।"
                                : "৬ষ্ঠ হতে ৮ম শ্রেণির শিক্ষার্থীদের জন্য কোনো শাখা ছাড়া প্রতিদিন ৬টি ক্লাস ও টিফিন বিরতি।"}
                        </p>
                    </div>

                    {/* Action buttons on header */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {isAdminView && (
                            <button
                                onClick={() => handleOpenAddModal(selectedDay === "সকল দিন" ? "রবিবার" : selectedDay)}
                                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>নতুন পিরিয়ড যোগ</span>
                            </button>
                        )}

                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all border border-white/20 shadow-xs cursor-pointer"
                        >
                            <Printer className="w-4 h-4 text-emerald-300" />
                            <span>{lang === "bn" ? "প্রিন্ট রুটিন" : "Print Routine"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Header only visible when printing */}
            <div className="hidden print:block text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-black">ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়</h2>
                <p className="text-xs font-semibold">একাডেমিক ক্লাস রুটিন • শিক্ষাবর্ষ: ২০২৬</p>
                <p className="text-sm font-bold text-emerald-800 mt-1">
                    {currentClassInfo.name_bn} ({currentClassInfo.section_bn}) • কক্ষ নং: {currentClassInfo.room_no} • শ্রেণি শিক্ষক: {currentClassInfo.class_teacher} • দৈনিক {totalDailyPeriods}টি পিরিয়ড
                </p>
            </div>

            {/* 2. MAIN LAYOUT:
                If AdminView: Full width (12 cols) with NO right sidebar!
                If PublicView: 8 cols main content + 4 cols RightSidebar!
            */}
            <div className={isAdminView ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"}>
                
                {/* Main Content Area */}
                <div className={isAdminView ? "space-y-6" : "lg:col-span-8 space-y-6"}>
                    
                    {/* Class Selector Tabs */}
                    <div className="print:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {classTabs.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedClass(c.id)}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer flex items-center gap-2 ${
                                    selectedClass === c.id
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-102"
                                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                                }`}
                            >
                                <span>{lang === "bn" ? c.nameBn : c.nameEn}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    selectedClass === c.id
                                        ? "bg-white/20 text-white font-extrabold"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold"
                                }`}>
                                    {c.periods} ক্লাস
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Class Summary Badge Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-md flex-shrink-0">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                                        {currentClassInfo.name_bn}
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                                        দৈনিক {totalDailyPeriods}টি পিরিয়ড
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                        {currentClassInfo.section_bn}
                                    </span>
                                    <span>•</span>
                                    <span>কক্ষ নং: {currentClassInfo.room_no}</span>
                                    <span>•</span>
                                    <span>শ্রেণি শিক্ষক: {currentClassInfo.class_teacher}</span>
                                </div>
                            </div>
                        </div>

                        {/* Day Selector Pills */}
                        <div className="print:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start sm:self-auto">
                            <button
                                onClick={() => setSelectedDay("সকল দিন")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedDay === "সকল দিন"
                                        ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-xs"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                }`}
                            >
                                সকল দিন
                            </button>
                            {daysList.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDay(d)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        selectedDay === d
                                            ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-xs"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* School Assembly & Timing Notice Bar */}
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 p-4 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
                        <div className="font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span>দৈনিক পাঠদান ও সময়সূচি বণ্টন:</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                {isNineOrTen ? "৯ম-১০ম: ৭টি পিরিয়ড" : "৬ষ্ঠ-৮ম: ৬টি পিরিয়ড"}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1 text-slate-600 dark:text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                                ১০:০০ - ১০:১৫ AM প্রাত্যহিক সমাবেশ
                            </span>
                            <span>→</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
                                ১ম-৪র্থ পিরিয়ড (১০:১৫ - ০১:১৫ PM)
                            </span>
                            <span>→</span>
                            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                                ০১:১৫ - ০২:০০ PM টিফিন ও যোহর বিরতি
                            </span>
                            <span>→</span>
                            <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">
                                {isNineOrTen ? "৫ম-৭ম পিরিয়ড (০২:০০ - ০৪:০০ PM)" : "৫ম-৬ষ্ঠ পিরিয়ড (০২:০০ - ০৪:০০ PM)"}
                            </span>
                            <span>→</span>
                            <span className="font-bold text-red-600">০৪:০০ PM স্কুল ছুটি</span>
                        </div>
                    </div>

                    {/* Daily Schedule Cards */}
                    <div className="space-y-5">
                        {daysList
                            .filter((dayName) => selectedDay === "সকল দিন" || selectedDay === dayName)
                            .map((dayName) => {
                                const periods = currentClassInfo.schedule?.[dayName] || [];
                                return (
                                    <div
                                        key={dayName}
                                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                                    >
                                        {/* Day Card Header */}
                                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-emerald-600" />
                                                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                                                    {dayName}
                                                </h4>
                                                <span className="text-[11px] font-semibold text-slate-500">
                                                    ({periods.length}টি ক্লাস পিরিয়ড)
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                                                    {totalDailyPeriods}টি পিরিয়ড ও টিফিন বিরতি
                                                </span>
                                                {isAdminView && (
                                                    <button
                                                        onClick={() => handleOpenAddModal(dayName)}
                                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                                        title="এই দিনে পিরিয়ড যোগ করুন"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        <span>পিরিয়ড যোগ</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Period Rows */}
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {periods.length > 0 ? (
                                                periods.map((slot, pIdx) => {
                                                    const timeStr = slot.time || getPeriodTime(slot.period, selectedClass);
                                                    const isAfterTiffin = slot.period.includes("৫ম") || slot.period.includes("৬ষ্ঠ") || slot.period.includes("৭ম");
                                                    return (
                                                        <div
                                                            key={pIdx}
                                                            className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                                                        >
                                                            {/* Period & Subject */}
                                                            <div className="flex items-start sm:items-center gap-3">
                                                                <span className={`w-20 px-2.5 py-1.5 rounded-xl text-[11px] font-black text-center flex-shrink-0 ${
                                                                    isAfterTiffin
                                                                        ? "bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                                                                        : "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                                                }`}>
                                                                    {slot.period}
                                                                </span>

                                                                <div className="space-y-0.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                                            {slot.subject}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                                        <span>{timeStr}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Teacher & Room + Admin Actions */}
                                                            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 dark:text-slate-400 pl-23 sm:pl-0">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                                                                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                        <span>{slot.teacher}</span>
                                                                    </span>

                                                                    <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                        <MapPin className="w-3 h-3 text-slate-400" />
                                                                        <span>{slot.room || currentClassInfo.room_no}</span>
                                                                    </span>
                                                                </div>

                                                                {/* Admin ERP Controls: Edit & Delete */}
                                                                {isAdminView && (
                                                                    <div className="flex items-center gap-1.5 ml-2">
                                                                        <button
                                                                            onClick={() => handleOpenEditModal(dayName, pIdx, slot)}
                                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                                                                            title="পিরিয়ড পরিবর্তন করুন"
                                                                        >
                                                                            <Edit3 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeletePeriod(dayName, pIdx)}
                                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                                                                            title="পিরিয়ড মুছে ফেলুন"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-6 text-center text-xs text-slate-400">
                                                    এই দিনের জন্য এখনো কোনো রুটিন অন্তর্ভুক্ত করা হয়নি।
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Right Sidebar: Rendered ONLY on Public Website! Hidden on Admin ERP! */}
                {!isAdminView && (
                    <div className="print:hidden lg:col-span-4">
                        <RightSidebar />
                    </div>
                )}
            </div>

            {/* 3. MODAL: Add / Edit Period Dialog for Admin */}
            {periodModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                    {isEditing ? "পিরিয়ড সম্পাদনা (Edit Period)" : "নতুন পিরিয়ড যোগ (Add Period)"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setPeriodModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSavePeriodForm} className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">শ্রেণি</label>
                                    <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                                        {currentClassInfo.name_bn}
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">সপ্তাহের দিন</label>
                                    <select
                                        value={editDay}
                                        onChange={(e) => setEditDay(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:border-emerald-500"
                                    >
                                        {daysList.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">পিরিয়ড নম্বর</label>
                                    <select
                                        value={periodForm.period}
                                        onChange={(e) => {
                                            const newP = e.target.value;
                                            setPeriodForm({
                                                ...periodForm,
                                                period: newP,
                                                time: getPeriodTime(newP, selectedClass)
                                            });
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:border-emerald-500"
                                    >
                                        <option value="১ম পিরিয়ড">১ম পিরিয়ড</option>
                                        <option value="২য় পিরিয়ড">২য় পিরিয়ড</option>
                                        <option value="৩য় পিরিয়ড">৩য় পিরিয়ড</option>
                                        <option value="৪র্থ পিরিয়ড">৪র্থ পিরিয়ড</option>
                                        <option value="৫ম পিরিয়ড">৫ম পিরিয়ড</option>
                                        <option value="৬ষ্ঠ পিরিয়ড">৬ষ্ঠ পিরিয়ড</option>
                                        {isNineOrTen && <option value="৭ম পিরিয়ড">৭ম পিরিয়ড</option>}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">সময়সূচি</label>
                                    <input
                                        type="text"
                                        value={periodForm.time}
                                        onChange={(e) => setPeriodForm({ ...periodForm, time: e.target.value })}
                                        placeholder="১০:১৫ - ১১:০০ AM"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs flex items-center justify-between">
                                    <span>বিষয়ের নাম *</span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">ড্রপডাউন অথবা টাইপ</span>
                                </label>
                                <div className="space-y-1.5">
                                    <select
                                        value={
                                            (selectedClass === "class_9" || selectedClass === "class_10" ? routineSubjectsSenior : routineSubjectsJunior).includes(periodForm.subject)
                                                ? periodForm.subject
                                                : (periodForm.subject ? "__custom__" : "")
                                        }
                                        onChange={(e) => {
                                            if (e.target.value !== "__custom__" && e.target.value !== "") {
                                                setPeriodForm({ ...periodForm, subject: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 cursor-pointer font-medium"
                                    >
                                        <option value="">-- ড্রপডাউন থেকে বিষয় সিলেক্ট করুন --</option>
                                        {(selectedClass === "class_9" || selectedClass === "class_10" ? routineSubjectsSenior : routineSubjectsJunior).map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                        <option value="__custom__">অন্যান্য বিষয় / ম্যানুয়াল টাইপ...</option>
                                    </select>
                                    <input
                                        type="text"
                                        required
                                        value={periodForm.subject}
                                        onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })}
                                        placeholder="অথবা সরাসরি বিষয়ের নাম লিখুন (উদাঃ সাধারণ গণিত)"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs flex items-center justify-between">
                                        <span>দায়িত্বপ্রাপ্ত শিক্ষক *</span>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">ড্রপডাউন</span>
                                    </label>
                                    <div className="space-y-1.5">
                                        <select
                                            value={routineTeachers.includes(periodForm.teacher) ? periodForm.teacher : (periodForm.teacher ? "__custom__" : "")}
                                            onChange={(e) => {
                                                if (e.target.value !== "__custom__" && e.target.value !== "") {
                                                    setPeriodForm({ ...periodForm, teacher: e.target.value });
                                                }
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 cursor-pointer font-medium"
                                        >
                                            <option value="">-- শিক্ষক সিলেক্ট করুন --</option>
                                            {routineTeachers.map((tea) => (
                                                <option key={tea} value={tea}>{tea}</option>
                                            ))}
                                            <option value="__custom__">অন্যান্য শিক্ষক / কাস্টম নাম...</option>
                                        </select>
                                        <input
                                            type="text"
                                            required
                                            value={periodForm.teacher}
                                            onChange={(e) => setPeriodForm({ ...periodForm, teacher: e.target.value })}
                                            placeholder="অথবা শিক্ষকের নাম লিখুন"
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs flex items-center justify-between">
                                        <span>কক্ষ নং</span>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">সিলেক্ট / রুম</span>
                                    </label>
                                    <div className="space-y-1.5">
                                        <select
                                            value={routineRooms.includes(periodForm.room) ? periodForm.room : (periodForm.room ? "__custom__" : "")}
                                            onChange={(e) => {
                                                if (e.target.value !== "__custom__" && e.target.value !== "") {
                                                    setPeriodForm({ ...periodForm, room: e.target.value });
                                                }
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 cursor-pointer font-medium"
                                        >
                                            <option value="">-- কক্ষ নির্বাচন করুন --</option>
                                            {routineRooms.map((rm) => (
                                                <option key={rm} value={rm}>{rm}</option>
                                            ))}
                                            <option value="__custom__">অন্যান্য কক্ষ...</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={periodForm.room}
                                            onChange={(e) => setPeriodForm({ ...periodForm, room: e.target.value })}
                                            placeholder="যেমন: ১০১ / বিজ্ঞান ল্যাব"
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setPeriodModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassRoutinePage;
