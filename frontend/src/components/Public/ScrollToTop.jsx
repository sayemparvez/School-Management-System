import React, { useState, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * ScrollToTop
 * Advanced Floating "Back to Top" Action with circular scroll progress ring,
 * live reading percentage, tooltip, and smooth glide animation.
 */
const ScrollToTop = () => {
    const { lang } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            setScrollProgress(Math.min(100, Math.max(0, progress)));
            setIsVisible(scrollTop > 280);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // SVG Circular Progress Calculations (radius = 20, circumference = 2 * PI * 20 ≈ 125.66)
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
                isVisible
                    ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                    : "opacity-0 translate-y-6 pointer-events-none scale-90"
            }`}
        >
            <div className="relative group">
                {/* Tooltip on Hover */}
                <div
                    className={`absolute bottom-full right-0 mb-2.5 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-semibold shadow-lg backdrop-blur-md whitespace-nowrap transition-all duration-200 pointer-events-none flex items-center gap-1.5 border border-slate-700/50 dark:border-slate-200/50 ${
                        isHovered
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-1 scale-95"
                    }`}
                >
                    <Sparkles className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
                    <span>{lang === "bn" ? "উপরে যান" : "Back to Top"}</span>
                    <span className="font-mono text-[10px] text-emerald-300 dark:text-emerald-700 bg-slate-800 dark:bg-slate-100 px-1.5 py-0.2 rounded-md">
                        {Math.round(scrollProgress)}%
                    </span>
                    <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-900/95 dark:border-t-white/95" />
                </div>

                {/* Circular Button */}
                <button
                    type="button"
                    onClick={scrollToTop}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label={lang === "bn" ? "শীর্ষে যান" : "Scroll to top"}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/35 border border-emerald-500/20 dark:border-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group focus:outline-hidden"
                >
                    {/* SVG Circular Progress Track & Fill */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
                        viewBox="0 0 48 48"
                    >
                        {/* Background track circle */}
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            className="stroke-slate-200/80 dark:stroke-slate-800 fill-none"
                            strokeWidth="2.5"
                        />
                        {/* Active Progress circle */}
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            className="stroke-emerald-500 dark:stroke-emerald-400 fill-none transition-all duration-150 ease-out"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>

                    {/* Arrow Icon in Center */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 transition-colors">
                        <ArrowUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ScrollToTop;
