import React from "react";
import { Users, LogIn, UserPlus, Award, FileCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const StudentCornerWidget = () => {
    const { lang } = useLanguage();

    const buttons = [
        {
            title: lang === "bn" ? "শিক্ষার্থী প্রোফাইল লগইন" : "Student Profile Login",
            icon: LogIn,
            href: "#/login?role=student",
            bgClass: "bg-[#10375c] hover:bg-[#0c2946] text-white shadow-sm shadow-slate-900/20"
        },
        {
            title: lang === "bn" ? "অনলাইন ভর্তি" : "Online Admission",
            icon: UserPlus,
            href: "#/student-list",
            bgClass: "bg-[#0e7845] hover:bg-[#0b5f36] text-white shadow-sm shadow-green-900/20"
        },
        {
            title: "Certificates",
            icon: FileCheck,
            href: "#/verify/marksheet/demo",
            bgClass: "bg-[#1548b8] hover:bg-[#103a94] text-white shadow-sm shadow-blue-900/20"
        },
        {
            title: "Exam Results",
            icon: Award,
            href: "#/results/internal",
            bgClass: "bg-[#aa460c] hover:bg-[#863709] text-white shadow-sm shadow-amber-900/20"
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all group hover:shadow-md">
            {/* Header matching Image 3 */}
            <div className="bg-[#10375c] text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-300" />
                    <h3 className="font-bold text-sm tracking-wide">
                        {lang === "bn" ? "স্টুডেন্ট কর্নার" : "Student Corner"}
                    </h3>
                </div>
            </div>

            {/* 4 Stacked Buttons matching Image 3 */}
            <div className="p-4 space-y-2.5">
                {buttons.map((btn, idx) => {
                    const IconComponent = btn.icon;
                    return (
                        <a
                            key={idx}
                            href={btn.href}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-center transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${btn.bgClass}`}
                        >
                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                            <span>{btn.title}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentCornerWidget;
