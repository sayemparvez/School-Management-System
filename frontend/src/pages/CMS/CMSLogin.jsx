import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Lock, Mail, ArrowRight, ArrowLeft, Shield, Sparkles, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const CMSLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/auth/login", { email, password });
            const { token, role } = res.data;

            if (role !== "admin") {
                setError("শুধুমাত্র অনুমোদিত অ্যাডমিনিস্ট্রেটর বা ওয়েবসাইট ম্যানেজার এখানে লগইন করতে পারবেন।");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            navigate("/cms/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Back to Public Web */}
            <div className="absolute top-6 left-6 z-10">
                <a
                    href="#/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/10 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>পাবলিক ওয়েবসাইটে ফিরে যান</span>
                </a>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
                
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                        <Globe className="w-8 h-8" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Website Content Studio
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        ওয়েবসাইট সিএমএস লগইন
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় • অফিশিয়াল কনটেন্ট পোর্টাল
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            অ্যাডমিন ইমেইল / ইউজার আইডি
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@gmail.com বা আইডি"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            পাসওয়ার্ড
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <span>প্রবেশ করা হচ্ছে...</span>
                        ) : (
                            <>
                                <span>সিএমএস ড্যাশবোর্ডে প্রবেশ করুন</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Switch */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
                    <p>
                        স্কুলের মূল অ্যাকাডেমিক ও স্টুডেন্ট পোর্টাল?{" "}
                        <a href="#/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                            ERP লগইন
                        </a>
                    </p>
                    <p className="text-[11px] text-slate-400">
                        EIIN: 124754 • সংরক্ষিত অধিকার © ২০২৬
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CMSLogin;
