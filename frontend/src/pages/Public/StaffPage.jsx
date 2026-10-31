import React from "react";
import { Users, Phone, Mail, Award, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";
import { resolveMediaUrl } from "../../utils/imageOptimizer";

const StaffPage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();

    const defaultStaffList = [
        {
            name: lang === "bn" ? "মোঃ মোখলেছুর রহমান" : "Md. Mokhlesur Rahman",
            designation: lang === "bn" ? "প্রধান অফিস সহকারী" : "Head Office Assistant",
            qualification: "B.A",
            phone: "০১৭৮৯-১২৩৪৫৬",
            email: "office.dimlagirls@gmail.com",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মোঃ হাবিবুর রহমান" : "Md. Habibur Rahman",
            designation: lang === "bn" ? "হিসাব সহকারী" : "Accounts Assistant",
            qualification: "B.Com (Accounting)",
            phone: "০১৭৯০-২৩৪৫৬৭",
            email: "accounts.dimlagirls@gmail.com",
            image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মোছাঃ মমতাজ বেগম" : "Mst. Momtaz Begum",
            designation: lang === "bn" ? "লাইব্রেরি সহকারী" : "Library Assistant",
            qualification: "Diploma in Library Science",
            phone: "০১৭০১-৩৪৫৬৭৮",
            email: "library.dimlagirls@gmail.com",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মোঃ এনামুল হক" : "Md. Enamul Haque",
            designation: lang === "bn" ? "ল্যাব সহকারী (বিজ্ঞান)" : "Lab Assistant (Science)",
            qualification: "H.S.C (Science)",
            phone: "০১৭১২-৪৫৬৭৮৯",
            email: "lab.dimlagirls@gmail.com",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মোঃ আমিনুল ইসলাম" : "Md. Aminul Islam",
            designation: lang === "bn" ? "অফিস সহায়ক (MLSS)" : "Office Support Staff",
            qualification: "S.S.C",
            phone: "০১৭২৩-৫৬৭৮৯০",
            email: "support1.dimlagirls@gmail.com",
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মোঃ কাশেম আলী" : "Md. Kashem Ali",
            designation: lang === "bn" ? "নিরাপত্তা প্রহরী" : "Security Guard",
            qualification: "Eight Pass",
            phone: "০১৭৩৪-৬৭৮৯০১",
            email: "security.dimlagirls@gmail.com",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
        }
    ];

    const activeStaffList = (cms?.staff && Array.isArray(cms.staff) && cms.staff.length > 0)
        ? cms.staff.map(s => ({
            name: s.name || (lang === "bn" ? s.name_bn : s.name_en) || "",
            designation: s.designation || (lang === "bn" ? s.designation_bn : s.designation_en) || "অফিস কর্মী",
            qualification: s.qualification || "",
            phone: s.phone || "",
            email: s.email || "",
            image: s.image || s.image_url || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
        }))
        : defaultStaffList;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "অফিস ও প্রশাসন বাতায়ন" : "Administration & Staff"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navStaff")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের প্রশাসনিক ও অফিস পরিচালনায় কর্মরত কর্মকর্তা ও কর্মচারীবৃন্দ।"
                            : "Support and administrative personnel serving Dimla Government Girls' High School."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeStaffList.map((staff, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-teal-500/40 p-0.5 group-hover:scale-105 transition-transform bg-slate-50">
                                        <img
                                            src={resolveMediaUrl(staff.image)}
                                            alt={staff.name}
                                            className="w-full h-full object-cover rounded-xl"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                            {staff.name}
                                        </h3>
                                        <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                                            {staff.designation}
                                        </p>
                                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {staff.qualification}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                                        <span>{staff.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                                        <span className="truncate">{staff.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
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

export default StaffPage;
