import React, { useState, useEffect, useRef } from "react";
import {
    Users, Award, BookOpen, GraduationCap, Calendar, ChevronRight, ChevronLeft,
    ArrowRight, Sparkles, HeartHandshake, Play, ExternalLink, Image as ImageIcon,
    Bell, Pin, Clock
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMS } from "../../context/CMSContext";
import RightSidebar from "../../components/Public/RightSidebar";
import RevealOnScroll from "../../components/Public/RevealOnScroll";
import api from "../../utils/api";
import { resolveMediaUrl } from "../../utils/imageOptimizer";

const HomePage = () => {
    const { lang, t } = useLanguage();
    const { cms } = useCMS();
    const teachersScrollRef = useRef(null);
    const achieversScrollRef = useRef(null);
    const [isTeachersHovered, setIsTeachersHovered] = useState(false);
    const [isAchieversHovered, setIsAchieversHovered] = useState(false);

    const scrollTeachers = (direction) => {
        if (teachersScrollRef.current) {
            const amount = direction === "left" ? -280 : 280;
            teachersScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    };

    const scrollAchievers = (direction) => {
        if (achieversScrollRef.current) {
            const amount = direction === "left" ? -260 : 260;
            achieversScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    };

    // Auto-slide for Teachers with pause on hover
    useEffect(() => {
        if (isTeachersHovered) return;
        const interval = setInterval(() => {
            if (teachersScrollRef.current) {
                const el = teachersScrollRef.current;
                const maxScrollLeft = el.scrollWidth - el.clientWidth;
                if (maxScrollLeft > 10) {
                    if (el.scrollLeft >= maxScrollLeft - 15) {
                        el.scrollTo({ left: 0, behavior: "smooth" });
                    } else {
                        el.scrollBy({ left: 260, behavior: "smooth" });
                    }
                }
            }
        }, 3200);

        return () => clearInterval(interval);
    }, [isTeachersHovered]);

    // Auto-slide for Achieving Students with pause on hover
    useEffect(() => {
        if (isAchieversHovered) return;
        const interval = setInterval(() => {
            if (achieversScrollRef.current) {
                const el = achieversScrollRef.current;
                const maxScrollLeft = el.scrollWidth - el.clientWidth;
                if (maxScrollLeft > 10) {
                    if (el.scrollLeft >= maxScrollLeft - 15) {
                        el.scrollTo({ left: 0, behavior: "smooth" });
                    } else {
                        el.scrollBy({ left: 260, behavior: "smooth" });
                    }
                }
            }
        }, 3600);

        return () => clearInterval(interval);
    }, [isAchieversHovered]);

    const [stats, setStats] = useState({
        students: 540,
        teachers: 24,
        staff: 14,
        passRate: "99.2%"
    });

    useEffect(() => {
        api.get("/api/public/stats")
            .then((res) => {
                if (res.data) {
                    setStats((prev) => ({
                        ...prev,
                        students: res.data.students || prev.students,
                        teachers: res.data.teachers || prev.teachers,
                        passRate: res.data.passRate || prev.passRate
                    }));
                }
            })
            .catch(() => {
                // Keep default stats
            });
    }, []);

    const rawTeachers = (cms?.teachers && cms.teachers.length > 0) ? cms.teachers : [
        {
            name_bn: cms?.headmaster?.name_bn || "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
            name_en: cms?.headmaster?.name_en || "Abu Jafor Md. Motasim Billah",
            designation_bn: cms?.headmaster?.designation_bn || "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
            designation_en: cms?.headmaster?.designation_en || "Head Teacher (Acting)",
            department_bn: "প্রশাসন ও গণিত",
            department_en: "Administration & Mathematics",
            qualification: "এম.এসসি (গণিত), বি.এড",
            image_url: cms?.headmaster?.image_url || "/headmaster.png"
        },
        {
            name_bn: "মোছাঃ নাসরিন আক্তার",
            name_en: "Mst. Nasrin Akter",
            designation_bn: "সহকারী প্রধান শিক্ষক",
            designation_en: "Assistant Head Teacher",
            department_bn: "গণিত",
            department_en: "Mathematics",
            qualification: "M.Sc (Math), B.Ed",
            image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
        },
        {
            name_bn: "মোঃ জাহাঙ্গীর আলম",
            name_en: "Md. Jahangir Alam",
            designation_bn: "সিনিয়র শিক্ষক",
            designation_en: "Senior Teacher",
            department_bn: "পদার্থবিজ্ঞান ও গণিত",
            department_en: "Physics & Math",
            qualification: "M.Sc (Physics), B.Ed",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        },
        {
            name_bn: "মোছাঃ সালমা খাতুন",
            name_en: "Mst. Salma Khatun",
            designation_bn: "সিনিয়র শিক্ষক",
            designation_en: "Senior Teacher",
            department_bn: "বাংলা",
            department_en: "Bangla",
            qualification: "M.A (Bangla), B.Ed",
            image_url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80"
        },
        {
            name_bn: "মোছাঃ নাজমুন নাহার",
            name_en: "Mst. Nazmun Nahar",
            designation_bn: "সহকারী শিক্ষক",
            designation_en: "Assistant Teacher",
            department_bn: "জীববিজ্ঞান",
            department_en: "Biology",
            qualification: "M.Sc (Botany), B.Ed",
            image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80"
        },
        {
            name_bn: "মোঃ কামরুল হাসান",
            name_en: "Md. Kamrul Hasan",
            designation_bn: "সহকারী শিক্ষক",
            designation_en: "Assistant Teacher",
            department_bn: "রসায়ন",
            department_en: "Chemistry",
            qualification: "M.Sc (Chemistry), B.Ed",
            image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
        },
        {
            name_bn: "মোছাঃ রোকেয়া সুলতানা",
            name_en: "Mst. Rokeya Sultana",
            designation_bn: "সহকারী শিক্ষক",
            designation_en: "Assistant Teacher",
            department_bn: "সামাজিক বিজ্ঞান",
            department_en: "Social Science",
            qualification: "M.S.S, B.Ed",
            image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        }
    ];

    const teachersList = rawTeachers.map(t => ({
        name: lang === "bn" ? (t.name_bn || t.name) : (t.name_en || t.name_bn || t.name),
        designation: lang === "bn" ? (t.designation_bn || t.designation) : (t.designation_en || t.designation_bn || t.designation),
        department: lang === "bn" ? (t.department_bn || t.department) : (t.department_en || t.department_bn || t.department),
        qualification: t.qualification || "",
        image: t.image_url || t.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    }));

    const defaultManagingCommittee = [
        {
            name: lang === "bn" ? "উপজেলা নির্বাহী অফিসার (ইউএনও)" : "Upazila Nirbahi Officer (UNO)",
            role: lang === "bn" ? "সভাপতি" : "President",
            sub: lang === "bn" ? "ডিমলা, নীলফামারী" : "Dimla, Nilphamari",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? (cms?.headmaster?.name_bn || "আবু জাফর মোঃ মোতাসিম বিল্লাহ্") : (cms?.headmaster?.name_en || "Abu Jafor Md. Motasim Billah"),
            role: lang === "bn" ? "সদস্য সচিব" : "Member Secretary",
            sub: lang === "bn" ? (cms?.headmaster?.designation_bn || "প্রধান শিক্ষক (ভারপ্রাপ্ত)") : (cms?.headmaster?.designation_en || "Head Teacher (Acting)"),
            image: "/headmaster.png"
        },
        {
            name: lang === "bn" ? "মোঃ রফিকুল ইসলাম" : "Md. Rafiqul Islam",
            role: lang === "bn" ? "অভিভাবক সদস্য" : "Guardian Representative",
            sub: lang === "bn" ? "সমাজসেবক ও শিক্ষানুরাগী" : "Social Worker",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মোছাঃ পারভীন আক্তার" : "Mst. Parvin Akter",
            role: lang === "bn" ? "শিক্ষক প্রতিনিধি" : "Teacher Representative",
            sub: lang === "bn" ? "সিনিয়র শিক্ষক" : "Senior Teacher",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
        }
    ];

    const activeManagingCommittee = (cms?.committee && Array.isArray(cms.committee) && cms.committee.length > 0)
        ? cms.committee.map(c => ({
            name: c.name || (lang === "bn" ? c.name_bn : c.name_en) || "",
            role: c.role || (lang === "bn" ? c.role_bn : c.role_en) || "",
            sub: c.sub || (lang === "bn" ? c.sub_bn : c.sub_en) || "",
            image: c.image_url || c.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
        }))
        : defaultManagingCommittee;

    const achievers = [
        {
            name: lang === "bn" ? "সুমাইয়া জাহান" : "Sumaiya Jahan",
            exam: "SSC 2025",
            gpa: "GPA 5.00 (Golden)",
            award: lang === "bn" ? "মেধাবৃত্তি প্রাপ্ত" : "Talent Pool Scholarship",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "ফারহানা আকতার" : "Farhana Akter",
            exam: "SSC 2025",
            gpa: "GPA 5.00",
            award: lang === "bn" ? "বিজ্ঞান বিভাগ সেরা" : "Science Top Scorer",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "নুসরাত সুলতানা" : "Nusrat Sultana",
            exam: "SSC 2025",
            gpa: "GPA 5.00",
            award: lang === "bn" ? "সাধারণ বৃত্তি" : "General Scholarship",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "সাদিয়া ইসলাম মিম" : "Sadia Islam Mim",
            exam: "SSC 2024",
            gpa: "GPA 5.00 (Golden)",
            award: lang === "bn" ? "উপজেলা পর্যায়ে প্রথম" : "Upazila 1st Rank",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "মেহেরুন নেসা" : "Meherun Nesa",
            exam: "SSC 2024",
            gpa: "GPA 5.00",
            award: lang === "bn" ? "মেধাবৃত্তি প্রাপ্ত" : "Talent Pool Scholarship",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: lang === "bn" ? "তানজিলা আক্তার" : "Tanjila Akter",
            exam: "SSC 2024",
            gpa: "GPA 5.00",
            award: lang === "bn" ? "মানবিক বিভাগ সেরা" : "Humanities Top Scorer",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
        }
    ];

    const activeAchievers = (cms?.achievers && cms.achievers.length > 0)
        ? cms.achievers.map((a) => ({
            name: a.name || (lang === "bn" ? a.name_bn : a.name_en) || "শিক্ষার্থী",
            exam: a.exam || "SSC",
            gpa: a.gpa || "GPA 5.00",
            award: a.award || (lang === "bn" ? a.award_bn : a.award_en) || "",
            image: a.image || a.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
        }))
        : achievers;

    const defaultGallery = [
        {
            title: lang === "bn" ? "ডিজিটাল ক্লাসরুম" : "Digital Classroom",
            image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80"
        },
        {
            title: lang === "bn" ? "বিজ্ঞান মেলা" : "Science Fair",
            image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&auto=format&fit=crop&q=80"
        },
        {
            title: lang === "bn" ? "বার্ষিক ক্রীড়া প্রতিযোগিতা" : "Annual Sports Day",
            image_url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80"
        }
    ];

    const activeGallery = (cms?.gallery && cms.gallery.length > 0)
        ? cms.gallery.map((g) => ({
            title: g.title || (lang === "bn" ? g.title_bn : g.title_en) || "School Activity",
            image_url: g.image_url || g.image
        }))
        : defaultGallery;

    // Default School Notices for Hero Notice Board Overlay (matching reference design)
    const defaultHeroNotices = [
        {
            id: 1,
            title_bn: "২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে নতুন ভর্তি ও ক্লাস রুটিন সংক্রান্ত জরুরি বিজ্ঞপ্তি",
            title_en: "Urgent Notice regarding New Admission and Class Routine 2026",
            date_badge: "২৮ Oct",
            date: "২৮ অক্টোবর, ২০২৬"
        },
        {
            id: 2,
            title_bn: "১০ম শ্রেণির শিক্ষার্থীদের প্রাক-নির্বাচনী (Pre-Test) পরীক্ষার সময়সূচি ও প্রবেশপত্র বিতরণ",
            title_en: "Schedule and Admit Card for Class 10 Pre-Test Examination",
            date_badge: "২৫ Oct",
            date: "২৫ অক্টোবর, ২০২৬"
        },
        {
            id: 3,
            title_bn: "উপবৃত্তি প্রাপ্ত শিক্ষার্থীদের তালিকা ও মোবাইল ব্যাংকিং (নগদ) হিসাব যাচাই সংক্রান্ত",
            title_en: "Verification of Mobile Banking Accounts for Stipend Beneficiaries",
            date_badge: "২০ Oct",
            date: "২০ অক্টোবর, ২০২৬"
        },
        {
            id: 4,
            title_bn: "গ্রীষ্মকালীন অবকাশ ও শিক্ষাসফর সংক্রান্ত নির্দেশিকা ও অভিভাবক সম্মতিপত্র",
            title_en: "Guidelines and Parent Consent for Summer Vacation Study Tour",
            date_badge: "১৫ Oct",
            date: "১৫ অক্টোবর, ২০২৬"
        },
        {
            id: 5,
            title_bn: "স্বাধীনতা দিবস উপলক্ষে রচনা ও আবৃত্তি প্রতিযোগিতা এবং পুরস্কার বিতরণী",
            title_en: "Essay & Recitation Competition on Independence Day",
            date_badge: "১০ Oct",
            date: "১০ অক্টোবর, ২০২৬"
        },
        {
            id: 6,
            title_bn: "নতুন বিষয়ভিত্তিক শিক্ষক পদায়ন ও শ্রেণি কার্যক্রম পরিচালনা সংক্রান্ত বিজ্ঞপ্তি",
            title_en: "Faculty Assignment & Routine Operations Notice",
            date_badge: "০১ Oct",
            date: "০১ অক্টোবর, ২০২৬"
        }
    ];

    // Default Hero Slides for Dimla Govt Girls' High School
    const defaultHeroSlides = [
        {
            id: 1,
            title_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়",
            title_en: "Dimla Government Girls' High School",
            subtitle_bn: "দক্ষ শিক্ষক, তথ্যপ্রযুক্তিনির্ভর মাল্টিমিডিয়া ক্লাসরুম ও সৃজনশীল সহশিক্ষা কার্যক্রমের মাধ্যমে আদর্শ ও মানবিক গুণসম্পন্ন নারী নেতৃত্ব গড়ে তোলাই আমাদের লক্ষ্য।",
            subtitle_en: "Empowering female learners with dedicated faculty, modern digital classrooms, and holistic co-curricular excellence to build enlightened future leaders.",
            badge_bn: "ঐতিহ্যবাহী সরকারি নারী বিদ্যাপীঠ • স্থাপিত ১৯৬৭",
            badge_en: "Premier Govt. Girls' Institution • Est. 1967",
            image_url: "/dimla-school-slide1.jpg",
            is_active: true
        },
        {
            id: 2,
            title_bn: "স্মার্ট ডিজিটাল ক্লাসরুম ও কম্পিউটার ল্যাব",
            title_en: "Smart Digital Classroom & ICT Innovation",
            subtitle_bn: "আধুনিক কম্পিউটার ল্যাব ও প্রজেক্টরের মাধ্যমে প্রতিটি ছাত্রীকে তথ্যপ্রযুক্তি ও আধুনিক প্রযুক্তিতে দক্ষ করে গড়ে তোলা হচ্ছে।",
            subtitle_en: "Modern IT education and digital literacy empowered by modern Computer Lab and state-of-the-art computers.",
            badge_bn: "স্মার্ট বাংলাদেশ রূপকল্প • আইসিটি উদ্ভাবন",
            badge_en: "Smart Education • Digital Innovation",
            image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=80",
            is_active: true
        },
        {
            id: 3,
            title_bn: "সমৃদ্ধ বিজ্ঞানাগার ও বাস্তবমুখী বিজ্ঞান চর্চা",
            title_en: "Modern Science Laboratories & Practical Learning",
            subtitle_bn: "পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের সমৃদ্ধ ব্যবহারিক ল্যাবে হাতে-কলমে বিজ্ঞানের রহস্য উন্মোচন ও ভবিষ্যৎ বিজ্ঞানী গড়ার প্রত্যয়।",
            subtitle_en: "Hands-on scientific exploration in fully-equipped physics, chemistry and biology laboratories.",
            badge_bn: "বিজ্ঞান মেলা ও ল্যাবরেটরি উৎকর্ষ",
            badge_en: "Science Lab & Research Excellence",
            image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&auto=format&fit=crop&q=80",
            is_active: true
        },
        {
            id: 4,
            title_bn: "সহশিক্ষা, স্কাউটিং ও সাংস্কৃতিক বিকাশ",
            title_en: "Sports, Cultural Heritage & Scouting",
            subtitle_bn: "গার্ল গাইডস, স্কাউটিং, বিতর্ক, সাহিত্য ও জাতীয় পর্যায়ের বার্ষিক ক্রীড়া প্রতিযোগিতায় ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের অনন্য সাফল্য।",
            subtitle_en: "Fostering leadership, creativity and sportsmanship through Girl Guides, scouting, and national cultural events.",
            badge_bn: "সহশিক্ষা, সাহিত্য ও ক্রীড়া ঐতিহ্য",
            badge_en: "Co-Curricular & Sports Legacy",
            image_url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&auto=format&fit=crop&q=80",
            is_active: true
        }
    ];

    const activeSlides = (cms?.hero_slides && Array.isArray(cms.hero_slides) && cms.hero_slides.length > 0)
        ? cms.hero_slides.filter((s) => s.is_active !== false)
        : defaultHeroSlides;

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isSlideHovered, setIsSlideHovered] = useState(false);

    // Auto rotate slides every 6 seconds, pause on hover
    useEffect(() => {
        if (!activeSlides || activeSlides.length <= 1 || isSlideHovered) return;
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [activeSlides, isSlideHovered]);

    // Preload hero carousel images eagerly in background
    useEffect(() => {
        if (activeSlides && activeSlides.length > 0) {
            activeSlides.forEach((s) => {
                if (s?.image_url) {
                    const preloadImg = new Image();
                    preloadImg.src = resolveMediaUrl(s.image_url);
                }
            });
        }
    }, [activeSlides]);

    const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0] || defaultHeroSlides[0];

    const nextSlide = () => {
        setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    };

    const heroNotices = (cms?.notices && Array.isArray(cms.notices) && cms.notices.length > 0)
        ? cms.notices.slice(0, 6).map((n, idx) => ({
            id: n.id || idx + 1,
            title_bn: n.title_bn || n.title,
            title_en: n.title_en || n.title,
            date_badge: n.date_badge || (n.date ? n.date.split(",")[0].trim() : `${28 - idx * 4} Oct`),
            date: n.date || "২০২৬"
        }))
        : defaultHeroNotices;

    const badgeColors = [
        { bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-900/60" },
        { bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900/60" },
        { bg: "bg-sky-50 dark:bg-sky-950/50", text: "text-sky-600 dark:text-sky-400", border: "border-sky-200 dark:border-sky-900/60" },
        { bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900/60" },
        { bg: "bg-purple-50 dark:bg-purple-950/50", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-900/60" },
        { bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-900/60" }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
            {/* 1. HERO BANNER SECTION WITH DYNAMIC CAROUSEL SLIDER & FLOATING NOTICE BOARD OVERLAY */}
            <div 
                onMouseEnter={() => setIsSlideHovered(true)}
                onMouseLeave={() => setIsSlideHovered(false)}
                className="group relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-950 min-h-[460px] flex items-center"
            >
                {/* Background Carousel Slides with Smooth Fade & Subtle Ken Burns Zoom */}
                {activeSlides.map((slide, sIdx) => (
                    <div
                        key={slide.id || sIdx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            sIdx === currentSlideIndex
                                ? "opacity-100 z-0 pointer-events-none"
                                : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <img
                            src={resolveMediaUrl(slide.image_url)}
                            alt={slide.title_bn || "Dimla Govt Girls High School"}
                            fetchPriority={sIdx === 0 ? "high" : "auto"}
                            loading={sIdx === 0 ? "eager" : "lazy"}
                            decoding={sIdx === 0 ? "sync" : "async"}
                            onError={(e) => {
                                if (sIdx === 0) e.currentTarget.src = "/dimla-school-slide1.jpg";
                            }}
                            className={`w-full h-full object-cover ${
                                sIdx === currentSlideIndex ? "hero-ken-burns" : ""
                            }`}
                        />
                    </div>
                ))}
                
                {/* Cinematic Vignette Overlay: Dark on left text side, clear and vibrant on center & right so the school photo is beautifully visible */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-emerald-950/65 to-black/35 pointer-events-none z-[1]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none z-[1]"></div>

                <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Dynamic Slide Content (7 Columns) with Advance-Level Staggered Entrance Animations */}
                    <div 
                        key={currentSlideIndex}
                        className="lg:col-span-7 space-y-4 text-white"
                    >
                        {/* Slide Badge */}
                        <div className="hero-animate-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                            <span>{lang === "bn" ? currentSlide.badge_bn : (currentSlide.badge_en || currentSlide.badge_bn)}</span>
                        </div>

                        {/* Slide Title */}
                        <h2 className="hero-animate-title text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                            {lang === "bn" ? currentSlide.title_bn : (currentSlide.title_en || currentSlide.title_bn)}
                        </h2>

                        {/* Slide Subtitle / Description */}
                        <p className="hero-animate-desc text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl min-h-[44px]">
                            {lang === "bn" ? currentSlide.subtitle_bn : (currentSlide.subtitle_en || currentSlide.subtitle_bn)}
                        </p>

                        {/* Action Buttons & Slide Controls */}
                        <div className="hero-animate-actions pt-2 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-wrap text-xs font-bold">
                                <a
                                    href="#/student-list"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    <Users className="w-4 h-4" />
                                    {t("navStudentList")}
                                </a>
                                <a
                                    href="#/class-routine"
                                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 transition-all flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4 text-emerald-300" />
                                    <span>{lang === "bn" ? "ক্লাস রুটিন" : "Class Routine"}</span>
                                </a>
                                <a
                                    href="#/login"
                                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow transition-all flex items-center gap-2"
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    {lang === "bn" ? "লগইন পোর্টাল" : "Login Portal"}
                                </a>
                            </div>

                            {/* Slide Navigation Buttons & Dot Indicators */}
                            {activeSlides.length > 1 && (
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                                    <button
                                        onClick={prevSlide}
                                        className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                                        title="পূর্ববর্তী স্লাইড"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1.5 px-1">
                                        {activeSlides.map((_, dotIdx) => (
                                            <button
                                                key={dotIdx}
                                                onClick={() => setCurrentSlideIndex(dotIdx)}
                                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                                    dotIdx === currentSlideIndex
                                                        ? "w-7 bg-emerald-400 shadow-sm shadow-emerald-400/50"
                                                        : "w-2 bg-white/40 hover:bg-white/70"
                                                }`}
                                                title={`স্লাইড ${dotIdx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={nextSlide}
                                        className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                                        title="পরবর্তী স্লাইড"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Floating Notice Board Card Overlay (Perfect Balanced Size) */}
                    <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
                        <div className="w-full max-w-[425px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col">
                            {/* Card Header (Curved Red Gradient) */}
                            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4.5 py-3 flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6.5 h-6.5 rounded-lg bg-white/20 flex items-center justify-center">
                                        <Bell className="w-3.5 h-3.5 text-white animate-bounce" />
                                    </div>
                                    <h3 className="font-black text-sm tracking-wide text-white">
                                        {lang === "bn" ? "নোটিশ বোর্ড" : "Notice Board"}
                                    </h3>
                                </div>
                                <a
                                    href="#/notices"
                                    className="text-xs font-bold text-white/95 hover:text-white flex items-center gap-1 hover:underline group"
                                >
                                    <span>{lang === "bn" ? "সকল নোটিশ" : "All Notices"}</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>

                            {/* Card Body - Notice Items with Pastel Date Badges */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[320px] overflow-y-auto">
                                {heroNotices.map((notice, idx) => {
                                    const color = badgeColors[idx % badgeColors.length];
                                    return (
                                        <a
                                            key={notice.id || idx}
                                            href="#/notices"
                                            className="flex items-center gap-3 p-3 sm:px-3.5 sm:py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                                        >
                                            {/* Pastel Date Badge */}
                                            <div className={`px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-center min-w-[52px] text-center flex-shrink-0 shadow-2xs ${color.bg} ${color.border}`}>
                                                <span className={`text-[10.5px] font-black leading-tight ${color.text}`}>
                                                    {notice.date_badge}
                                                </span>
                                            </div>

                                            {/* Title & Date */}
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-xs sm:text-[12.5px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                                                    {lang === "bn" ? notice.title_bn : (notice.title_en || notice.title_bn)}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                    <span>{notice.date}</span>
                                                </div>
                                            </div>

                                            {/* Arrow Icon */}
                                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Card Footer */}
                            <div className="py-2.5 px-3.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-center">
                                <a
                                    href="#/notices"
                                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center justify-center gap-1.5"
                                >
                                    <span>{lang === "bn" ? "অফিসিয়াল সকল বিজ্ঞপ্তি দেখতে এখানে ক্লিক করুন" : "Click here for all official circulars"}</span>
                                    <ArrowRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Slide Progress Timer Bar */}
                {activeSlides.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden pointer-events-none">
                        <div 
                            key={currentSlideIndex}
                            className={`h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hero-progress-bar ${
                                isSlideHovered ? "hero-progress-paused" : ""
                            }`}
                        />
                    </div>
                )}
            </div>

            {/* 2. STATS KPI BAR (Image 2 style: 500+ Students, 25+ Teachers...) */}
            <RevealOnScroll animation="fade-up" delay={60}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                                {stats.students}+
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {t("statStudents")}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                                {stats.teachers}+
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {t("statTeachers")}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                                {stats.staff}+
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {t("statStaff")}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 flex-shrink-0">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                                {stats.passRate}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {t("statPassRate")}
                            </div>
                        </div>
                    </div>
                </div>
            </RevealOnScroll>

            {/* 3. MAIN TWO-COLUMN CONTENT AREA (70% Left + 30% Right Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT MAIN CONTENT (8 COLS) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* A. Headmaster Message & School Story (Image 2 style side-by-side or stacked) */}
                    <RevealOnScroll animation="fade-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 1. প্রতিষ্ঠান প্রধানের বাণী */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                            {t("headmasterMessageTitle")}
                                        </h3>
                                        <a href="#/principal-message" className="text-xs text-emerald-600 hover:underline font-semibold">
                                            {t("readMore")} →
                                        </a>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
                                        <img
                                            src={resolveMediaUrl(cms?.headmaster?.image_url)}
                                            alt={lang === "bn" ? "প্রধান শিক্ষক" : "Head Teacher"}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/headmaster.png";
                                            }}
                                            className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                                        />
                                        <div className="text-center sm:text-left">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {(lang === "bn" ? cms?.headmaster?.name_bn : cms?.headmaster?.name_en) || t("headmasterName")}
                                            </h4>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                                {(lang === "bn" ? cms?.headmaster?.designation_bn : cms?.headmaster?.designation_en) || t("headmasterDesignation")}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {t("schoolName")}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify line-clamp-6">
                                        {(lang === "bn" ? cms?.headmaster?.message_bn : cms?.headmaster?.message_en) || (lang === "bn"
                                            ? "বিসমিল্লাহির রাহমানির রাহিম। ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ডিজিটাল পোর্টালে সবাইকে আন্তরিক শুভেচ্ছা। ১৯৬৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের নারী শিক্ষার এক অনন্য বাতিঘর। নৈতিকতা, শৃঙ্খলা ও আধুনিক জ্ঞানসমৃদ্ধ পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে আত্মনির্ভরশীল ও আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের ব্রত।"
                                            : "In the name of Allah, Most Gracious, Most Merciful. Welcome to the official portal of Dimla Government Girls' High School. Established in 1967, our institution stands as a beacon of female empowerment in northern Bangladesh, fostering moral discipline, academic excellence and modern digital literacy.")}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 text-right">
                                    <a
                                        href="#/principal-message"
                                        className="text-xs text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                                    >
                                        {t("readMore")} <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            {/* 2. প্রতিষ্ঠানের গল্প ও পরিচিতি */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                                            {(lang === "bn" ? cms?.school_story?.title_bn : cms?.school_story?.title_en) || t("schoolStoryTitle")}
                                        </h3>
                                        <a href="#/history" className="text-xs text-teal-600 hover:underline font-semibold">
                                            {t("readMore")} →
                                        </a>
                                    </div>

                                    <div className="rounded-xl overflow-hidden mb-3 aspect-video relative">
                                        <img
                                            src={resolveMediaUrl(cms?.school_story?.image_url, "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80")}
                                            alt="School Campus"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white backdrop-blur">
                                            {lang === "bn" ? "ক্যাম্পাস প্রাঙ্গণ" : "School Campus"}
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify line-clamp-4">
                                        {(lang === "bn" ? cms?.school_story?.content_bn : cms?.school_story?.content_en) || (lang === "bn"
                                            ? "ডিমলা উপজেলার প্রাণকেন্দ্রে মনোরম পরিবেশে অবস্থিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়। সুদক্ষ শিক্ষকমণ্ডলী, সুপরিসর বিজ্ঞানাগার, সমৃদ্ধ লাইব্রেরি ও কম্পিউটার ল্যাব সমৃদ্ধ এই প্রতিষ্ঠান প্রতিবছর বোর্ড পরীক্ষায় শতভাগ সাফল্যের গৌরব অর্জন করে চলেছে।"
                                            : "Nestled in the scenic center of Dimla upazila, the school boasts well-equipped science laboratories, a multimedia computer lab, an enriched library and a legacy of outstanding Board examination results.")}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 text-right">
                                    <a
                                        href="#/history"
                                        className="text-xs text-teal-600 font-bold hover:underline inline-flex items-center gap-1"
                                    >
                                        {t("readMore")} <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* B. ব্যবস্থাপনা কমিটি (Managing Committee) */}
                    <RevealOnScroll animation="fade-up">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                                        {t("committeeTitle")}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {lang === "bn" ? "বিদ্যালয় পরিচালনা ও উন্নয়ন পর্ষদ" : "Governing & Development Council"}
                                    </p>
                                </div>
                                <a href="#/at-a-glance" className="text-xs text-emerald-600 hover:underline font-semibold">
                                    {t("viewAll")} →
                                </a>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {activeManagingCommittee.map((member, i) => (
                                    <div
                                        key={i}
                                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3 group hover:border-emerald-500/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30 flex-shrink-0 bg-slate-200 dark:bg-slate-800 shadow-xs">
                                                <img
                                                    src={resolveMediaUrl(member.image, "/headmaster.png")}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80";
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                                    {member.name}
                                                </div>
                                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                                                    {member.role}
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate">
                                                    {member.sub}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                                            ✓
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* C. আমাদের সম্মানিত শিক্ষকবৃন্দ (Teachers Showcase with Auto-Slide & Horizontal Scroll) */}
                    <RevealOnScroll animation="fade-up">
                        <div
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative group"
                            onMouseEnter={() => setIsTeachersHovered(true)}
                            onMouseLeave={() => setIsTeachersHovered(false)}
                            onTouchStart={() => setIsTeachersHovered(true)}
                            onTouchEnd={() => setIsTeachersHovered(false)}
                        >
                            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                                        {t("teachersTitle")}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {lang === "bn" ? "অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী" : "Experienced and Dedicated Faculty"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Navigation Arrows */}
                                    <div className="flex items-center gap-1.5 mr-2">
                                        <button
                                            type="button"
                                            onClick={() => scrollTeachers("left")}
                                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer"
                                            title="পূর্ববর্তী শিক্ষক"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => scrollTeachers("right")}
                                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer"
                                            title="পরবর্তী শিক্ষক"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <a
                                        href="#/teachers"
                                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
                                    >
                                        {t("viewAll")} ({stats.teachers}) →
                                    </a>
                                </div>
                            </div>

                            {/* Scrollable Container with Left/Right Scroll */}
                            <div
                                ref={teachersScrollRef}
                                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 snap-x scrollbar-none"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                {teachersList.map((teacher, i) => (
                                    <div
                                        key={i}
                                        className="flex-shrink-0 w-52 sm:w-56 snap-start group/card text-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700"
                                    >
                                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-emerald-400/50 p-0.5 group-hover/card:scale-105 transition-transform">
                                            <img
                                                src={resolveMediaUrl(teacher.image)}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => { e.target.src = "/headmaster.png"; }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">
                                            {teacher.name}
                                        </h4>
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                            {teacher.designation}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {teacher.department}
                                        </p>
                                        <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {teacher.qualification}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* D. কৃতি শিক্ষার্থী (Achieving Students Showcase with Auto-Slide & Horizontal Scroll) */}
                    <RevealOnScroll animation="fade-up">
                        <div
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative group"
                            onMouseEnter={() => setIsAchieversHovered(true)}
                            onMouseLeave={() => setIsAchieversHovered(false)}
                            onTouchStart={() => setIsAchieversHovered(true)}
                            onTouchEnd={() => setIsAchieversHovered(false)}
                        >
                            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                                        {t("achieversTitle")}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {lang === "bn" ? "এসএসসি ও মেধা বৃত্তিতে উত্তীর্ণ শিক্ষার্থীদের গৌরবময় সাফল্য" : "Outstanding Board Exam Achievers"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Navigation Arrows */}
                                    <div className="flex items-center gap-1.5 mr-2">
                                        <button
                                            type="button"
                                            onClick={() => scrollAchievers("left")}
                                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer"
                                            title="পূর্ববর্তী শিক্ষার্থী"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => scrollAchievers("right")}
                                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer"
                                            title="পরবর্তী শিক্ষার্থী"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <a href="#/student-list" className="text-xs text-emerald-600 hover:underline font-semibold">
                                        {t("viewAll")} →
                                    </a>
                                </div>
                            </div>

                            {/* Scrollable Container with Left/Right Scroll */}
                            <div
                                ref={achieversScrollRef}
                                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 snap-x scrollbar-none"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                {activeAchievers.map((stu, i) => (
                                    <div
                                        key={i}
                                        className="flex-shrink-0 w-56 sm:w-60 snap-start p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 text-center hover:shadow-md transition-all hover:border-amber-300"
                                    >
                                        <img
                                            src={resolveMediaUrl(stu.image, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80")}
                                            alt={stu.name}
                                            className="w-16 h-16 rounded-full mx-auto object-cover mb-2 border-2 border-amber-400 shadow-xs"
                                        />
                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                                            {stu.name}
                                        </h4>
                                        <span className="inline-block my-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px]">
                                            {stu.gpa}
                                        </span>
                                        <div className="text-[10px] text-slate-500 font-medium">
                                            {stu.exam} {stu.award ? `• ${stu.award}` : ""}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* E. ফটো ও ভিডিও গ্যালারি (Photo & Video Gallery) */}
                    <RevealOnScroll animation="fade-up">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                                    {t("galleryTitle")}
                                </h3>
                                <span className="text-xs text-slate-400">
                                    {lang === "bn" ? "বার্ষিক ক্রীড়া ও সাংস্কৃতিক মুহূর্ত" : "Moments & Activities"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {activeGallery.map((item, idx) => (
                                    <div key={idx} className="rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 relative group">
                                        <img
                                            src={resolveMediaUrl(item.image_url)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                                            <span className="text-[10px] text-white font-medium line-clamp-1">{item.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* RIGHT SIDEBAR (4 COLS) */}
                <div className="lg:col-span-4">
                    <RevealOnScroll animation="fade-left" delay={120}>
                        <RightSidebar />
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
