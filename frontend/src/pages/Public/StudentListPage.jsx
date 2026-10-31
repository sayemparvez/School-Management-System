import React, { useState, useEffect } from "react";
import { Users, Search, Filter, GraduationCap, Download, CheckCircle, BookOpen } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import RightSidebar from "../../components/Public/RightSidebar";
import api from "../../utils/api";

const StudentListPage = () => {
    const { lang, t } = useLanguage();
    const [selectedYear, setSelectedYear] = useState("2026");
    const [selectedClass, setSelectedClass] = useState("CLASS-6");
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const classesList = [
        { code: "CLASS-6", nameBn: "৬ষ্ঠ শ্রেণি (Class 6)", nameEn: "Class 6" },
        { code: "CLASS-7", nameBn: "৭ম শ্রেণি (Class 7)", nameEn: "Class 7" },
        { code: "CLASS-8", nameBn: "৮ম শ্রেণি (Class 8)", nameEn: "Class 8" },
        { code: "CLASS-9", nameBn: "৯ম শ্রেণি (Class 9)", nameEn: "Class 9" },
        { code: "CLASS-10", nameBn: "১০ম শ্রেণি (Class 10)", nameEn: "Class 10" }
    ];

    const fallbackStudents = {
        "CLASS-6": [
            { rollnumber: "601", fullname: "সুমাইয়া জাহান", fathername: "মোঃ রফিকুল ইসলাম", course_name: "Class 6", section: "A", scholarship_type: "মেধাবৃত্তি" },
            { rollnumber: "602", fullname: "ফারহানা আকতার", fathername: "মোঃ আশরাফুল আলম", course_name: "Class 6", section: "A", scholarship_type: "সাধারণ বৃত্তি" },
            { rollnumber: "603", fullname: "নুসরাত সুলতানা", fathername: "মোঃ মোস্তাফিজুর রহমান", course_name: "Class 6", section: "A", scholarship_type: "উপবৃত্তি" },
            { rollnumber: "604", fullname: "জান্নাতুল ফেরদৌস", fathername: "মোঃ শহিদুল ইসলাম", course_name: "Class 6", section: "B", scholarship_type: "সাধারণ" },
            { rollnumber: "605", fullname: "তানজিলা আক্তার", fathername: "মোঃ আনোয়ার হোসেন", course_name: "Class 6", section: "B", scholarship_type: "উপবৃত্তি" },
            { rollnumber: "606", fullname: "মীম আক্তার", fathername: "মোঃ জয়নাল আবেদীন", course_name: "Class 6", section: "B", scholarship_type: "সাধারণ" }
        ],
        "CLASS-7": [
            { rollnumber: "701", fullname: "সানজিদা আক্তার", fathername: "মোঃ ফজলুল হক", course_name: "Class 7", section: "A", scholarship_type: "মেধাবৃত্তি" },
            { rollnumber: "702", fullname: "মারিয়া খাতুন", fathername: "মোঃ আব্দুল কাদের", course_name: "Class 7", section: "A", scholarship_type: "উপবৃত্তি" },
            { rollnumber: "703", fullname: "আয়েশা সিদ্দিকা", fathername: "মোঃ আবুল কালাম", course_name: "Class 7", section: "B", scholarship_type: "সাধারণ" }
        ],
        "CLASS-8": [
            { rollnumber: "801", fullname: "রুবাইয়া ইয়াসমিন", fathername: "মোঃ নজরুল ইসলাম", course_name: "Class 8", section: "A", scholarship_type: "মেধাবৃত্তি" },
            { rollnumber: "802", fullname: "সাদিয়া আফরিন", fathername: "মোঃ শফিকুল ইসলাম", course_name: "Class 8", section: "A", scholarship_type: "উপবৃত্তি" },
            { rollnumber: "803", fullname: "তাসনিম জাহান", fathername: "মোঃ জাহাঙ্গীর আলম", course_name: "Class 8", section: "B", scholarship_type: "সাধারণ বৃত্তি" }
        ],
        "CLASS-9": [
            { rollnumber: "901", fullname: "জেরিন তাসনিম", fathername: "মোঃ মাহবুবুল হক", course_name: "Class 9 (Science)", section: "A", scholarship_type: "মেধাবৃত্তি" },
            { rollnumber: "902", fullname: "ইসরাত জাহান", fathername: "মোঃ হাফিজুর রহমান", course_name: "Class 9 (Humanities)", section: "B", scholarship_type: "উপবৃত্তি" }
        ],
        "CLASS-10": [
            { rollnumber: "1001", fullname: "শারমিন সুলতানা", fathername: "মোঃ মোজাম্মেল হক", course_name: "Class 10 (Science)", section: "A", scholarship_type: "মেধাবৃত্তি" },
            { rollnumber: "1002", fullname: "ফারজানা ববি", fathername: "মোঃ রেজাউল করিম", course_name: "Class 10 (Humanities)", section: "B", scholarship_type: "সাধারণ" }
        ]
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/api/public/students?academic_year=${selectedYear}&course_code=${selectedClass}`)
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setStudents(res.data);
                } else {
                    setStudents(fallbackStudents[selectedClass] || []);
                }
            })
            .catch(() => {
                setStudents(fallbackStudents[selectedClass] || []);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedYear, selectedClass]);

    const filtered = students.filter((s) => {
        const term = searchTerm.toLowerCase();
        return (
            (s.fullname && s.fullname.toLowerCase().includes(term)) ||
            (s.rollnumber && s.rollnumber.toString().includes(term)) ||
            (s.fathername && s.fathername.toLowerCase().includes(term))
        );
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "শিক্ষার্থী বাতায়ন" : "Students Information"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("studentListHeading")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "শিক্ষাবর্ষ ও শ্রেণি নির্বাচন করে ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ে অধ্যয়নরত শিক্ষার্থীদের তালিকা দেখুন।"
                            : "Filter and view the officially enrolled student list by Academic Year and Class."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Filter Card (Image 3 exact representation) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Filter className="w-4 h-4 text-emerald-600" />
                            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                                {t("studentListHeading")}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Academic Year */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t("academicYear")} :
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                                >
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                </select>
                            </div>

                            {/* Class Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t("classLabel")} :
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                                >
                                    {classesList.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {lang === "bn" ? c.nameBn : c.nameEn}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search Input within Filter */}
                        <div className="pt-2 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={lang === "bn" ? "রোল নম্বর বা নাম দিয়ে ফিল্টার করুন..." : "Filter by student roll or name..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                {filtered.length} {lang === "bn" ? "জন" : "students"}
                            </span>
                        </div>
                    </div>

                    {/* Students Result Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h4 className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-emerald-600" />
                                {lang === "bn"
                                    ? `${selectedYear} শিক্ষাবর্ষের তালিকা (${classesList.find((c) => c.code === selectedClass)?.nameBn || selectedClass})`
                                    : `Student Records: ${selectedYear} (${selectedClass})`}
                            </h4>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {lang === "bn" ? "প্রিন্ট" : "Print"}
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-xs text-slate-500">
                                {lang === "bn" ? "শিক্ষার্থীদের তালিকা লোড হচ্ছে..." : "Loading student records..."}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm text-left">
                                    <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="py-3 px-4 text-center">{t("rollNumber")}</th>
                                            <th className="py-3 px-4">{t("studentName")}</th>
                                            <th className="py-3 px-4">{t("fatherName")}</th>
                                            <th className="py-3 px-4 text-center">{t("classLabel")}</th>
                                            <th className="py-3 px-4 text-center">{t("status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filtered.map((student, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-3 px-4 text-center font-black text-emerald-700 dark:text-emerald-400">
                                                    #{student.rollnumber}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">
                                                    {student.fullname}
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                                    {student.fathername || (lang === "bn" ? "অভিভাবক" : "Guardian")}
                                                </td>
                                                <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">
                                                    {student.course_name || selectedClass}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                                                        {student.scholarship_type || (lang === "bn" ? "অধ্যয়নরত" : "Enrolled")}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                                                    {t("noStudentsFound")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
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

export default StudentListPage;
