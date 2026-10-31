import React from "react";
import { Sparkles } from "lucide-react";

const AdminPageHeader = ({
    badge = "একাডেমিক ইআরপি পোর্টাল",
    badgeIcon: BadgeIcon = Sparkles,
    title,
    subtitle,
    children,
    className = ""
}) => {
    return (
        <div className={`print:hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-500/20 mb-6 transition-all duration-300 ${className}`}>
            {/* Ambient Background Blur Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                        <BadgeIcon className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                        <span className="tracking-wide uppercase text-[11px] font-bold">{badge}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                            {subtitle}
                        </p>
                    )}
                </div>

                {children && (
                    <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;
