import React from "react";
import { BookOpen, Award, Compass, Heart, GraduationCap } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import RightSidebar from "../../components/Public/RightSidebar";

const HistoryPage = () => {
    const { lang, t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        {lang === "bn" ? "ঐতিহ্য ও গৌরবগাথা" : "Heritage & Legacy"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {t("navHistory")}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                        {lang === "bn"
                            ? "১৯৬৭ সাল থেকে ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের পথচলা এবং উত্তরাঞ্চলের নারী শিক্ষার আলোকবর্তিকা হয়ে ওঠার ইতিহাস।"
                            : "The inspiring journey of Dimla Government Girls' High School since 1967 as a pioneer of female education."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Narrative (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
                        <div className="rounded-2xl overflow-hidden aspect-video relative shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&auto=format&fit=crop&q=80"
                                alt="Historic Campus"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 sm:p-6 text-white">
                                <div>
                                    <h4 className="text-sm sm:text-lg font-bold">
                                        {t("schoolName")}
                                    </h4>
                                    <p className="text-xs text-emerald-300">
                                        {lang === "bn" ? "স্থাপিত: ১৯৬৭ খ্রি. • ডিমলা, নীলফামারী" : "Established: 1967 AD • Dimla, Nilphamari"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Story Paragraphs */}
                        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 text-justify">
                            <p>
                                {lang === "bn"
                                    ? "বাংলাদেশের উত্তর জনপদের সীমান্তবর্তী একটি জনপদ নীলফামারী জেলার ডিমলা উপজেলা। ষাটের দশকে যখন এই অঞ্চলে নারী শিক্ষার সুযোগ ছিল অত্যন্ত সীমিত, তখন এলাকার কিছু দূরদর্শী সমাজসেবক ও বিদ্যানুরাগী ব্যক্তিত্ব উপলব্ধি করেন যে, নারীদের শিক্ষিত ও স্বাবলম্বী করা ছাড়া সমাজের সামগ্রিক উন্নয়ন অসম্ভব। সেই মহতী ভাবনা থেকেই ১৯৬৭ খ্রিস্টাব্দে প্রতিষ্ঠিত হয় ‘ডিমলা বালিকা উচ্চ বিদ্যালয়’।"
                                    : "Located in the northern frontier district of Nilphamari, Dimla Upazila experienced acute limitations in female education during the 1960s. Recognizing that sustainable development is impossible without empowering women, forward-thinking social reformers and education patrons laid the foundation of Dimla Girls' High School in 1967."}
                            </p>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                                {lang === "bn" ? "প্রতিষ্ঠালগ্ন ও জমি দান" : "Founding & Land Donation"}
                            </h3>
                            <p>
                                {lang === "bn"
                                    ? "বিদ্যালয়ের প্রতিষ্ঠাকালে স্থানীয় দানশীল ব্যক্তিবর্গ মূল্যবান ২.৮৫ একর জমি দান করেন। শুরু থেকেই স্থানীয় অভিভাবকদের অকুণ্ঠ সমর্থন এবং শিক্ষকমণ্ডলীর নিরলস পরিশ্রমে প্রতিষ্ঠানটি অল্প সময়ের মধ্যেই অত্র উপজেলার অন্যতম সেরা শিক্ষাপ্রতিষ্ঠান হিসেবে সুনাম কুড়ায়। প্রাথমিক পর্যায়ে সীমিত অবকাঠামো থাকলেও শিক্ষকদের মমতাময়ী পাঠদান শিক্ষার্থীদের অনুপ্রাণিত করত।"
                                    : "Generous local philanthropists donated 2.85 acres of prime land in the center of Dimla. With earnest community support and dedicated educators, the school rapidly established itself as the premier girls' secondary school in the region."}
                            </p>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                                {lang === "bn" ? "জাতীয়করণ ও সরকারি রূপ লাভ" : "Nationalization as a Government School"}
                            </h3>
                            <p>
                                {lang === "bn"
                                    ? "প্রতিষ্ঠানটির ধারাবাহিক মেধা, বোর্ড পরীক্ষায় অসাধারণ ফলাফল এবং নারী শিক্ষার প্রসারে অনবদ্য অবদানের স্বীকৃতিস্বরূপ গণপ্রজাতন্ত্রী বাংলাদেশ সরকার বিদ্যালয়টিকে জাতীয়করণ করে এবং প্রতিষ্ঠানটি ‘ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়’ হিসেবে নতুন দিগন্তে পদার্পণ করে। সরকারি মর্যাদা প্রাপ্তির পর নতুন বহুতল একাডেমিক ভবন, সমৃদ্ধ বিজ্ঞানাগার, ও আধুনিক ক্রীড়া প্রাঙ্গণ গড়ে তোলা হয়।"
                                    : "In recognition of decades of outstanding academic merit and monumental contributions to women's advancement, the Government of the People's Republic of Bangladesh nationalized the institution as 'Dimla Government Girls' High School'."}
                            </p>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                                {lang === "bn" ? "ডিজিটাল ও স্মার্ট রূপান্তর" : "Smart Digital Transformation"}
                            </h3>
                            <p>
                                {lang === "bn"
                                    ? "বর্তমানে প্রতিষ্ঠানটিতে ২০২৬ শিক্ষাবর্ষে সর্বাধুনিক মাল্টিমিডিয়া ক্লাসরুম, আধুনিক কম্পিউটার ল্যাব, এবং ডিজিটাল স্কুল ম্যানেজমেন্ট সিস্টেম চালুর মাধ্যমে স্মার্ট ও যুগোপযোগী শিক্ষা বাস্তবায়িত হচ্ছে। এখান থেকে পাস করা ছাত্রীরা আজ বিসিএস কর্মকর্তা, চিকিৎসক, প্রকৌশলী, বিশ্ববিদ্যালয়ের শিক্ষকসহ দেশ-বিদেশে গুরুত্বপূর্ণ অবদান রাখছেন।"
                                    : "Today, Dimla Government Girls' High School operates modern multimedia classrooms, an advanced computer laboratory, and a centralized school management system, shaping disciplined, technologically adept and compassionate female leaders."}
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

export default HistoryPage;
