import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import RightSidebar from "../../components/Public/RightSidebar";

const ContactPage = () => {
    const { lang, t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
        }, 4000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "যোগাযোগ বাতায়ন" : "Get in Touch"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navContact")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় প্রশাসনের সাথে সরাসরি যোগাযোগ, অভিযোগ ও মতামত জানানোর মাধ্যম।"
                            : "Direct communication channel with the administration of Dimla Government Girls' High School."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 mx-auto flex items-center justify-center text-emerald-600 mb-2">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                {lang === "bn" ? "ঠিকানা" : "Address"}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়, ডিমলা সদর, নীলফামারী - ৫৩৫০
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/50 mx-auto flex items-center justify-center text-teal-600 mb-2">
                                <Phone className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                {lang === "bn" ? "হেল্পলাইন" : "Helpline"}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                ০১৭১২-৩৪৫৬৭৮<br />০১৭২৩-৪৫৬৭৮৯
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 mx-auto flex items-center justify-center text-blue-600 mb-2">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                {lang === "bn" ? "ইমেইল" : "Email"}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 truncate">
                                dimlagovtgirlshighschool@gmail.com
                            </p>
                        </div>
                    </div>

                    {/* Inquiry / Feedback Form */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                            {lang === "bn" ? "বার্তা বা জিজ্ঞাসা পাঠান" : "Send an Inquiry or Message"}
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">
                            {lang === "bn"
                                ? "ভর্তি, উপবৃত্তি, ফি বা অন্য যেকোনো বিষয়ে আমাদের কাছে আপনার বার্তা পাঠান।"
                                : "Submit your query or feedback regarding admission, fees, or academics."}
                        </p>

                        {submitted ? (
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                                    {lang === "bn" ? "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!" : "Message Sent Successfully!"}
                                </h4>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                    {lang === "bn" ? "বিদ্যালয় কর্তৃপক্ষ দ্রুত আপনার সাথে যোগাযোগ করবে।" : "The administration will contact you shortly."}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                            {lang === "bn" ? "আপনার পূর্ণ নাম *" : "Your Full Name *"}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                            {lang === "bn" ? "মোবাইল নম্বর *" : "Mobile Number *"}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="০১৭১২-xxxxxx"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                        {lang === "bn" ? "বিষয় *" : "Subject *"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder={lang === "bn" ? "যেমন: ভর্তি সংক্রান্ত তথ্য" : "e.g. Admission Query"}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                        {lang === "bn" ? "আপনার বার্তা / জিজ্ঞাসা *" : "Your Message *"}
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder={lang === "bn" ? "বিস্তারিত এখানে লিখুন..." : "Write your query here..."}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 text-xs sm:text-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    {lang === "bn" ? "বার্তা প্রেরণ করুন" : "Send Message"}
                                </button>
                            </form>
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

export default ContactPage;
