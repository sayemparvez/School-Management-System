import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Phone, Mail, Globe, Menu, X, ChevronDown, User, LogIn,
    GraduationCap, Bell, Shield, MapPin, Award, BookOpen, Clock, Users, Home, Info,
    Sun, Moon
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import ScrollToTop from "../../components/Public/ScrollToTop";

const PublicLayout = ({ children }) => {
    const { lang, toggleLanguage, t } = useLanguage();
    const { cms } = useCMS();
    const gData = cms?.general || {};
    const nData = cms?.emergency_notice || {};
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [teachersDropdownOpen, setTeachersDropdownOpen] = useState(false);
    const [studentsDropdownOpen, setStudentsDropdownOpen] = useState(false);
    const [resultsDropdownOpen, setResultsDropdownOpen] = useState(false);
    const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme === "dark";
        return document.documentElement.classList.contains("dark");
    });

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const getDashboardPath = () => {
        if (role === "admin") return "#/admin/dashboard";
        if (role === "faculty") return "#/faculty/dashboard";
        if (role === "student") return "#/student/dashboard";
        return "#/login";
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
            {/* 1. TOP UTILITY BAR (Compact & Sleek) */}
            <div className="print:hidden bg-emerald-800 text-emerald-50 text-[11px] py-1 px-4 sm:px-8 border-b border-emerald-900/40">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    {/* Notice Ticker */}
                    {(nData.is_active ?? true) && (
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <span className="flex items-center gap-1 bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wide flex-shrink-0 animate-pulse">
                                <Bell className="w-3 h-3" />
                                {t("emergencyNotice")}
                            </span>
                            <div className="overflow-hidden whitespace-nowrap text-emerald-100 text-[11px] font-medium">
                                <marquee
                                    scrollamount="5"
                                    onMouseEnter={(e) => e.target.stop()}
                                    onMouseLeave={(e) => e.target.start()}
                                    className="cursor-pointer hover:underline"
                                    title="মাউস রাখলে নোটিশ পড়া যাবে"
                                >
                                    {lang === "bn"
                                        ? (nData.notice_bn || "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ে ২০২৬ শিক্ষাবর্ষের সকল শ্রেণির ক্লাস রুটিন, নোটিশ বোর্ড ও ভর্তি ফলাফল প্রকাশিত হয়েছে • সকল শিক্ষার্থী ও সম্মানিত শিক্ষকদের ডিজিটাল পোর্টালে স্বাগত।")
                                        : (nData.notice_en || "Class routine, notice board and academic updates for Academic Year 2026 published • Welcome all students and respected teachers to Dimla Govt Girls' High School Portal.")}
                                </marquee>
                            </div>
                        </div>
                    )}

                    {/* Quick Tools & Language Switcher */}
                    <div className="flex items-center justify-end gap-3 flex-shrink-0">
                        <div className="hidden lg:flex items-center gap-3 text-emerald-200 text-[11px]">
                            <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-300" /> {gData.phone || "০১৭১২-৩৪৫৬৭৮"}
                            </span>
                            <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-emerald-300" /> {gData.email || "dimlagovtgirlshighschool@gmail.com"}
                            </span>
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-600 px-2 py-0.5 rounded-full text-white font-semibold transition-all border border-emerald-600/60 shadow-xs text-[10.5px] cursor-pointer active:scale-95"
                            title="Toggle Bangla / English"
                        >
                            <Globe className="w-3 h-3 text-emerald-300" />
                            <span>{lang === "bn" ? "English" : "বাংলা"}</span>
                        </button>

                        {/* Theme Toggle (Light / Dark) */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 px-2.5 py-0.5 rounded-full text-white font-semibold transition-all border border-emerald-600/60 shadow-xs text-[10.5px] cursor-pointer active:scale-95"
                            title={isDark ? "লাইট মোড চালু করুন (Switch to Light Mode)" : "ডার্ক মোড চালু করুন (Switch to Dark Mode)"}
                            aria-label="Toggle Theme"
                        >
                            {isDark ? (
                                <>
                                    <Sun className="w-3 h-3 text-amber-300" />
                                    <span>Light</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-3 h-3 text-emerald-200" />
                                    <span>Dark</span>
                                </>
                            )}
                        </button>

                        {/* If Logged in: Dashboard button */}
                        {token && (
                            <a
                                href={getDashboardPath()}
                                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-2.5 py-0.5 rounded-full shadow-xs transition-all text-[11px]"
                            >
                                <User className="w-3 h-3" />
                                <span>{t("myDashboard")}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. INSTITUTIONAL BRAND HEADER (Sleek & Compact) */}
            <header className="print:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3">
                    {/* Logo & School Name */}
                    <div className="flex items-center gap-3.5 text-center md:text-left">
                        {/* School Crest / Emblem */}
                        <a href="#/" className="relative group flex-shrink-0" title="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-600 to-teal-700 p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform bg-white">
                                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-0.5 overflow-hidden">
                                    <img
                                        src="/logo.png"
                                        alt="ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় লোগো"
                                        className="w-full h-full object-contain rounded-xl"
                                    />
                                </div>
                            </div>
                        </a>

                        {/* Title Block */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-900 dark:text-emerald-400 tracking-tight">
                                    {lang === "bn" ? (gData.school_name_bn || t("schoolName")) : (gData.school_name_en || t("schoolNameEn"))}
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                                {gData.school_name_en || t("schoolNameEn")}
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap justify-center md:justify-start mt-0.5 font-medium">
                                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                                    <Award className="w-3 h-3" />
                                    {lang === "bn" ? `ইআইআইএন: ${gData.eiin || t("eiin")}` : `EIIN: ${gData.eiin || t("eiin")}`}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-red-500" />
                                    {lang === "bn" ? (gData.address_bn || t("schoolAddress")) : (gData.address_en || t("schoolAddress"))}
                                </span>
                                <span>•</span>
                                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                    {gData.board_name || (lang === "bn" ? "সরকারি" : "Government")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Slogan & Government Recognition Pill */}
                    <div className="hidden md:flex flex-col items-end text-right">
                        <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                {lang === "bn" ? (gData.slogan_bn || t("slogan")) : (gData.slogan_en || t("slogan"))}
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">
                            {gData.board_name || "Dinajpur Education Board"} • Code: {gData.eiin || "124754"}
                        </span>
                    </div>
                </div>
            </header>

            {/* 3. PRIMARY NAVIGATION BAR */}
            <nav className="print:hidden bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 text-white sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1 text-xs font-semibold py-1">
                        {/* 1. Home */}
                        <a
                            href="#/"
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all ${
                                isActive("/") ? "bg-white/20 text-white shadow-inner font-bold" : "hover:bg-white/10 text-emerald-50"
                            }`}
                        >
                            <Home className="w-3.5 h-3.5" />
                            {t("navHome")}
                        </a>

                        {/* 2. About Us Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setAboutDropdownOpen(true)}
                            onMouseLeave={() => setAboutDropdownOpen(false)}
                        >
                            <button className="flex items-center gap-1 px-3 py-2.5 rounded-lg hover:bg-white/10 text-emerald-50 transition-all">
                                <Info className="w-3.5 h-3.5" />
                                {t("navAbout")}
                                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                            </button>
                            {aboutDropdownOpen && (
                                <div className="absolute left-0 top-full w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-slate-700 dark:text-slate-200 z-50">
                                    <a
                                        href="#/principal-message"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-bold text-emerald-800 dark:text-emerald-300"
                                    >
                                        {lang === "bn" ? "প্রতিষ্ঠান প্রধানের বাণী" : "Head Teacher's Message"}
                                    </a>
                                    <a
                                        href="#/at-a-glance"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navAtAGlance")}
                                    </a>
                                    <a
                                        href="#/history"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navHistory")}
                                    </a>
                                    <a
                                        href="#/committee"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navCommittee")}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 3. Teachers & Staff Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setTeachersDropdownOpen(true)}
                            onMouseLeave={() => setTeachersDropdownOpen(false)}
                        >
                            <button className="flex items-center gap-1 px-3 py-2.5 rounded-lg hover:bg-white/10 text-emerald-50 transition-all">
                                <Users className="w-3.5 h-3.5" />
                                {t("navTeachersStaff")}
                                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                            </button>
                            {teachersDropdownOpen && (
                                <div className="absolute left-0 top-full w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-slate-700 dark:text-slate-200 z-50">
                                    <a
                                        href="#/teachers"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navTeachers")}
                                    </a>
                                    <a
                                        href="#/staff"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navStaff")}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 4. Students Corner Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setStudentsDropdownOpen(true)}
                            onMouseLeave={() => setStudentsDropdownOpen(false)}
                        >
                            <button className="flex items-center gap-1 px-3 py-2.5 rounded-lg hover:bg-white/10 text-emerald-50 transition-all">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {t("navStudentsCorner")}
                                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                            </button>
                            {studentsDropdownOpen && (
                                <div className="absolute left-0 top-full w-60 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-slate-700 dark:text-slate-200 z-50">
                                    <a
                                        href="#/student-statistics"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navStudentStats")}
                                    </a>
                                    <a
                                        href="#/class-routine"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-bold text-emerald-700 dark:text-emerald-400"
                                    >
                                        • {lang === "bn" ? "ক্লাস রুটিন" : "Class Routine"}
                                    </a>
                                    <a
                                        href="#/student-list"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navStudentList")}
                                    </a>
                                    <a
                                        href="#/student-fees"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-bold text-emerald-700 dark:text-emerald-400"
                                    >
                                        • {lang === "bn" ? "শিক্ষার্থী ফি ও রসিদ" : "Student Fees & Receipt"}
                                    </a>
                                    <a
                                        href="#/achievers"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors"
                                    >
                                        {t("navAchievers")}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 4.5 Exam Results Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setResultsDropdownOpen(true)}
                            onMouseLeave={() => setResultsDropdownOpen(false)}
                        >
                            <button className="flex items-center gap-1 px-3 py-2.5 rounded-lg hover:bg-white/10 text-emerald-50 transition-all font-bold text-amber-300">
                                <Award className="w-3.5 h-3.5 text-amber-300" />
                                {t("navExamResults")}
                                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                            </button>
                            {resultsDropdownOpen && (
                                <div className="absolute left-0 top-full w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-slate-700 dark:text-slate-200 z-50">
                                    <a
                                        href="#/results/public"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-medium"
                                    >
                                        • {t("navPublicExam")}
                                    </a>
                                    <a
                                        href="#/results/internal"
                                        className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-bold text-emerald-600 dark:text-emerald-400"
                                    >
                                        • {t("navInternalExam")} (মার্কশিট)
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 5. Notice Board */}
                        <a
                            href="#/notices"
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all ${
                                isActive("/notices") ? "bg-white/20 text-white font-bold" : "hover:bg-white/10 text-emerald-50"
                            }`}
                        >
                            <Bell className="w-3.5 h-3.5" />
                            {t("navNotices")}
                        </a>

                        {/* 6. Contact */}
                        <a
                            href="#/contact"
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all ${
                                isActive("/contact") ? "bg-white/20 text-white font-bold" : "hover:bg-white/10 text-emerald-50"
                            }`}
                        >
                            <Phone className="w-3.5 h-3.5" />
                            {t("navContact")}
                        </a>
                    </div>

                    {/* Right Login Dropdown (Student & Teacher login in dropdown) */}
                    <div
                        className="hidden lg:relative lg:block"
                        onMouseEnter={() => setLoginDropdownOpen(true)}
                        onMouseLeave={() => setLoginDropdownOpen(false)}
                    >
                        <button
                            onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-all hover:scale-105"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>{lang === "bn" ? "লগইন পোর্টাল" : "Login Portal"}</span>
                            <ChevronDown className="w-3 h-3 transition-transform" />
                        </button>

                        {loginDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-slate-700 dark:text-slate-200 z-50">
                                <a
                                    href="#/login?role=student"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-medium text-xs"
                                >
                                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                                    <span>{t("navStudentLogin")}</span>
                                </a>
                                <a
                                    href="#/login?role=faculty"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition-colors font-medium text-xs"
                                >
                                    <Users className="w-4 h-4 text-teal-600" />
                                    <span>{t("navTeacherLogin")}</span>
                                </a>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                <a
                                    href="#/login?role=admin"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors font-medium text-xs"
                                >
                                    <Shield className="w-4 h-4 text-indigo-600" />
                                    <span>{lang === "bn" ? "অ্যাডমিন লগইন (ERP)" : "Admin Login (ERP)"}</span>
                                </a>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                <a
                                    href="#/cms/login"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs"
                                >
                                    <Globe className="w-4 h-4 text-emerald-600" />
                                    <span>{lang === "bn" ? "ওয়েবসাইট CMS কন্ট্রোল" : "Website CMS Control"}</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex lg:hidden items-center justify-between w-full py-2.5">
                        <span className="font-bold text-xs text-emerald-100 flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {t("schoolName")}
                        </span>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-900 text-white"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Slide-down Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-emerald-900 border-t border-emerald-800 px-4 py-3 space-y-2 text-xs font-medium">
                        {/* Quick Language & Theme Controls for Mobile */}
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-all border border-emerald-700"
                            >
                                <Globe className="w-3.5 h-3.5 text-emerald-300" />
                                <span>{lang === "bn" ? "English" : "বাংলা"}</span>
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-all border border-emerald-700"
                            >
                                {isDark ? (
                                    <>
                                        <Sun className="w-3.5 h-3.5 text-amber-300" />
                                        <span>Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-3.5 h-3.5 text-emerald-200" />
                                        <span>Dark Mode</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <a
                            href="#/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 rounded hover:bg-emerald-800"
                        >
                            {t("navHome")}
                        </a>
                        <div className="pl-3 border-l-2 border-emerald-700 space-y-1">
                            <span className="text-emerald-300 font-bold uppercase text-[10px] block py-1">
                                {t("navAbout")}
                            </span>
                            <a href="#/at-a-glance" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navAtAGlance")}
                            </a>
                            <a href="#/history" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navHistory")}
                            </a>
                            <a href="#/committee" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navCommittee")}
                            </a>
                        </div>

                        <div className="pl-3 border-l-2 border-emerald-700 space-y-1">
                            <span className="text-emerald-300 font-bold uppercase text-[10px] block py-1">
                                {t("navTeachersStaff")}
                            </span>
                            <a href="#/teachers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navTeachers")}
                            </a>
                            <a href="#/staff" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navStaff")}
                            </a>
                        </div>

                        <div className="pl-3 border-l-2 border-emerald-700 space-y-1">
                            <span className="text-emerald-300 font-bold uppercase text-[10px] block py-1">
                                {t("navStudentsCorner")}
                            </span>
                            <a href="#/student-statistics" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navStudentStats")}
                            </a>
                            <a href="#/class-routine" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-emerald-300 font-bold hover:text-white">
                                • {lang === "bn" ? "ক্লাস রুটিন" : "Class Routine"}
                            </a>
                            <a href="#/student-list" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navStudentList")}
                            </a>
                            <a href="#/student-fees" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-emerald-300 font-bold hover:text-white">
                                • {lang === "bn" ? "শিক্ষার্থী ফি ও রসিদ" : "Student Fees & Receipt"}
                            </a>
                            <a href="#/achievers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
                                • {t("navAchievers")}
                            </a>
                        </div>

                        <a
                            href="#/notices"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 rounded hover:bg-emerald-800"
                        >
                            {t("navNotices")}
                        </a>
                        <a
                            href="#/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 rounded hover:bg-emerald-800"
                        >
                            {t("navContact")}
                        </a>

                        <div className="pt-2 border-t border-emerald-800 flex gap-2">
                            <a
                                href="#/login?role=student"
                                className="flex-1 text-center py-2 bg-emerald-600 rounded font-bold text-white"
                            >
                                {t("navStudentLogin")}
                            </a>
                            <a
                                href="#/login?role=faculty"
                                className="flex-1 text-center py-2 bg-amber-500 rounded font-bold text-slate-900"
                            >
                                {t("navTeacherLogin")}
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* 4. MAIN PAGE BODY */}
            <main className="flex-1">
                {children}
            </main>

            {/* 5. INSTITUTIONAL FOOTER */}
            <footer className="print:hidden bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Col 1: About School */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-xl bg-white p-0.5 overflow-hidden shadow-sm flex items-center justify-center shrink-0 border border-slate-700">
                                <img src="/logo.png" alt="School Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">
                                    {t("schoolName")}
                                </h4>
                                <p className="text-[10px] text-emerald-400">
                                    EIIN: {t("eiin")} • Est. {t("estYear")}
                                </p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-justify text-[11px] leading-relaxed">
                            {t("footerAboutText")}
                        </p>
                    </div>

                    {/* Col 2: Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm border-l-2 border-emerald-500 pl-2">
                            {t("quickLinks")}
                        </h4>
                        <ul className="space-y-1.5 text-[11px]">
                            <li>
                                <a href="#/at-a-glance" className="hover:text-emerald-400 transition-colors">
                                    • {t("navAtAGlance")}
                                </a>
                            </li>
                            <li>
                                <a href="#/history" className="hover:text-emerald-400 transition-colors">
                                    • {t("navHistory")}
                                </a>
                            </li>
                            <li>
                                <a href="#/teachers" className="hover:text-emerald-400 transition-colors">
                                    • {t("navTeachers")}
                                </a>
                            </li>
                            <li>
                                <a href="#/student-list" className="hover:text-emerald-400 transition-colors">
                                    • {t("navStudentList")}
                                </a>
                            </li>
                            <li>
                                <a href="#/notices" className="hover:text-emerald-400 transition-colors">
                                    • {t("navNotices")}
                                </a>
                            </li>
                            <li>
                                <a href="#/login" className="hover:text-emerald-400 transition-colors font-semibold text-amber-400">
                                    • {lang === "bn" ? "ম্যানেজমেন্ট সিস্টেম লগইন" : "Management System Login"}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Government Portals */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm border-l-2 border-emerald-500 pl-2">
                            {lang === "bn" ? "গুরুত্বপূর্ণ বাতায়ন" : "Important Portals"}
                        </h4>
                        <ul className="space-y-1.5 text-[11px]">
                            <li>
                                <a href="https://bangladesh.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                                    • বাংলাদেশ জাতীয় তথ্য বাতায়ন
                                </a>
                            </li>
                            <li>
                                <a href="https://moedu.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                                    • শিক্ষা মন্ত্রণালয় (Ministry of Education)
                                </a>
                            </li>
                            <li>
                                <a href="https://dshe.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                                    • মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)
                                </a>
                            </li>
                            <li>
                                <a href="https://dinajpureducationboard.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                                    • দিনাজপুর শিক্ষা বোর্ড
                                </a>
                            </li>
                            <li>
                                <a href="https://teachers.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                                    • শিক্ষক বাতায়ন
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Contact Details */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm border-l-2 border-emerald-500 pl-2">
                            {t("contactInfo")}
                        </h4>
                        <div className="space-y-2 text-[11px] text-slate-300">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{t("schoolAddress")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>০১৭১২-৩৪৫৬৭৮</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="truncate">dimlagovtgirlshighschool@gmail.com</span>
                            </div>
                            <div className="pt-2">
                                <a
                                    href="#/login"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] transition-all"
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    {lang === "bn" ? "অফিসিয়াল পোর্টাল লগইন" : "Official Portal Login"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 sm:px-8 text-center text-slate-400 text-[11px]">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p>{t("copyright")}</p>
                        <p className="text-slate-500">
                            {lang === "bn" ? "পরিকল্পনা ও বাস্তবায়নে: বিদ্যালয় আইসিটি সেল" : "Designed & Maintained by School ICT Cell"}
                        </p>
                    </div>
                </div>
            </footer>

            {/* Advanced Floating Back To Top Button */}
            <ScrollToTop />
        </div>
    );
};

export default PublicLayout;
