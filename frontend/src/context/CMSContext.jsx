import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
const defaultInitialState = {
        general: {
            school_name_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়",
            school_name_en: "Dimla Government Girls' High School",
            eiin: "124754",
            est_year: "1967",
            phone: "০১৭১২-৩৪৫৬৭৮",
            email: "dimlagovtgirlshighschool@gmail.com",
            address_bn: "ডিমলা, নীলফামারী",
            address_en: "Dimla, Nilphamari",
            slogan_bn: "জ্ঞানই শক্তি, শিক্ষাই মুক্তি",
            board_name: "দিনাজপুর শিক্ষা বোর্ড"
        },
        emergency_notice: {
            notice_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ে ২০২৬ শিক্ষাবর্ষের সকল শ্রেণির ক্লাস রুটিন, নোটিশ বোর্ড ও ভর্তি ফলাফল প্রকাশিত হয়েছে • সকল শিক্ষার্থী ও সম্মানিত শিক্ষকদের ডিজিটাল পোর্টালে স্বাগত।",
            notice_en: "Class routine, notice board and academic updates for Academic Year 2026 published • Welcome all students and respected teachers to Dimla Govt Girls' High School Portal.",
            is_active: true
        },
        hero_slides: [
            {
                id: 1,
                badge_bn: "ঐতিহ্যবাহী সরকারি নারী বিদ্যাপীঠ • স্থাপিত ১৯৬৭",
                badge_en: "Premier Govt. Girls' Institution • Est. 1967",
                title_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়",
                title_en: "Dimla Government Girls' High School",
                image_url: "/dimla-school-slide1.jpg",
                is_active: true,
                subtitle_bn: "দক্ষ শিক্ষক, তথ্যপ্রযুক্তিনির্ভর মাল্টিমিডিয়া ক্লাসরুম ও সৃজনশীল সহশিক্ষা কার্যক্রমের মাধ্যমে আদর্শ ও মানবিক গুণসম্পন্ন নারী নেতৃত্ব গড়ে তোলাই আমাদের লক্ষ্য।",
                subtitle_en: "Empowering female learners with dedicated faculty, modern digital classrooms, and holistic co-curricular excellence to build enlightened future leaders."
            },
            {
                id: 2,
                badge_bn: "স্মার্ট বাংলাদেশ রূপকল্প • আইসিটি উদ্ভাবন",
                badge_en: "Smart Education • Digital Innovation",
                title_bn: "স্মার্ট ডিজিটাল ক্লাসরুম ও কম্পিউটার ল্যাব",
                title_en: "Smart Digital Classroom & ICT Innovation",
                image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=80",
                is_active: true,
                subtitle_bn: "ডিজিটাল ল্যাবের আধুনিক কম্পিউটার ও প্রজেক্টরের মাধ্যমে প্রতিটি ছাত্রীকে তথ্যপ্রযুক্তি ও আধুনিক প্রযুক্তিতে দক্ষ করে গড়ে তোলা হচ্ছে।",
                subtitle_en: "Modern IT education and digital literacy empowered by Computer Lab and state-of-the-art computers."
            },
            {
                id: 3,
                badge_bn: "বিজ্ঞান মেলা ও ল্যাবরেটরি উৎকর্ষ",
                badge_en: "Science Lab & Research Excellence",
                title_bn: "সমৃদ্ধ বিজ্ঞানাগার ও বাস্তবমুখী বিজ্ঞান চর্চা",
                title_en: "Modern Science Laboratories & Practical Learning",
                image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&auto=format&fit=crop&q=80",
                is_active: true,
                subtitle_bn: "পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের সমৃদ্ধ ব্যবহারিক ল্যাবে হাতে-কলমে বিজ্ঞানের রহস্য উন্মোচন ও ভবিষ্যৎ বিজ্ঞানী গড়ার প্রত্যয়।",
                subtitle_en: "Hands-on scientific exploration in fully-equipped physics, chemistry and biology laboratories."
            },
            {
                id: 4,
                badge_bn: "সহশিক্ষা, সাহিত্য ও ক্রীড়া ঐতিহ্য",
                badge_en: "Co-Curricular & Sports Legacy",
                title_bn: "সহশিক্ষা, স্কাউটিং ও সাংস্কৃতিক বিকাশ",
                title_en: "Sports, Cultural Heritage & Scouting",
                image_url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&auto=format&fit=crop&q=80",
                is_active: true,
                subtitle_bn: "গার্ল গাইডস, স্কাউটিং, বিতর্ক, সাহিত্য ও জাতীয় পর্যায়ের বার্ষিক ক্রীড়া প্রতিযোগিতায় ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের অনন্য সাফল্য।",
                subtitle_en: "Fostering leadership, creativity and sportsmanship through Girl Guides, scouting, and national cultural events."
            }
        ],
        headmaster: {
            name_bn: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
            name_en: "Abu Jafor Md. Motasim Billah",
            designation_bn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
            designation_en: "Head Teacher (Acting)",
            image_url: "/headmaster.png",
            message_bn: "বিসমিল্লাহির রাহমানির রাহিম। ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ডিজিটাল পোর্টালে সবাইকে আন্তরিক শুভেচ্ছা। ১৯৬৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের নারী শিক্ষার এক অনন্য বাতিঘর। নৈতিকতা, শৃঙ্খলা ও আধুনিক জ্ঞানসমৃদ্ধ পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে আত্মনির্ভরশীল ও আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের ব্রত। বর্তমান তথ্যপ্রযুক্তির যুগে আমাদের ছাত্রীরা যেন আধুনিক বিশ্বের সাথে তাল মিলিয়ে এগিয়ে যেতে পারে, সেজন্য আমরা সার্বক্ষণিক সচেষ্ট। অভিভাবক ও শুভানুধ্যায়ীদের সহযোগিতায় এই বিদ্যাপীঠ তার গৌরবের ধারা অব্যাহত রাখবে—এটাই আমাদের প্রত্যাশা।",
            message_en: "In the name of Allah, Most Gracious, Most Merciful. Welcome to the official portal of Dimla Government Girls' High School. Established in 1967, our institution stands as a beacon of female empowerment in northern Bangladesh, fostering moral discipline, academic excellence and modern digital literacy."
        },
        school_story: {
            title_bn: "প্রতিষ্ঠানের গল্প ও পরিচিতি",
            title_en: "Our Journey & Heritage",
            image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
            content_bn: "ডিমলা উপজেলার প্রাণকেন্দ্রে মনোরম পরিবেশে অবস্থিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়। সুদক্ষ শিক্ষকমণ্ডলী, সুপরিসর বিজ্ঞানাগার, সমৃদ্ধ লাইব্রেরি ও কম্পিউটার ল্যাব সমৃদ্ধ এই প্রতিষ্ঠান প্রতিবছর বোর্ড পরীক্ষায় শতভাগ সাফল্যের গৌরব অর্জন করে চলেছে।",
            content_en: "Nestled in the scenic center of Dimla upazila, the school boasts well-equipped science laboratories, a multimedia computer lab, an enriched library and a legacy of outstanding Board examination results."
        },
        timings: {
            assembly_bn: "১০:০০ AM - ১০:১৫ AM",
            assembly_en: "10:00 AM - 10:15 AM",
            first_half_bn: "১০:১৫ AM - ০১:১৫ PM",
            first_half_en: "10:15 AM - 01:15 PM",
            tiffin_break_bn: "০১:১৫ PM - ০২:০০ PM",
            tiffin_break_en: "01:15 PM - 02:00 PM",
            second_half_bn: "০২:০০ PM - ০৪:০০ PM",
            second_half_en: "02:00 PM - 04:00 PM",
            office_hours_bn: "০৯:৩০ AM - ০৪:৩০ PM",
            office_hours_en: "09:30 AM - 04:30 PM",
            weekend_note_bn: "ছুটির দিন: শুক্রবার ও শনিবার",
            weekend_note_en: "Holidays: Friday & Saturday"
        },
        notices: [],
        student_statistics: {},
        class_routines: null,
        institutional_info: {},
        committee: [],
        achievers: [],
        gallery: [],
        important_links: [],
        teachers: [
            {
                id: 1,
                name_bn: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
                name_en: "Abu Jafor Md. Motasim Billah",
                designation_bn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
                designation_en: "Head Teacher (Acting)",
                department_bn: "প্রশাসন ও গণিত",
                department_en: "Administration & Mathematics",
                qualification: "এম.এসসি (গণিত), বি.এড",
                phone: "০১৭১২-৩৪৫৬৭৮",
                email: "headteacher.dimlagirls@gmail.com",
                image_url: "/headmaster.png",
                order: 1
            },
            {
                id: 2,
                name_bn: "মোছাঃ নাসরিন আক্তার",
                name_en: "Mst. Nasrin Akter",
                designation_bn: "সহকারী প্রধান শিক্ষক",
                designation_en: "Assistant Head Teacher",
                department_bn: "গণিত",
                department_en: "Mathematics",
                qualification: "M.Sc (Math), B.Ed",
                phone: "০১৭২৩-৪৫৬৭৮৯",
                email: "nasrin.akter@dimlagirls.edu.bd",
                image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
                order: 2
            },
            {
                id: 3,
                name_bn: "মোঃ জাহাঙ্গীর আলম",
                name_en: "Md. Jahangir Alam",
                designation_bn: "সিনিয়র শিক্ষক",
                designation_en: "Senior Teacher",
                department_bn: "পদার্থবিজ্ঞান ও গণিত",
                department_en: "Physics & Math",
                qualification: "M.Sc (Physics), B.Ed",
                phone: "০১৭৩৪-৫৬৭৮৯০",
                email: "jahangir.physics@dimlagirls.edu.bd",
                image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                order: 3
            },
            {
                id: 4,
                name_bn: "মোছাঃ সালমা খাতুন",
                name_en: "Mst. Salma Khatun",
                designation_bn: "সিনিয়র শিক্ষক",
                designation_en: "Senior Teacher",
                department_bn: "বাংলা",
                department_en: "Bangla",
                qualification: "M.A (Bangla), B.Ed",
                phone: "০১৭৪৫-৬৭৮৯০১",
                email: "salma.bangla@dimlagirls.edu.bd",
                image_url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80",
                order: 4
            },
            {
                id: 5,
                name_bn: "মোছাঃ নাজমুন নাহার",
                name_en: "Mst. Nazmun Nahar",
                designation_bn: "সহকারী শিক্ষক",
                designation_en: "Assistant Teacher",
                department_bn: "জীববিজ্ঞান",
                department_en: "Biology",
                qualification: "M.Sc (Botany), B.Ed",
                phone: "০১৭৫৬-৭৮৯০১২",
                email: "nazmun.biology@dimlagirls.edu.bd",
                image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
                order: 5
            },
            {
                id: 6,
                name_bn: "মোঃ কামরুল হাসান",
                name_en: "Md. Kamrul Hasan",
                designation_bn: "সহকারী শিক্ষক",
                designation_en: "Assistant Teacher",
                department_bn: "রসায়ন",
                department_en: "Chemistry",
                qualification: "M.Sc (Chemistry), B.Ed",
                phone: "০১৭৬৭-৮৯০১২৩",
                email: "kamrul.chemistry@dimlagirls.edu.bd",
                image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
                order: 6
            },
            {
                id: 7,
                name_bn: "মোছাঃ রোকেয়া সুলতানা",
                name_en: "Mst. Rokeya Sultana",
                designation_bn: "সহকারী শিক্ষক",
                designation_en: "Assistant Teacher",
                department_bn: "সামাজিক বিজ্ঞান",
                department_en: "Social Science",
                qualification: "M.S.S, B.Ed",
                phone: "০১৭৭৮-৯০১২৩৪",
                email: "rokeya.social@dimlagirls.edu.bd",
                image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                order: 7
            }
        ]
    };

    const CACHE_KEY = "dimla_cms_cached_data_v1";

    const [cms, setCms] = useState(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (e) {
            console.warn("Failed to load cached CMS data:", e);
        }
        return defaultInitialState;
    });

    const [loading, setLoading] = useState(true);

    const refreshCMS = async () => {
        try {
            const res = await api.get("/api/public/cms");
            if (res.data && res.data.success && res.data.data) {
                setCms((prev) => {
                    const merged = { ...prev, ...res.data.data };
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
                    } catch {}
                    return merged;
                });
            }
        } catch (err) {
            console.warn("Could not fetch CMS content, using defaults:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCMS();
    }, []);

    return (
        <CMSContext.Provider value={{ cms, loading, refreshCMS }}>
            {children}
        </CMSContext.Provider>
    );
};

export const useCMS = () => useContext(CMSContext);
