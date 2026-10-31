import React from "react";
import { Award, Building, BookOpen, GraduationCap, MapPin, Users, CheckCircle, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";

const AtAGlancePage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const gData = cms?.general || {};
    const info = cms?.institutional_info || {};

    const facts = [
        { label: lang === "bn" ? "প্রতিষ্ঠানের নাম" : "Institution Name", value: (lang === "bn" ? gData.school_name_bn : gData.school_name_en) || t("schoolName") },
        { label: lang === "bn" ? "ইংরেজিতে নাম" : "Name in English", value: gData.school_name_en || t("schoolNameEn") },
        { label: lang === "bn" ? "ইআইআইএন (EIIN)" : "EIIN", value: gData.eiin || t("eiin"), highlight: true },
        { label: lang === "bn" ? "স্থাপিত সাল" : "Established Year", value: lang === "bn" ? `${gData.est_year || "১৯৬৭"} খ্রিস্টাব্দ` : `${gData.est_year || "1967"} AD` },
        { label: lang === "bn" ? "প্রতিষ্ঠানের ধরন" : "Institution Type", value: (lang === "bn" ? info.institution_type_bn : info.institution_type_en) || (lang === "bn" ? "সরকারি বালিকা উচ্চ বিদ্যালয়" : "Government Girls' High School") },
        { label: lang === "bn" ? "শিক্ষা বোর্ড" : "Education Board", value: (lang === "bn" ? info.board_name_bn : info.board_name_en) || (lang === "bn" ? "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর" : "BISE Dinajpur") },
        { label: lang === "bn" ? "পাঠদানের স্তর" : "Academic Level", value: (lang === "bn" ? info.levels_bn : info.levels_en) || (lang === "bn" ? "৬ষ্ঠ শ্রেণি হতে ১০ম শ্রেণি" : "Class 6 to Class 10") },
        { label: lang === "bn" ? "বিভাগসমূহ (৯ম ও ১০ম)" : "Groups (Class 9 & 10)", value: (lang === "bn" ? info.groups_bn : info.groups_en) || (lang === "bn" ? "বিজ্ঞান ও মানবিক শাখা" : "Science & Humanities") },
        { label: lang === "bn" ? "শিফট" : "Shift", value: (lang === "bn" ? info.shift_bn : info.shift_en) || (lang === "bn" ? "দিবা শিফট (সকাল ৯:০০ - বিকাল ৪:০০)" : "Day Shift (9:00 AM - 4:00 PM)") },
        { label: lang === "bn" ? "মোট জমির পরিমাণ" : "Total Land Area", value: (lang === "bn" ? info.land_area_bn : info.land_area_en) || (lang === "bn" ? "২.৮৫ একর" : "2.85 Acres") },
        { label: lang === "bn" ? "পাকা ভবনের সংখ্যা" : "Building Count", value: (lang === "bn" ? info.building_count_bn : info.building_count_en) || (lang === "bn" ? "৩টি বহুতল ভবন" : "3 Multi-story Buildings") },
        { label: lang === "bn" ? "শ্রেণিকক্ষ সংখ্যা" : "Number of Classrooms", value: (lang === "bn" ? info.classroom_count_bn : info.classroom_count_en) || (lang === "bn" ? "১৮টি সুপরিসর শ্রেণিকক্ষ" : "18 Spacious Classrooms") },
        { label: lang === "bn" ? "আইসিটি ও কম্পিউটার ল্যাব" : "Computer Lab", value: (lang === "bn" ? info.computer_lab_bn : info.computer_lab_en) || (lang === "bn" ? "কম্পিউটার ল্যাব (২০টি আধুনিক কম্পিউটার)" : "Modern Computer Lab (20 PC)") },
        { label: lang === "bn" ? "বিজ্ঞানাগার" : "Science Laboratory", value: (lang === "bn" ? info.science_lab_bn : info.science_lab_en) || (lang === "bn" ? "১টি আধুনিক ও সমৃদ্ধ ল্যাবরেটরি" : "Fully Equipped Lab") },
        { label: lang === "bn" ? "পাঠাগার (লাইব্রেরি)" : "Library", value: (lang === "bn" ? info.library_bn : info.library_en) || (lang === "bn" ? "১টি সমৃদ্ধ পাঠাগার (৩,৫০০+ বই)" : "Enriched Library (3,500+ Books)") },
        { label: lang === "bn" ? "খেলার মাঠ" : "Playground", value: (lang === "bn" ? info.playground_bn : info.playground_en) || (lang === "bn" ? "প্রশস্ত খেলার মাঠ ও স্কাউট প্রাঙ্গণ" : "Spacious Playground") },
        { label: lang === "bn" ? "অবস্থান" : "Location", value: (lang === "bn" ? gData.address_bn : gData.address_en) || t("schoolAddress") }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "পরিচিতি বাতায়ন" : "Overview & Factsheet"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navAtAGlance")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের প্রাতিষ্ঠানিক তথ্য, সুযোগ-সুবিধা এবং পরিচিতির এক নজরে সারসংক্ষেপ।"
                            : "Comprehensive institutional factsheet and facilities overview of Dimla Government Girls' High School."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                                    {lang === "bn" ? "প্রাতিষ্ঠানিক তথ্যাবলী" : "Institutional Information"}
                                </h3>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 text-white rounded-full">
                                EIIN: {t("eiin")}
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                            {facts.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-6 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                                        item.highlight ? "bg-emerald-50/40 dark:bg-emerald-950/20 font-bold" : ""
                                    }`}
                                >
                                    <span className="text-slate-500 dark:text-slate-400 font-medium sm:w-2/5">
                                        {item.label}
                                    </span>
                                    <span className="text-slate-800 dark:text-slate-100 font-semibold sm:w-3/5 sm:text-right mt-1 sm:mt-0">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Facilities Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <Building className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                {lang === "bn" ? "আধুনিক অবকাঠামো" : "Modern Campus"}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                {lang === "bn" ? "৩টি পাকা ভবন ও ১৮টি ডিজিটাল শ্রেণিকক্ষ" : "3 multistory buildings & 18 classrooms"}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <BookOpen className="w-8 h-8 mx-auto text-teal-600 mb-2" />
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                {lang === "bn" ? "ডিজিটাল ল্যাব ও পাঠাগার" : "Labs & Library"}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                {lang === "bn" ? "কম্পিউটার ল্যাব ও ৩,৫০০+ বই" : "Modern computer lab & 3,500+ volumes"}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <GraduationCap className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                {lang === "bn" ? "সহশিক্ষা ও স্কাউটিং" : "Co-curricular"}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                {lang === "bn" ? "গার্ল গাইডস, বিজ্ঞান ক্লাব ও খেলাধুলা" : "Girl Guides, science club & sports"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (4 cols) */}
                <div className="lg:col-span-4">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default AtAGlancePage;
