import React from "react";
import { PhoneCall, ShieldAlert, HeartHandshake, AlertTriangle, CloudRain, LifeBuoy } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const EmergencyHotlinesWidget = () => {
    const { lang } = useLanguage();

    const hotlines = [
        {
            number: lang === "bn" ? "৩৩৩" : "333",
            title: lang === "bn" ? "সরকারি তথ্য ও সেবা" : "Government Info & Service",
            sub: lang === "bn" ? "সবসময়" : "24/7 Service",
            color: "from-purple-600 to-indigo-700",
            borderColor: "border-purple-200 dark:border-purple-900/50",
            badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
            icon: LifeBuoy,
            tel: "333"
        },
        {
            number: lang === "bn" ? "৯৯৯" : "999",
            title: lang === "bn" ? "জাতীয় জরুরি সেবা" : "National Emergency",
            sub: lang === "bn" ? "পুলিশ • ফায়ার • এ্যাম্বুলেন্স" : "Police • Fire • Ambulance",
            color: "from-red-600 to-rose-700",
            borderColor: "border-red-200 dark:border-red-900/50",
            badgeBg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
            icon: ShieldAlert,
            tel: "999"
        },
        {
            number: lang === "bn" ? "১০৯" : "109",
            title: lang === "bn" ? "নারী ও শিশু নির্যাতন প্রতিরোধে" : "Women & Child Anti-Violence",
            sub: lang === "bn" ? "টোল ফ্রি কল বা SMS" : "Toll Free Call or SMS",
            color: "from-amber-500 to-orange-600",
            borderColor: "border-amber-200 dark:border-amber-900/50",
            badgeBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
            icon: HeartHandshake,
            tel: "109"
        },
        {
            number: lang === "bn" ? "১০৬" : "106",
            title: lang === "bn" ? "দুদক হটলাইন" : "Anti-Corruption Hotline",
            sub: lang === "bn" ? "দুর্নীতি দমন কমিশন" : "ACC Help Desk",
            color: "from-blue-600 to-cyan-700",
            borderColor: "border-blue-200 dark:border-blue-900/50",
            badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
            icon: AlertTriangle,
            tel: "106"
        },
        {
            number: lang === "bn" ? "১০৯০" : "1090",
            title: lang === "bn" ? "দুর্যোগের আগাম বার্তা" : "Disaster Early Warning",
            sub: lang === "bn" ? "আবহাওয়া ও বন্যা পূর্বাভাস" : "Weather & Flood Forecast",
            color: "from-emerald-600 to-teal-700",
            borderColor: "border-emerald-200 dark:border-emerald-900/50",
            badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
            icon: CloudRain,
            tel: "1090"
        },
        {
            number: lang === "bn" ? "১০৯৮" : "1098",
            title: lang === "bn" ? "শিশুর সহায়তায় ফোন" : "Child Helpline",
            sub: lang === "bn" ? "চাইল্ড হেল্পলাইন বাংলাদেশ" : "Child Helpline Bangladesh",
            color: "from-sky-500 to-blue-600",
            borderColor: "border-sky-200 dark:border-sky-900/50",
            badgeBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
            icon: PhoneCall,
            tel: "1098"
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 transition-all">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                    <PhoneCall className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                        {lang === "bn" ? "জাতীয় জরুরি সেবা" : "National Emergency Services"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                        {lang === "bn" ? "টোল-ফ্রি হেল্পলাইন নম্বর" : "Toll-free helpline numbers"}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {hotlines.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                        <a
                            key={idx}
                            href={`tel:${item.tel}`}
                            className={`flex items-center justify-between p-2.5 rounded-xl border ${item.borderColor} bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                                        {item.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                        {item.sub}
                                    </div>
                                </div>
                            </div>
                            <span className={`text-base font-black px-2.5 py-0.5 rounded-lg ${item.badgeBg} group-hover:scale-105 transition-transform`}>
                                {item.number}
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default EmergencyHotlinesWidget;
