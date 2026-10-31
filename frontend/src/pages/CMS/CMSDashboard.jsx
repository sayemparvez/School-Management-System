import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Globe, Save, RefreshCw, Upload, Plus, Trash2, CheckCircle2,
    AlertCircle, Image as ImageIcon, Sparkles, Building2, Phone,
    Clock, Award, Users, BookOpen, ExternalLink, LogOut, LayoutGrid,
    Sliders, FileText, Check, Shield, Link2, ArrowUpRight, Bell,
    Calendar, Edit3, X, Eye, Laptop, Heart, Pin, Activity, TrendingUp,
    CheckCircle, ChevronRight, ChevronLeft, Layers, FileSpreadsheet, MapPin, GraduationCap,
    Sun, Moon, Briefcase
} from "lucide-react";
import api from "../../utils/api";
import { useCMS } from "../../context/CMSContext";
import { resolveMediaUrl, compressImage, createInstantPreview } from "../../utils/imageOptimizer";

// Standard Subject & Teacher Lists for Dimla Govt Girls' High School
const routineSubjectsJunior = [
    "বাংলা ১ম পত্র", "বাংলা ২য় পত্র", "ইংরেজি ১ম পত্র", "ইংরেজি ২য় পত্র",
    "সাধারণ গণিত", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়",
    "তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)", "ইসলাম ও নৈতিক শিক্ষা",
    "হিন্দুধর্ম ও নৈতিক শিক্ষা", "চারু ও কারুকলা", "শারীরিক শিক্ষা ও স্বাস্থ্য",
    "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "সহশিক্ষা ও স্কাউটিং"
];

const routineSubjectsSenior = [
    "বাংলা ১ম পত্র", "বাংলা ২য় পত্র", "ইংরেজি ১ম পত্র", "ইংরেজি ২য় পত্র",
    "সাধারণ গণিত", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান",
    "তথ্য ও যোগাযোগ প্রযুক্তি", "ইতিহাস ও সামাজিক বিজ্ঞান", "ভূগোল ও পরিবেশ",
    "অর্থনীতি", "পৌরনীতি ও নাগরিকতা", "বাংলাদেশ ও বিশ্বপরিচয়",
    "ইসলাম ও নৈতিক শিক্ষা", "হিন্দুধর্ম ও নৈতিক শিক্ষা", "শারীরিক শিক্ষা ও ক্যারিয়ার শিক্ষা"
];

const routineTeachers = [
    "মোছাঃ সেলিনা আক্তার", "মোঃ রফিকুল ইসলাম", "মিজানুর রহমান", "মোছাঃ ফাতেমা বেগম",
    "মোঃ হাফিজুর রহমান", "ফারহানা হক", "ড. শফিকুল ইসলাম", "প্রভাষক কামরুল হাসান",
    "মাহমুদা খাতুন", "আব্দুল কাদের জিলানী", "মোছাঃ নাজনীন জাহান", "মুহাম্মদ আলী",
    "মাওলানা আব্দুর রশিদ", "সুবোধ রায়", "আব্দুল মজিদ", "নিলুফার ইয়াসমিন",
    "শামসুন্নাহার পারভীন", "ইঞ্জি. তারেক মাহমুদ", "সুলতানা রাজিয়া", "আসমা খাতুন",
    "মোজাম্মেল হক", "স্বপন কুমার"
];

const routineRooms = [
    "১০১", "১০২", "১০৩", "২০১", "২০২", "২০৩", "২০৪",
    "কম্পিউটার ল্যাব", "বিজ্ঞানাগার (ল্যাব)", "খেলার মাঠ", "অডিটোরিয়াম"
];

// Default Hero Carousel Slides for Dimla Govt Girls' High School
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

const defaultTeachersList = [
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
        image_url: "/uploads/cms/cms-1793286454540-252500281.jpeg",
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
];

// Default Managing Committee for Dimla Govt Girls' High School
const defaultCommitteeList = [
    {
        id: 1,
        name: "উপজেলা নির্বাহী অফিসার (ইউএনও)",
        role: "সভাপতি",
        sub: "ডিমলা, নীলফামারী",
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        name: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
        role: "সদস্য সচিব",
        sub: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
        image_url: "/headmaster.png"
    },
    {
        id: 3,
        name: "মোঃ রফিকুল ইসলাম",
        role: "অভিভাবক সদস্য",
        sub: "সমাজসেবক ও শিক্ষানুরাগী",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        name: "মোছাঃ পারভীন আক্তার",
        role: "শিক্ষক প্রতিনিধি",
        sub: "সিনিয়র শিক্ষক",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    }
];

const sampleCommitteeAvatars = [
    { label: "প্রশাসন / ইউএনও", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" },
    { label: "প্রধান শিক্ষক", url: "/headmaster.png" },
    { label: "অভিভাবক (পুরুষ)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { label: "শিক্ষক প্রতিনিধি", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
    { label: "বিশিষ্ট ব্যক্তিত্ব", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
];

// Default Achievers List for Dimla Govt Girls' High School
const defaultAchieversList = [
    {
        id: 1,
        name: "সুমাইয়া জাহান",
        exam: "SSC 2025",
        gpa: "GPA 5.00 (Golden)",
        award: "মেধাবৃত্তি প্রাপ্ত",
        image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        name: "ফারহানা আকতার",
        exam: "SSC 2025",
        gpa: "GPA 5.00",
        award: "বিজ্ঞান বিভাগ সেরা",
        image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        name: "নুসরাত সুলতানা",
        exam: "SSC 2025",
        gpa: "GPA 5.00",
        award: "সাধারণ বৃত্তি",
        image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        name: "সাদিয়া ইসলাম মিম",
        exam: "SSC 2024",
        gpa: "GPA 5.00 (Golden)",
        award: "উপজেলা পর্যায়ে প্রথম",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        name: "মেহেরুন নেসা",
        exam: "SSC 2024",
        gpa: "GPA 5.00",
        award: "মেধাবৃত্তি প্রাপ্ত",
        image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 6,
        name: "তানজিলা আক্তার",
        exam: "SSC 2024",
        gpa: "GPA 5.00",
        award: "মানবিক বিভাগ সেরা",
        image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
    }
];

const sampleStudentAvatars = [
    { label: "ছবি ১", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
    { label: "ছবি ২", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80" },
    { label: "ছবি ৩", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
    { label: "ছবি ৪", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
    { label: "ছবি ৫", url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80" }
];

// Default Staff & Officers List for Dimla Govt Girls' High School
const defaultStaffList = [
    {
        id: 1,
        name: "মোঃ মোখলেছুর রহমান",
        designation: "প্রধান অফিস সহকারী",
        qualification: "B.A",
        phone: "০১৭৮৯-১২৩৪৫৬",
        email: "office.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        name: "মোঃ হাবিবুর রহমান",
        designation: "হিসাব সহকারী",
        qualification: "B.Com (Accounting)",
        phone: "০১৭৯০-২৩৪৫৬৭",
        email: "accounts.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        name: "মোছাঃ মমতাজ বেগম",
        designation: "লাইব্রেরি সহকারী",
        qualification: "Diploma in Library Science",
        phone: "০১৭০১-৩৪৫৬৭৮",
        email: "library.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        name: "মোঃ এনামুল হক",
        designation: "ল্যাব সহকারী (বিজ্ঞান)",
        qualification: "H.S.C (Science)",
        phone: "০১৭১২-৪৫৬৭৮৯",
        email: "lab.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        name: "মোঃ আমিনুল ইসলাম",
        designation: "অফিস সহায়ক (MLSS)",
        qualification: "S.S.C",
        phone: "০১৭২৩-৫৬৭৮৯০",
        email: "support1.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: 6,
        name: "মোঃ কাশেম আলী",
        designation: "নিরাপত্তা প্রহরী",
        qualification: "Eight Pass",
        phone: "০১৭৩৪-৬৭৮৯০১",
        email: "security.dimlagirls@gmail.com",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    }
];

const sampleStaffAvatars = [
    { label: "স্টাফ ১", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ২", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৩", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৪", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৫", url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" },
    { label: "স্টাফ ৬", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
];

const CMSDashboard = () => {
    const navigate = useNavigate();
    const { cms, refreshCMS } = useCMS();

    // Theme Switcher: Dark / Light Mode
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("cms_theme");
        return saved ? saved === "dark" : true;
    });

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem("cms_theme", next ? "dark" : "light");
    };

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "admin") {
            navigate("/cms/login", { replace: true });
        }
    }, [navigate]);

    // Active tab: Defaults to "overview" so user immediately sees the eye-catching welcome dashboard!
    const [activeTab, setActiveTab] = useState("overview");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Auto scroll to top smoothly whenever active tab changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (typeof document !== "undefined") {
            document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
            document.body.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [activeTab]);

    // Live Clock State
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Local editable state populated from CMS Context
    const [formData, setFormData] = useState({
        institutional_info: {
            institution_type_bn: "সরকারি বালিকা উচ্চ বিদ্যালয়",
            institution_type_en: "Government Girls' High School",
            board_name_bn: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর",
            board_name_en: "BISE Dinajpur",
            levels_bn: "৬ষ্ঠ শ্রেণি হতে ১০ম শ্রেণি",
            levels_en: "Class 6 to Class 10",
            groups_bn: "বিজ্ঞান ও মানবিক শাখা",
            groups_en: "Science & Humanities",
            shift_bn: "দিবা শিফট (সকাল ১০:০০ - বিকাল ৪:০০)",
            shift_en: "Day Shift (10:00 AM - 4:00 PM)",
            land_area_bn: "২.৮৫ একর",
            land_area_en: "2.85 Acres",
            building_count_bn: "৩টি বহুতল ভবন",
            building_count_en: "3 Multi-story Buildings",
            classroom_count_bn: "১৮টি সুপরিসর শ্রেণিকক্ষ",
            classroom_count_en: "18 Spacious Classrooms",
            computer_lab_bn: "কম্পিউটার ল্যাব (২০টি আধুনিক কম্পিউটার)",
            computer_lab_en: "Computer Lab (20 Modern Computers)",
            science_lab_bn: "১টি আধুনিক ও সমৃদ্ধ ল্যাবরেটরি",
            science_lab_en: "Fully Equipped Modern Science Lab",
            library_bn: "১টি সমৃদ্ধ পাঠাগার (৩,৫০০+ বই)",
            library_en: "Enriched Library (3,500+ Books)",
            playground_bn: "প্রশস্ত খেলার মাঠ ও স্কাউট প্রাঙ্গণ",
            playground_en: "Spacious Playground & Scout Arena"
        },
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
            notice_bn: "",
            notice_en: "",
            is_active: true
        },
        headmaster: {
            name_bn: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
            name_en: "Abu Jafor Md. Motasim Billah",
            designation_bn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
            designation_en: "Head Teacher (Acting)",
            image_url: "/headmaster.png",
            message_bn: "",
            message_en: ""
        },
        school_story: {
            title_bn: "প্রতিষ্ঠানের গল্প ও ইতিহাস",
            title_en: "Our Heritage & Overview",
            image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
            short_intro_bn: "১৯৬৭ সালে প্রতিষ্ঠিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় অত্র অঞ্চলের নারী শিক্ষার এক অনন্য ও ঐতিহ্যবাহী বাতিঘর।",
            short_intro_en: "Established in 1967, Dimla Government Girls' High School is a historic premier institution dedicated to female empowerment and academic excellence.",
            content_bn: "ডিমলা উপজেলার প্রাণকেন্দ্রে মনোরম ও প্রাকৃতিক ছায়াসুনিবিড় পরিবেশে অবস্থিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়। সুদক্ষ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী, তথ্যপ্রযুক্তিনির্ভর মাল্টিমিডিয়া ক্লাসরুম, সুপরিসর বিজ্ঞানাগার, সমৃদ্ধ লাইব্রেরি ও আধুনিক কম্পিউটার ল্যাব সমৃদ্ধ এই প্রতিষ্ঠান প্রতিবছর বোর্ড পরীক্ষায় শতভাগ সাফল্যের গৌরব অর্জন করে চলেছে। পাঠ্যবইয়ের শিক্ষার পাশাপাশি সহশিক্ষা কার্যক্রম, খেলাধুলা, বিতর্ক প্রতিযোগিতা ও স্কাউটিং কার্যক্রমে আমাদের ছাত্রীরা দেশসেরা সাফল্য বয়ে এনেছে।",
            content_en: "Nestled in the serene heart of Dimla Upazila, Dimla Government Girls' High School features well-equipped modern laboratories, digital classrooms, an enriched library, and a proud history of 100% board exam passing rates."
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
        class_routines: null,
        important_links: [
            { id: 1, title_bn: "শিক্ষা মন্ত্রণালয়", title_en: "Ministry of Education", url: "https://moedu.gov.bd", desc: "moedu.gov.bd" },
            { id: 2, title_bn: "মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি)", title_en: "DSHE Bangladesh", url: "https://dshe.gov.bd", desc: "dshe.gov.bd" },
            { id: 3, title_bn: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর", title_en: "BISE Dinajpur", url: "https://dinajpureducationboard.gov.bd", desc: "dinajpureducationboard.gov.bd" },
            { id: 4, title_bn: "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)", title_en: "NCTB Bangladesh", url: "http://nctb.gov.bd", desc: "nctb.gov.bd" },
            { id: 5, title_bn: "শিক্ষক বাতায়ন (Shikkhok Batayon)", title_en: "Teachers Portal", url: "https://teachers.gov.bd", desc: "teachers.gov.bd" },
            { id: 6, title_bn: "বাংলাদেশ জাতীয় তথ্য বাতায়ন", title_en: "Bangladesh National Portal", url: "https://bangladesh.gov.bd", desc: "bangladesh.gov.bd" }
        ],
        committee: defaultCommitteeList,
        achievers: defaultAchieversList,
        staff: defaultStaffList,
        gallery: [],
        teachers: defaultTeachersList,
        hero_slides: defaultHeroSlides
    });

    useEffect(() => {
        if (cms) {
            setFormData({
                institutional_info: { ...formData.institutional_info, ...(cms.institutional_info || {}) },
                general: { ...formData.general, ...(cms.general || {}) },
                emergency_notice: { ...formData.emergency_notice, ...(cms.emergency_notice || {}) },
                headmaster: {
                    ...formData.headmaster,
                    ...(cms.headmaster || {}),
                    image_url: cms.headmaster?.image_url || "/headmaster.png"
                },
                school_story: { ...formData.school_story, ...(cms.school_story || {}) },
                timings: { ...formData.timings, ...(cms.timings || {}) },
                notices: Array.isArray(cms.notices) ? cms.notices : [],
                class_routines: cms.class_routines || formData.class_routines,
                important_links: (cms.important_links && cms.important_links.length > 0) ? cms.important_links : formData.important_links,
                committee: (cms.committee && cms.committee.length > 0) ? cms.committee : defaultCommitteeList,
                achievers: (cms.achievers && cms.achievers.length > 0) ? cms.achievers : defaultAchieversList,
                staff: (cms.staff && cms.staff.length > 0) ? cms.staff : defaultStaffList,
                gallery: cms.gallery || [],
                teachers: (cms.teachers && cms.teachers.length > 0) ? cms.teachers : defaultTeachersList,
                hero_slides: (cms.hero_slides && cms.hero_slides.length > 0) ? cms.hero_slides : defaultHeroSlides
            });
        }
    }, [cms]);

    // Hero Slides Editor State
    const [slideModalOpen, setSlideModalOpen] = useState(false);
    const [editingSlideIdx, setEditingSlideIdx] = useState(null);
    const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
    const [slideForm, setSlideForm] = useState({
        title_bn: "",
        title_en: "",
        subtitle_bn: "",
        subtitle_en: "",
        badge_bn: "",
        badge_en: "",
        image_url: "",
        is_active: true
    });

    const handleOpenAddSlide = () => {
        setEditingSlideIdx(null);
        setSlideForm({
            title_bn: "",
            title_en: "",
            subtitle_bn: "",
            subtitle_en: "",
            badge_bn: "ঐতিহ্যবাহী সরকারি নারী বিদ্যাপীঠ • স্থাপিত ১৯৬৭",
            badge_en: "Premier Govt. Girls' Institution • Est. 1967",
            image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80",
            is_active: true
        });
        setSlideModalOpen(true);
    };

    const handleOpenEditSlide = (idx) => {
        setEditingSlideIdx(idx);
        const sl = formData.hero_slides[idx] || {};
        setSlideForm({
            title_bn: sl.title_bn || "",
            title_en: sl.title_en || "",
            subtitle_bn: sl.subtitle_bn || "",
            subtitle_en: sl.subtitle_en || "",
            badge_bn: sl.badge_bn || "",
            badge_en: sl.badge_en || "",
            image_url: sl.image_url || "",
            is_active: sl.is_active ?? true
        });
        setSlideModalOpen(true);
    };

    const handleSaveSlideModal = () => {
        if (!slideForm.title_bn) {
            showToast("স্লাইড শিরোনাম আবশ্যক!", "error");
            return;
        }
        const updated = [...(formData.hero_slides || [])];
        if (editingSlideIdx !== null && editingSlideIdx >= 0) {
            updated[editingSlideIdx] = {
                ...updated[editingSlideIdx],
                ...slideForm
            };
        } else {
            updated.push({
                id: Date.now(),
                ...slideForm
            });
        }
        setFormData({ ...formData, hero_slides: updated });
        handleSaveSection("hero_slides", updated);
        setSlideModalOpen(false);
        setEditingSlideIdx(null);
        showToast("স্লাইড সফলভাবে সংরক্ষণ করা হয়েছে!", "success");
    };

    const handleDeleteSlide = (idx) => {
        if (!window.confirm("আপনি কি নিশ্চিত এই স্লাইডটি মুছে ফেলতে চান?")) return;
        const updated = formData.hero_slides.filter((_, i) => i !== idx);
        setFormData({ ...formData, hero_slides: updated });
        handleSaveSection("hero_slides", updated);
        showToast("স্লাইড মুছে ফেলা হয়েছে!", "success");
    };

    const handleToggleSlideActive = (idx) => {
        const updated = [...formData.hero_slides];
        updated[idx] = {
            ...updated[idx],
            is_active: !(updated[idx].is_active ?? true)
        };
        setFormData({ ...formData, hero_slides: updated });
        handleSaveSection("hero_slides", updated);
        showToast("স্লাইড স্ট্যাটাস আপডেট হয়েছে!", "success");
    };

    const handleMoveSlide = (idx, direction) => {
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= formData.hero_slides.length) return;
        const updated = [...formData.hero_slides];
        const [moved] = updated.splice(idx, 1);
        updated.splice(newIdx, 0, moved);
        setFormData({ ...formData, hero_slides: updated });
        handleSaveSection("hero_slides", updated);
        showToast("স্লাইডের ক্রম পরিবর্তন করা হয়েছে!", "success");
    };

    // Routine Editor State
    const [routineClass, setRoutineClass] = useState("class_6");
    const [routineDay, setRoutineDay] = useState("রবিবার");
    const [newPeriodModal, setNewPeriodModal] = useState(false);
    const [editingPeriodIdx, setEditingPeriodIdx] = useState(null);
    const [periodForm, setPeriodForm] = useState({
        period: "১ম পিরিয়ড",
        subject: "",
        teacher: "",
        room: ""
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    const handleSaveSection = async (sectionName, dataToSave) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/admin/cms/update", {
                section: sectionName,
                data: dataToSave
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await refreshCMS();
            showToast("তথ্য সফলভাবে ডেটাবেজে সংরক্ষিত ও ওয়েবসাইটে লাইভ আপডেট হয়েছে!");
        } catch (err) {
            console.error(err);
            showToast("সংরক্ষণে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (file, callback, options = {}) => {
        if (!file) return;

        // 1. Instant zero-delay local preview for instantaneous user feedback
        const blobPreview = createInstantPreview(file);
        if (blobPreview && typeof options.onPreview === "function") {
            options.onPreview(blobPreview);
        }

        setUploading(true);
        try {
            // 2. Client-side canvas compression (~30ms, reduces 8MB to 120KB)
            const compressedFile = await compressImage(file, {
                maxWidth: options.maxWidth || 1200,
                maxHeight: options.maxHeight || 1200,
                quality: options.quality || 0.82
            });

            const uploadData = new FormData();
            uploadData.append("image", compressedFile);

            const token = localStorage.getItem("token");
            const res = await api.post("/api/admin/cms/upload", uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data && res.data.url) {
                callback(res.data.url);
                showToast("ছবি সফলভাবে অপ্টিমাইজ ও আপলোড সম্পন্ন হয়েছে!");
            }
        } catch (err) {
            console.error(err);
            showToast("ছবি আপলোড ব্যর্থ হয়েছে (পুনরায় চেষ্টা করুন)।", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/cms/login", { replace: true });
    };

    // Notice Modal State
    const [editingNotice, setEditingNotice] = useState(null);
    const [noticeModalOpen, setNoticeModalOpen] = useState(false);

    const handleSaveNotice = () => {
        if (!editingNotice.title_bn) {
            showToast("নোটিশের বাংলা শিরোনাম আবশ্যক!", "error");
            return;
        }

        let updatedNotices = [...(formData.notices || [])];
        if (editingNotice.id) {
            updatedNotices = updatedNotices.map(n => n.id === editingNotice.id ? editingNotice : n);
        } else {
            const newId = Date.now();
            updatedNotices.unshift({ ...editingNotice, id: newId });
        }

        setFormData({ ...formData, notices: updatedNotices });
        handleSaveSection("notices", updatedNotices);
        setNoticeModalOpen(false);
        setEditingNotice(null);
    };

    const handleDeleteNotice = (id) => {
        if (window.confirm("আপনি কি নিশ্চিতভাবে এই নোটিশটি মুছে ফেলতে চান?")) {
            const updated = formData.notices.filter(n => n.id !== id);
            setFormData({ ...formData, notices: updated });
            handleSaveSection("notices", updated);
        }
    };

    // Routine Actions
    const handleAddPeriodToRoutine = () => {
        if (!periodForm.subject || !periodForm.teacher) {
            showToast("বিষয়ের নাম ও শিক্ষকের নাম আবশ্যক!", "error");
            return;
        }

        const routines = formData.class_routines || {};
        const classes = routines.classes || {};
        const curClass = classes[routineClass] || { schedule: {} };
        const schedule = curClass.schedule || {};
        const curDayPeriods = [...(schedule[routineDay] || [])];

        if (editingPeriodIdx !== null && editingPeriodIdx >= 0) {
            curDayPeriods[editingPeriodIdx] = { ...periodForm };
        } else {
            curDayPeriods.push({ ...periodForm });
        }

        const updatedClasses = {
            ...classes,
            [routineClass]: {
                ...curClass,
                schedule: {
                    ...schedule,
                    [routineDay]: curDayPeriods
                }
            }
        };

        const updatedRoutines = {
            ...routines,
            classes: updatedClasses
        };

        setFormData({ ...formData, class_routines: updatedRoutines });
        handleSaveSection("class_routines", updatedRoutines);
        setNewPeriodModal(false);
        setEditingPeriodIdx(null);
        setPeriodForm({ period: "১ম পিরিয়ড", subject: "", teacher: "", room: "" });
    };

    const handleDeletePeriod = (pIdx) => {
        const routines = formData.class_routines || {};
        const classes = routines.classes || {};
        const curClass = classes[routineClass] || { schedule: {} };
        const schedule = curClass.schedule || {};
        const curDayPeriods = [...(schedule[routineDay] || [])].filter((_, i) => i !== pIdx);

        const updatedClasses = {
            ...classes,
            [routineClass]: {
                ...curClass,
                schedule: {
                    ...schedule,
                    [routineDay]: curDayPeriods
                }
            }
        };

        const updatedRoutines = {
            ...routines,
            classes: updatedClasses
        };

        setFormData({ ...formData, class_routines: updatedRoutines });
        handleSaveSection("class_routines", updatedRoutines);
    };

    // Teachers Management State
    const [teacherModalOpen, setTeacherModalOpen] = useState(false);
    const [editingTeacherIdx, setEditingTeacherIdx] = useState(null);
    const [teacherForm, setTeacherForm] = useState({
        name_bn: "",
        name_en: "",
        designation_bn: "সহকারী শিক্ষক",
        designation_en: "Assistant Teacher",
        department_bn: "সাধারণ",
        department_en: "General",
        qualification: "B.A, B.Ed",
        phone: "",
        email: "",
        image_url: "",
        order: 1
    });

    const handleSaveTeacher = (e) => {
        e?.preventDefault();
        const updated = [...(formData.teachers || [])];
        if (editingTeacherIdx !== null) {
            updated[editingTeacherIdx] = {
                ...updated[editingTeacherIdx],
                ...teacherForm
            };
        } else {
            updated.push({
                id: Date.now(),
                ...teacherForm,
                order: updated.length + 1
            });
        }
        setFormData({ ...formData, teachers: updated });
        handleSaveSection("teachers", updated);
        setTeacherModalOpen(false);
        setEditingTeacherIdx(null);
        showToast("শিক্ষকের তথ্য সফলভাবে সংরক্ষিত হয়েছে!", "success");
    };

    const handleDeleteTeacher = (idx) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষকের তথ্য তালিকা থেকে মুছে ফেলতে চান?")) return;
        const updated = (formData.teachers || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, teachers: updated });
        handleSaveSection("teachers", updated);
        showToast("শিক্ষকের তথ্য মুছে ফেলা হয়েছে!", "success");
    };

    const handleMoveTeacher = (idx, direction) => {
        const newIdx = idx + direction;
        const teachers = [...(formData.teachers || [])];
        if (newIdx < 0 || newIdx >= teachers.length) return;
        const [moved] = teachers.splice(idx, 1);
        teachers.splice(newIdx, 0, moved);
        setFormData({ ...formData, teachers });
        handleSaveSection("teachers", teachers);
        showToast("ক্রমবিন্যাস সফলভাবে সংরক্ষিত হয়েছে!", "success");
    };

    // Committee Management State & Handlers
    const [committeeModalOpen, setCommitteeModalOpen] = useState(false);
    const [editingCommitteeIdx, setEditingCommitteeIdx] = useState(null);
    const [committeeForm, setCommitteeForm] = useState({
        name: "",
        role: "সদস্য",
        sub: "",
        image_url: sampleCommitteeAvatars[0].url
    });

    const handleOpenAddCommittee = () => {
        setEditingCommitteeIdx(null);
        setCommitteeForm({
            name: "",
            role: "সদস্য",
            sub: "বিদ্যালয় পরিচালনা ও উন্নয়ন পর্ষদ",
            image_url: sampleCommitteeAvatars[Math.floor(Math.random() * sampleCommitteeAvatars.length)].url
        });
        setCommitteeModalOpen(true);
    };

    const handleOpenEditCommittee = (idx) => {
        setEditingCommitteeIdx(idx);
        const item = (formData.committee || [])[idx] || {};
        setCommitteeForm({
            name: item.name || "",
            role: item.role || "সদস্য",
            sub: item.sub || "",
            image_url: item.image_url || item.image || sampleCommitteeAvatars[0].url
        });
        setCommitteeModalOpen(true);
    };

    const handleSaveCommitteeModal = (e) => {
        if (e) e.preventDefault();
        if (!committeeForm.name.trim()) {
            showToast("সদস্যের নাম লিখুন!", "error");
            return;
        }
        let updated = [...(formData.committee || [])];
        if (editingCommitteeIdx !== null) {
            updated[editingCommitteeIdx] = {
                ...updated[editingCommitteeIdx],
                ...committeeForm
            };
        } else {
            updated.push({
                id: Date.now(),
                ...committeeForm
            });
        }
        setFormData({ ...formData, committee: updated });
        handleSaveSection("committee", updated);
        setCommitteeModalOpen(false);
        setEditingCommitteeIdx(null);
        showToast("কমিটি সদস্যের তথ্য সফলভাবে সংরক্ষিত হয়েছে!", "success");
    };

    const handleDeleteCommittee = (idx) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই সদস্যকে অপসারণ করতে চান?")) return;
        const updated = (formData.committee || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, committee: updated });
        handleSaveSection("committee", updated);
        showToast("কমিটি সদস্য অপসারিত হয়েছে", "success");
    };

    // Staff & Officers Management State & Handlers
    const [staffModalOpen, setStaffModalOpen] = useState(false);
    const [editingStaffIdx, setEditingStaffIdx] = useState(null);
    const [staffForm, setStaffForm] = useState({
        name: "",
        designation: "প্রধান অফিস সহকারী",
        qualification: "B.A",
        phone: "",
        email: "",
        image: sampleStaffAvatars[0].url
    });

    const handleOpenAddStaff = () => {
        setEditingStaffIdx(null);
        setStaffForm({
            name: "",
            designation: "অফিস সহকারী",
            qualification: "H.S.C",
            phone: "",
            email: "",
            image: sampleStaffAvatars[Math.floor(Math.random() * sampleStaffAvatars.length)].url
        });
        setStaffModalOpen(true);
    };

    const handleOpenEditStaff = (idx) => {
        setEditingStaffIdx(idx);
        const item = (formData.staff || [])[idx] || {};
        setStaffForm({
            name: item.name || "",
            designation: item.designation || "অফিস সহকারী",
            qualification: item.qualification || "",
            phone: item.phone || "",
            email: item.email || "",
            image: item.image || item.image_url || sampleStaffAvatars[0].url
        });
        setStaffModalOpen(true);
    };

    const handleSaveStaffModal = (e) => {
        if (e) e.preventDefault();
        if (!staffForm.name.trim()) {
            showToast("কর্মকর্তা/কর্মচারীর নাম লিখুন!", "error");
            return;
        }
        let updated = [...(formData.staff || [])];
        if (editingStaffIdx !== null) {
            updated[editingStaffIdx] = {
                ...updated[editingStaffIdx],
                ...staffForm
            };
        } else {
            updated.push({
                id: Date.now(),
                ...staffForm
            });
        }
        setFormData({ ...formData, staff: updated });
        handleSaveSection("staff", updated);
        setStaffModalOpen(false);
        setEditingStaffIdx(null);
        showToast("কর্মকর্তা/কর্মচারীর তথ্য সফলভাবে সংরক্ষিত হয়েছে!", "success");
    };

    const handleDeleteStaff = (idx) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই কর্মীর তথ্য অপসারণ করতে চান?")) return;
        const updated = (formData.staff || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, staff: updated });
        handleSaveSection("staff", updated);
        showToast("কর্মকর্তা/কর্মচারী অপসারিত হয়েছেন", "success");
    };

    // Achievers Management State & Handlers
    const [achieverModalOpen, setAchieverModalOpen] = useState(false);
    const [editingAchieverIdx, setEditingAchieverIdx] = useState(null);
    const [achieverForm, setAchieverForm] = useState({
        name: "",
        exam: "SSC 2025",
        gpa: "GPA 5.00 (Golden)",
        award: "মেধাবৃত্তি প্রাপ্ত",
        image_url: sampleStudentAvatars[0].url
    });

    const handleOpenAddAchiever = () => {
        setEditingAchieverIdx(null);
        setAchieverForm({
            name: "",
            exam: "SSC 2025",
            gpa: "GPA 5.00 (Golden)",
            award: "মেধাবৃত্তি প্রাপ্ত",
            image_url: sampleStudentAvatars[Math.floor(Math.random() * sampleStudentAvatars.length)].url
        });
        setAchieverModalOpen(true);
    };

    const handleOpenEditAchiever = (idx) => {
        setEditingAchieverIdx(idx);
        const item = (formData.achievers || [])[idx] || {};
        setAchieverForm({
            name: item.name || "",
            exam: item.exam || "SSC 2025",
            gpa: item.gpa || "GPA 5.00",
            award: item.award || "",
            image_url: item.image_url || item.image || sampleStudentAvatars[0].url
        });
        setAchieverModalOpen(true);
    };

    const handleSaveAchieverModal = (e) => {
        if (e) e.preventDefault();
        if (!achieverForm.name.trim()) {
            showToast("শিক্ষার্থীর নাম লিখুন!", "error");
            return;
        }
        let updated = [...(formData.achievers || [])];
        if (editingAchieverIdx !== null) {
            updated[editingAchieverIdx] = {
                ...updated[editingAchieverIdx],
                ...achieverForm
            };
        } else {
            updated.push({
                id: Date.now(),
                ...achieverForm
            });
        }
        setFormData({ ...formData, achievers: updated });
        handleSaveSection("achievers", updated);
        setAchieverModalOpen(false);
        setEditingAchieverIdx(null);
        showToast("কৃতি শিক্ষার্থীর তথ্য সফলভাবে সংরক্ষিত হয়েছে!", "success");
    };

    const handleDeleteAchiever = (idx) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীকে তালিকা থেকে মুছতে চান?")) return;
        const updated = (formData.achievers || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, achievers: updated });
        handleSaveSection("achievers", updated);
        showToast("কৃতি শিক্ষার্থী অপসারিত হয়েছে", "success");
    };

    // All Navigation Items
    const navItems = [
        { id: "overview", label: "ড্যাশবোর্ড ওভারভিউ", icon: LayoutGrid, desc: "প্রথম দর্শনেই এক্সিকিউটিভ সামারি" },
        { id: "hero_slides", label: "হিরো ব্যানার স্লাইডার", icon: Layers, desc: "মূল পেজের ছবি ও স্লাইড পরিচালনা" },
        { id: "institutional", label: "এক নজরে পরিচিতি", icon: Building2, desc: "প্রাতিষ্ঠানিক পরিসংখ্যান ও পরিকাঠামো" },
        { id: "school_story", label: "প্রতিষ্ঠানের গল্প ও ইতিহাস", icon: BookOpen, desc: "ক্যাম্পাসের ছবি, গল্প ও পরিচিতি" },
        { id: "notices_board", label: "নোটিশ বোর্ড ও সার্কুলার", icon: Bell, desc: "সকল অফিসিয়াল বিজ্ঞপ্তি ও নোটিশ" },
        { id: "routines", label: "ক্লাস রুটিন পরিচালনা", icon: Calendar, desc: "৬ষ্ঠ-১০ম শ্রেণি সাপ্তাহিক রুটিন" },
        { id: "teachers", label: "সম্মানিত শিক্ষকমণ্ডলী", icon: GraduationCap, desc: "শিক্ষকদের তালিকা, পদবি ও ছবি" },
        { id: "staff", label: "কর্মকর্তা ও কর্মচারী", icon: Briefcase, desc: "অফিস ও সহায়ক স্টাফবৃন্দ" },
        { id: "general", label: "সাধারণ তথ্য ও যোগাযোগ", icon: FileText, desc: "নাম, EIIN, ফোন ও ঠিকানা" },
        { id: "notice", label: "জরুরি নোটিশ বার", icon: Sparkles, desc: "টপ স্ক্রলিং জরুরি নোটিশ টিকার" },
        { id: "headmaster", label: "প্রধান শিক্ষকের বাণী ও গল্প", icon: Award, desc: "প্রধান শিক্ষকের ছবি ও বাণী" },
        { id: "timings", label: "প্রতিষ্ঠানের সময়সূচি", icon: Clock, desc: "সমাবেশ, ক্লাস, টিফিন ও অফিস সময়" },
        { id: "links", label: "ডান পাশের গুরুত্বপূর্ণ লিংক", icon: Link2, desc: "সাইডবার গুরুত্বপূর্ণ বাতায়ন" },
        { id: "committee", label: "ব্যবস্থাপনা কমিটি", icon: Users, desc: "পরিচালনা পর্ষদের সদস্যবৃন্দ" },
        { id: "achievers", label: "কৃতি শিক্ষার্থী", icon: Award, desc: "বোর্ড পরীক্ষায় সেরা সাফল্য" },
        { id: "gallery", label: "ফটো ও ভিডিও গ্যালারি", icon: ImageIcon, desc: "ইভেন্ট ও ক্যাম্পাসের ছবি" },
    ];

    // Clock strings
    const clockTime = currentTime.toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
    const clockDate = currentTime.toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "শুভ সকাল";
        if (hour < 15) return "শুভ দুপুর";
        if (hour < 18) return "শুভ অপরাহ্ন";
        return "শুভ সন্ধ্যা";
    };

    return (
        <div className={`min-h-screen ${isDark ? "cms-dark bg-slate-950 text-slate-100" : "cms-light bg-slate-100 text-slate-800"} font-sans flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200`}>
            
            {/* 1. TOP EXECUTIVE HEADER BAR */}
            <header className={`backdrop-blur-md sticky top-0 z-40 transition-colors shadow-md ${
                isDark 
                    ? "bg-slate-900/90 border-b border-slate-800" 
                    : "bg-white/95 border-b border-slate-200"
            }`}>
                <div className="px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
                    {/* Brand & School Logo */}
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white p-0.5 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40 overflow-hidden">
                            <img src="/logo.png" alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`font-black text-base sm:text-lg tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                    Website CMS Studio
                                </h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border shadow-xs ${
                                    isDark
                                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                        : "bg-emerald-100/80 border-emerald-300 text-emerald-800"
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? "bg-emerald-400" : "bg-emerald-600"}`}></span>
                                    Executive Suite
                                </span>
                            </div>
                            <p className={`text-xs truncate max-w-xs sm:max-w-md ${isDark ? "text-slate-400" : "text-slate-600 font-semibold"}`}>
                                {formData.general.school_name_bn} • EIIN: {formData.general.eiin}
                            </p>
                        </div>
                    </div>

                    {/* Right Tools: Live Clock & Quick Buttons */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {/* Live Digital Clock Badge */}
                        <div className={`hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl border shadow-inner ${
                            isDark
                                ? "bg-slate-800/80 border-slate-700/80"
                                : "bg-slate-100 border-slate-300"
                        }`}>
                            <Clock className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-700"}`} />
                            <div className="text-right">
                                <div className={`text-xs font-black font-mono tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {clockTime}
                                </div>
                                <div className={`text-[10px] font-bold ${isDark ? "text-emerald-400/90" : "text-emerald-700"}`}>
                                    {clockDate}
                                </div>
                            </div>
                        </div>

                        {/* Light / Dark Mode Switcher */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-xs ${
                                isDark
                                    ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700/80"
                                    : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                            }`}
                            title={isDark ? "লাইট মোডে স্যুইচ করুন" : "ডার্ক মোডে স্যুইচ করুন"}
                        >
                            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-amber-800" />}
                            <span className="hidden sm:inline">{isDark ? "লাইট মোড" : "ডার্ক মোড"}</span>
                        </button>

                        {/* Live Website Preview Button */}
                        <a
                            href="#/"
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                                isDark
                                    ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30"
                                    : "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
                            }`}
                        >
                            <ExternalLink className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-800"}`} />
                            <span className="hidden sm:inline">পাবলিক ওয়েবসাইট</span>
                        </a>

                        {/* Switch to ERP Button */}
                        <a
                            href="#/admin/dashboard"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                                isDark
                                    ? "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30"
                                    : "bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200"
                            }`}
                        >
                            <Shield className={`w-3.5 h-3.5 ${isDark ? "text-indigo-400" : "text-indigo-800"}`} />
                            <span className="hidden sm:inline">স্কুল ERP</span>
                        </a>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isDark
                                    ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/20"
                                    : "text-slate-600 hover:text-red-700 hover:bg-red-50 border-slate-200 hover:border-red-300 shadow-xs"
                            }`}
                            title="লগআউট"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border animate-in slide-in-from-bottom-5 ${
                    toast.type === "success"
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-red-600 text-white border-red-400"
                }`}>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* 2. MAIN CMS WORKSPACE WITH LEFT SIDEBAR */}
            <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 sm:p-6 gap-6 items-start">
                
                {/* LEFT SIDEBAR NAVIGATION */}
                <aside className={`w-full md:w-72 md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto backdrop-blur-sm rounded-3xl p-3.5 flex-shrink-0 space-y-1.5 transition-colors ${
                    isDark 
                        ? "bg-slate-900/80 border border-slate-800 shadow-xl" 
                        : "bg-white border border-slate-200 shadow-lg shadow-slate-200/50"
                }`}>
                    
                    {/* Live Clock on Mobile / Sidebar Top */}
                    <div className={`lg:hidden p-3 rounded-2xl border text-center mb-2 ${
                        isDark 
                            ? "bg-gradient-to-r from-emerald-950/40 to-slate-800 border-emerald-500/20" 
                            : "bg-emerald-50 border-emerald-200"
                    }`}>
                        <div className={`text-sm font-mono font-black ${isDark ? "text-emerald-400" : "text-emerald-800"}`}>
                            {clockTime}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {clockDate}
                        </div>
                    </div>

                    <div className={`px-3 py-2 text-[10.5px] font-black uppercase tracking-wider border-b mb-2 flex items-center justify-between ${
                        isDark ? "text-slate-400 border-slate-800/80" : "text-slate-600 border-slate-200"
                    }`}>
                        <span>কন্ট্রোল প্যানেল মেনু</span>
                        <span className={`text-[9.5px] font-bold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                            {navItems.length}টি ক্যাটাগরি
                        </span>
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-300 ease-out cursor-pointer group hover:-translate-y-0.5 hover:shadow-md ${
                                    active
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30 font-bold scale-[1.01]"
                                        : isDark
                                            ? "text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent font-medium"
                                            : "text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-900 border border-transparent font-semibold"
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                                    active
                                        ? "bg-white/20 text-white shadow-inner"
                                        : isDark
                                            ? "bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300"
                                            : "bg-slate-100 text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-900 border border-slate-200/80"
                                }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs truncate group-hover:translate-x-0.5 transition-transform duration-200">
                                        {item.label}
                                    </div>
                                    <div className={`text-[10px] truncate ${
                                        active 
                                            ? "text-emerald-100" 
                                            : isDark 
                                                ? "text-slate-400" 
                                                : "text-slate-500 font-normal"
                                    }`}>
                                        {item.desc}
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    <div className="pt-3 mt-3 border-t border-slate-800/80 px-2 text-center">
                        <div className="text-[10.5px] font-mono text-emerald-400/80 font-bold">
                            ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                            Website CMS Studio • v2.3 Premium
                        </div>
                    </div>
                </aside>

                {/* RIGHT MAIN CONTENT AREA */}
                <main className="flex-1 min-w-0 w-full">
                    
                    {/* TAB 0: ড্যাশবোর্ড ওভারভিউ (USER REQUESTED: দেখে মন ভালো হওয়ার মতো এক্সিকিউটিভ ভিউ) */}
                    {activeTab === "overview" && (
                        <div className="space-y-6 animate-in fade-in">
                            {/* Executive Welcome Hero Banner */}
                            <div className="cms-welcome-banner relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 shadow-2xl p-6 sm:p-8">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                        <span>{getGreeting()}, সম্মানিত অ্যাডমিনিস্ট্রেটর!</span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug !text-white">
                                        স্বাগতম ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় <br className="hidden sm:inline" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 font-extrabold">
                                            ওয়েবসাইট ম্যানেজমেন্ট ও সেন্ট্রাল কন্ট্রোল প্যানেলে
                                        </span>
                                    </h2>

                                    <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed !text-slate-200">
                                        এখান থেকে আপনি বিদ্যালয়ের পাবলিক পোর্টালের নোটিশ, ক্লাস রুটিন, ছবি, প্রাতিষ্ঠানিক তথ্য ও গুরুত্বপূর্ণ সকল বাতায়ন রিয়েল-টাইমে নিয়ন্ত্রণ করতে পারছেন।
                                    </p>

                                    {/* Quick Info Badges */}
                                    <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
                                        <div className="cms-badge px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-emerald-400/40 text-white flex items-center gap-2 font-semibold shadow-xs">
                                            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span className="text-white font-medium">EIIN: {formData.general.eiin || "১২৪৭৫৪"}</span>
                                        </div>
                                        <div className="cms-badge px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-emerald-400/40 text-white flex items-center gap-2 font-semibold shadow-xs">
                                            <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                            <span className="text-white font-medium">স্থাপিত: {formData.general.est_year || "১৯৬৭"} খ্রি.</span>
                                        </div>
                                        <div className="cms-badge px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-bold shadow-xs">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                                            <span className="text-emerald-300">সিস্টেম লাইভ ও অনলাইন</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4 Key Performance Metric Tiles */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg space-y-1 transition-all ${
                                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                                }`}>
                                    <div className={`flex items-center justify-between text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        <span>মোট শিক্ষার্থী</span>
                                        <GraduationCap className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                        ৫৪৫ জন
                                    </div>
                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>১০০% অটো সিঙ্ক সক্রিয়</span>
                                    </div>
                                </div>

                                <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg space-y-1 transition-all ${
                                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                                }`}>
                                    <div className={`flex items-center justify-between text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        <span>প্রকাশিত নোটিশ</span>
                                        <Bell className="w-4 h-4 text-teal-500" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-300">
                                        {(formData.notices?.length || 4)}টি
                                    </div>
                                    <div className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        ওয়েবসাইটে প্রদর্শিত
                                    </div>
                                </div>

                                <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg space-y-1 transition-all ${
                                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                                }`}>
                                    <div className={`flex items-center justify-between text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        <span>ক্লাস রুটিন</span>
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-300">
                                        ৫টি শ্রেণি
                                    </div>
                                    <div className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        ৬ষ্ঠ হতে ১০ম শ্রেণি
                                    </div>
                                </div>

                                <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg space-y-1 transition-all ${
                                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                                }`}>
                                    <div className={`flex items-center justify-between text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        <span>পাশের হার</span>
                                        <Award className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300">
                                        ৯৯.৪%
                                    </div>
                                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                        বোর্ড পরীক্ষার গড় সাফল্য
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Shortcuts Grid */}
                            <div className={`rounded-3xl border p-6 shadow-xl space-y-4 transition-all ${
                                isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                            }`}>
                                <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <span>দ্রুত কন্ট্রোল ও শর্টকাট (Quick Actions)</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                    <button
                                        onClick={() => setActiveTab("notices_board")}
                                        className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900" 
                                                : "bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <h4 className={`font-bold text-xs sm:text-sm ${
                                            isDark ? "text-white group-hover:text-emerald-300" : "text-slate-900 group-hover:text-emerald-700"
                                        }`}>
                                            নতুন নোটিশ প্রকাশ করুন
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            ওয়েবসাইটের নোটিশ বোর্ডে বিজ্ঞপ্তি যোগ ও এডিট
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("routines")}
                                        className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900" 
                                                : "bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <h4 className={`font-bold text-xs sm:text-sm ${
                                            isDark ? "text-white group-hover:text-blue-300" : "text-slate-900 group-hover:text-blue-700"
                                        }`}>
                                            ক্লাস রুটিন পরিচালনা
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            প্রতিটি শ্রেণির পিরিয়ড ও শিক্ষক শিডিউল পরিবর্তন
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("school_story")}
                                        className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900" 
                                                : "bg-slate-50 border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <h4 className={`font-bold text-xs sm:text-sm ${
                                            isDark ? "text-white group-hover:text-amber-300" : "text-slate-900 group-hover:text-amber-700"
                                        }`}>
                                            প্রতিষ্ঠানের গল্প ও পরিচিতি
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            ক্যাম্পাসের ছবি ও ইতিহাস আপডেট করুন
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("headmaster")}
                                        className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900" 
                                                : "bg-slate-50 border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
                                        </div>
                                        <h4 className={`font-bold text-xs sm:text-sm ${
                                            isDark ? "text-white group-hover:text-teal-300" : "text-slate-900 group-hover:text-teal-700"
                                        }`}>
                                            প্রধান শিক্ষকের বাণী ও ছবি
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            প্রধান শিক্ষকের ফটো ও বক্তব্য আপডেট করুন
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("links")}
                                        className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900" 
                                                : "bg-slate-50 border-slate-200 hover:border-purple-500 hover:bg-purple-50/30 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Link2 className="w-4 h-4" />
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <h4 className={`font-bold text-xs sm:text-sm ${
                                            isDark ? "text-white group-hover:text-purple-300" : "text-slate-900 group-hover:text-purple-700"
                                        }`}>
                                            গুরুত্বপূর্ণ বাতায়ন লিংক
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            সাইডবারের সরকারি লিংক ও পোর্টাল পরিবর্তন
                                        </p>
                                    </button>

                                    <a
                                        href="#/class-routine"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer block ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900" 
                                                : "bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <h4 className={`font-bold text-xs sm:text-sm ${
                                            isDark ? "text-white group-hover:text-emerald-300" : "text-slate-900 group-hover:text-emerald-700"
                                        }`}>
                                            পাবলিক ক্লাস রুটিন ভিউ
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            শিক্ষার্থীরা যেভাবে রুটিন দেখবে তা চেক করুন
                                        </p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: হিরো ব্যানার স্লাইডার */}
                    {activeTab === "hero_slides" && (
                        <div className={`rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 transition-all ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                        }`}>
                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <div>
                                    <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                        <Layers className="w-5 h-5 text-emerald-500" />
                                        <span>হিরো ব্যানার স্লাইডার পরিচালনা (Hero Carousel)</span>
                                    </h3>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        পাবলিক ওয়েবসাইটের প্রধান ব্যানারে যে ছবি ও বার্তাগুলো পর্যায়ক্রমে স্লাইড হয়, সেগুলো এখান থেকে কাস্টমাইজ করুন।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={handleOpenAddSlide}
                                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                                            isDark 
                                                ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                                                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                                        }`}
                                    >
                                        <Plus className="w-4 h-4 text-emerald-500" />
                                        <span>নতুন স্লাইড</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSaveSection("hero_slides", formData.hero_slides)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সকল স্লাইড সংরক্ষণ"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Live Interactive Preview Box */}
                            {formData.hero_slides && formData.hero_slides.length > 0 && (
                                <div className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${
                                    isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-emerald-500" />
                                            <h4 className={`text-xs font-bold tracking-wide ${isDark ? "text-white" : "text-slate-800"}`}>
                                                লাইভ হিরো স্লাইডার প্রিভিউ (Public Website Preview)
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                স্লাইড {previewSlideIdx + 1} / {formData.hero_slides.length}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setPreviewSlideIdx((prev) => (prev - 1 + formData.hero_slides.length) % formData.hero_slides.length)}
                                                    className={`p-1 rounded-lg cursor-pointer ${
                                                        isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
                                                    }`}
                                                >
                                                    <ChevronLeft className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setPreviewSlideIdx((prev) => (prev + 1) % formData.hero_slides.length)}
                                                    className={`p-1 rounded-lg cursor-pointer ${
                                                        isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
                                                    }`}
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Simulated Hero Banner */}
                                    {(() => {
                                        const cur = formData.hero_slides[previewSlideIdx] || formData.hero_slides[0];
                                        return (
                                            <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] border border-slate-800 bg-slate-900 flex items-center p-6">
                                                <img
                                                    src={resolveMediaUrl(cur.image_url)}
                                                    alt="Preview Slide"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-emerald-950/60 to-transparent pointer-events-none"></div>
                                                <div className="relative z-10 max-w-xl text-white space-y-2">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-semibold">
                                                        <Sparkles className="w-3 h-3 text-emerald-300" />
                                                        {cur.badge_bn}
                                                    </span>
                                                    <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                                                        {cur.title_bn}
                                                    </h3>
                                                    <p className="text-xs text-emerald-100/90 line-clamp-2 leading-relaxed">
                                                        {cur.subtitle_bn}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-bold">
                                                            অধ্যয়নরত শিক্ষার্থীর তালিকা
                                                        </span>
                                                        <span className="px-3 py-1 rounded-lg bg-white/20 text-white text-[10px] font-bold">
                                                            ক্লাস রুটিন
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Slide Cards List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className={`font-bold text-xs uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                        মোট স্লাইড তালিকা ({formData.hero_slides?.length || 0}টি)
                                    </h4>
                                    <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                        বাটন দিয়ে ক্রম পরিবর্তন ও কাস্টমাইজ করুন
                                    </span>
                                </div>

                                {formData.hero_slides?.map((slide, idx) => (
                                    <div
                                        key={slide.id || idx}
                                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800 hover:border-slate-700" 
                                                : "bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 shadow-xs"
                                        }`}
                                    >
                                        <div className="flex items-start sm:items-center gap-4 min-w-0">
                                            {/* Thumbnail & Upload */}
                                            <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0 group">
                                                <img
                                                    src={resolveMediaUrl(slide.image_url)}
                                                    alt={slide.title_bn}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                                                    <Upload className="w-4 h-4 mb-0.5 text-emerald-400" />
                                                    <span>ছবি পরিবর্তন</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleFileUpload(
                                                                    file,
                                                                    (url) => {
                                                                        const updated = [...formData.hero_slides];
                                                                        updated[idx].image_url = url;
                                                                        setFormData({ ...formData, hero_slides: updated });
                                                                        handleSaveSection("hero_slides", updated);
                                                                    },
                                                                    {
                                                                        maxWidth: 1600,
                                                                        maxHeight: 1000,
                                                                        onPreview: (blobUrl) => {
                                                                            const updated = [...formData.hero_slides];
                                                                            updated[idx].image_url = blobUrl;
                                                                            setFormData({ ...formData, hero_slides: updated });
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>

                                            {/* Slide Content Preview */}
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                                        isDark ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
                                                    }`}>
                                                        স্লাইড #{idx + 1}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold truncate max-w-xs">
                                                        {slide.badge_bn}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleSlideActive(idx)}
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                                            slide.is_active !== false
                                                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                                                : "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                                                        }`}
                                                    >
                                                        {slide.is_active !== false ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Off)"}
                                                    </button>
                                                </div>

                                                <h4 className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                    {slide.title_bn}
                                                </h4>
                                                <p className={`text-xs line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                    {slide.subtitle_bn}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-md">
                                                    ছবি লিংক: {slide.image_url}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1.5 self-end md:self-center flex-shrink-0">
                                            {/* Move Up */}
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => handleMoveSlide(idx, -1)}
                                                className={`p-2 rounded-xl disabled:opacity-30 border cursor-pointer ${
                                                    isDark ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800" : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                                                }`}
                                                title="উপরে নিন"
                                            >
                                                ▲
                                            </button>

                                            {/* Move Down */}
                                            <button
                                                type="button"
                                                disabled={idx === formData.hero_slides.length - 1}
                                                onClick={() => handleMoveSlide(idx, 1)}
                                                className={`p-2 rounded-xl disabled:opacity-30 border cursor-pointer ${
                                                    isDark ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800" : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                                                }`}
                                                title="নিচে নিন"
                                            >
                                                ▼
                                            </button>

                                            {/* Edit */}
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditSlide(idx)}
                                                className={`px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 transition-colors border cursor-pointer ${
                                                    isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-700" : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                                                }`}
                                                title="সম্পাদনা করুন"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>সম্পাদনা</span>
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSlide(idx)}
                                                className={`p-2 rounded-xl border cursor-pointer ${
                                                    isDark ? "bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border-slate-800" : "bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border-slate-200"
                                                }`}
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 1: এক নজরে পরিচিতি */}
                    {activeTab === "institutional" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-emerald-400" />
                                        <span>প্রাতিষ্ঠানিক তথ্যাবলী ও এক নজরে পরিচিতি</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        পাবলিক ওয়েবসাইটের 'এক নজরে পরিচিতি' পেজের টেবিলের যাবতীয় তথ্য এখান থেকে পরিবর্তন করুন।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("institutional_info", formData.institutional_info)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">প্রতিষ্ঠানের ধরন (বাংলা)</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.institution_type_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, institution_type_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">শিক্ষা বোর্ড (বাংলা)</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.board_name_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, board_name_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">পাঠদানের স্তর (বাংলা)</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.levels_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, levels_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">বিভাগসমূহ (৯ম ও ১০ম)</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.groups_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, groups_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">শিফট (বাংলা)</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.shift_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, shift_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">মোট জমির পরিমাণ</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.land_area_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, land_area_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">পাকা ভবনের সংখ্যা</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.building_count_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, building_count_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">শ্রেণিকক্ষ সংখ্যা</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.classroom_count_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, classroom_count_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আইসিটি ও কম্পিউটার ল্যাব</label>
                                    <input
                                        type="text"
                                        value={formData.institutional_info.computer_lab_bn || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            institutional_info: { ...formData.institutional_info, computer_lab_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: প্রতিষ্ঠানের গল্প ও ইতিহাস (USER REQUESTED: RESTORED) */}
                    {activeTab === "school_story" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-emerald-400" />
                                        <span>প্রতিষ্ঠানের গল্প ও ইতিহাস পরিচালনা</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        হোমপেজের 'প্রতিষ্ঠানের গল্প ও পরিচিতি' কার্ড এবং #/history পেজের ইতিহাস ও ক্যাম্পাসের ছবি পরিচালনা করুন।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("school_story", formData.school_story)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                {/* Campus Picture Card */}
                                <div className="md:col-span-5 space-y-3">
                                    <label className="block text-xs font-bold text-slate-300">ক্যাম্পাসের ছবি (School Campus)</label>
                                    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative shadow-md">
                                        <img
                                            src={formData.school_story.image_url || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"}
                                            alt="Campus Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80";
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={formData.school_story.image_url || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                school_story: { ...formData.school_story, image_url: e.target.value }
                                            })}
                                            placeholder="ছবির লিংক (URL)..."
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                                        />

                                        <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors flex items-center gap-1.5">
                                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>{uploading ? "..." : "আপলোড"}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(
                                                            file,
                                                            (url) => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    school_story: { ...prev.school_story, image_url: url }
                                                                }));
                                                            },
                                                            {
                                                                maxWidth: 1200,
                                                                onPreview: (blobUrl) => {
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        school_story: { ...prev.school_story, image_url: blobUrl }
                                                                    }));
                                                                }
                                                            }
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Content Fields */}
                                <div className="md:col-span-7 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5">শিরোনাম (বাংলা)</label>
                                        <input
                                            type="text"
                                            value={formData.school_story.title_bn || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                school_story: { ...formData.school_story, title_bn: e.target.value }
                                            })}
                                            placeholder="যেমন: প্রতিষ্ঠানের গল্প ও পরিচিতি"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5">সংক্ষিপ্ত পরিচিতি (হোমপেজে প্রদর্শিত হবে)</label>
                                        <textarea
                                            rows={3}
                                            value={formData.school_story.short_intro_bn || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                school_story: { ...formData.school_story, short_intro_bn: e.target.value }
                                            })}
                                            placeholder="সংক্ষিপ্ত ভূমিকা..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5">পূর্ণাঙ্গ ইতিহাস ও বিবরণ (বাংলা)</label>
                                        <textarea
                                            rows={6}
                                            value={formData.school_story.content_bn || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                school_story: { ...formData.school_story, content_bn: e.target.value }
                                            })}
                                            placeholder="প্রতিষ্ঠার প্রেক্ষাপট, ঐতিহ্য ও একাডেমিক অগ্রযাত্রার পূর্ণাঙ্গ বর্ণনা..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: নোটিশ বোর্ড ও সার্কুলার */}
                    {activeTab === "notices_board" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-emerald-400" />
                                        <span>নোটিশ বোর্ড ও অফিসিয়াল সার্কুলার পরিচালনা</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        পাবলিক ওয়েবসাইটের 'নোটিশ বোর্ড' (#/notices) পেজে প্রকাশিত সকল বিজ্ঞপ্তি এখান থেকে যোগ, এডিট ও ডিলিট করুন।
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingNotice({
                                            id: null,
                                            title_bn: "",
                                            title_en: "",
                                            date: new Date().toLocaleDateString("bn-BD"),
                                            date_en: new Date().toLocaleDateString("en-GB"),
                                            category: "admission",
                                            category_name_bn: "ভর্তি সংক্রান্ত",
                                            category_name_en: "Admission",
                                            description_bn: "",
                                            description_en: "",
                                            file_url: ""
                                        });
                                        setNoticeModalOpen(true);
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>নতুন নোটিশ যোগ করুন</span>
                                </button>
                            </div>

                            {/* Notice Cards List */}
                            <div className="space-y-3">
                                {(formData.notices && formData.notices.length > 0) ? (
                                    formData.notices.map((notice) => (
                                        <div
                                            key={notice.id}
                                            className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                                                        {notice.category_name_bn || notice.category}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-slate-500" />
                                                        {notice.date}
                                                    </span>
                                                    {notice.file_url && (
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold flex items-center gap-1">
                                                            {notice.file_url.toLowerCase().endsWith(".pdf") ? (
                                                                <FileText className="w-3 h-3 text-red-400" />
                                                            ) : (
                                                                <ImageIcon className="w-3 h-3 text-emerald-400" />
                                                            )}
                                                            <span>ফাইল সংযুক্ত</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                                                    {notice.title_bn}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                                    {notice.description_bn}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                                <button
                                                    onClick={() => {
                                                        setEditingNotice(notice);
                                                        setNoticeModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                                                    <span>এডিট</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNotice(notice.id)}
                                                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 text-xs transition-colors"
                                                    title="ডিলিট"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-dashed border-slate-800">
                                        কোনো নোটিশ পাওয়া যায়নি। উপরে 'নতুন নোটিশ যোগ করুন' বাটনে ক্লিক করে নোটিশ যোগ করুন।
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: ক্লাস রুটিন পরিচালনা (USER REQUESTED: 2-WAY CMS & ADMIN CONTROL) */}
                    {activeTab === "routines" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-emerald-400" />
                                        <span>শ্রেণিভিত্তিক ক্লাস রুটিন পরিচালনা ও শিডিউলিং</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        ৬ষ্ঠ হতে ১০ম শ্রেণি পর্যন্ত প্রতিটি বিষয়ের ক্লাস রুটিন এখান থেকে রিয়েল-টাইমে আপডেট করুন। (পাবলিক সাইট ও এডমিন প্যানেল উভয় জায়গায় সিঙ্কড)।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href="#/class-routine"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>পাবলিক রুটিন দেখুন</span>
                                    </a>

                                    <button
                                        onClick={() => handleSaveSection("class_routines", formData.class_routines)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Class & Day Filter Selectors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">শ্রেণি নির্বাচন করুন</label>
                                    <select
                                        value={routineClass}
                                        onChange={(e) => setRoutineClass(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="class_6">৬ষ্ঠ শ্রেণি (Class 6)</option>
                                        <option value="class_7">৭ম শ্রেণি (Class 7)</option>
                                        <option value="class_8">৮ম শ্রেণি (Class 8)</option>
                                        <option value="class_9">৯ম শ্রেণি (Class 9 - বিজ্ঞান ও মানবিক)</option>
                                        <option value="class_10">১০ম শ্রেণি (Class 10 - এসএসসি ২০২৭)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">সপ্তাহের দিন নির্বাচন করুন</label>
                                    <select
                                        value={routineDay}
                                        onChange={(e) => setRoutineDay(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="রবিবার">রবিবার (Sunday)</option>
                                        <option value="সোমবার">সোমবার (Monday)</option>
                                        <option value="মঙ্গলবার">মঙ্গলবার (Tuesday)</option>
                                        <option value="বুধবার">বুধবার (Wednesday)</option>
                                        <option value="বৃহস্পতিবার">বৃহস্পতিবার (Thursday)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Current Class Metadata Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <div className="space-y-1">
                                    <div className="text-xs font-black text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        <span>
                                            {routineClass === "class_6" ? "৬ষ্ঠ শ্রেণি" :
                                             routineClass === "class_7" ? "৭ম শ্রেণি" :
                                             routineClass === "class_8" ? "৮ম শ্রেণি" :
                                             routineClass === "class_9" ? "৯ম শ্রেণি" : "১০ম শ্রেণি"} — {routineDay}-এর শিডিউল
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        {(routineClass === "class_9" || routineClass === "class_10")
                                            ? "৯ম ও ১০ম শ্রেণির জন্য দৈনিক ৭টি পিরিয়ড • বিজ্ঞান ও মানবিক বিভাগ"
                                            : "৬ষ্ঠ হতে ৮ম শ্রেণির জন্য দৈনিক ৬টি পিরিয়ড • কোনো শাখা নেই"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingPeriodIdx(null);
                                        setPeriodForm({ period: "১ম পিরিয়ড", subject: "", teacher: "", room: routineClass.includes("9") || routineClass.includes("10") ? "২০১" : "১০১" });
                                        setNewPeriodModal(true);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>পিরিয়ড যোগ করুন</span>
                                </button>
                            </div>

                            {/* Periods List for selected class & day */}
                            <div className="space-y-2.5">
                                {(() => {
                                    const curSchedule = formData.class_routines?.classes?.[routineClass]?.schedule?.[routineDay] || [];
                                    if (curSchedule.length === 0) {
                                        return (
                                            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-dashed border-slate-800">
                                                এই দিনের জন্য এখনো কোনো ক্লাস পিরিয়ড অন্তর্ভুক্ত করা হয়নি। উপরের 'পিরিয়ড যোগ করুন' বাটনে ক্লিক করুন।
                                            </div>
                                        );
                                    }
                                    return curSchedule.map((p, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group ${
                                                isDark
                                                    ? "bg-slate-950 border-slate-800/80 hover:border-emerald-500/40"
                                                    : "bg-white border-slate-200 hover:border-emerald-400 shadow-xs"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black border transition-all ${
                                                    isDark
                                                        ? "bg-emerald-950 text-emerald-300 border-emerald-800 shadow-xs"
                                                        : "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold shadow-xs"
                                                }`}>
                                                    {p.period}
                                                </span>
                                                <div>
                                                    <h4 className={`font-bold text-xs sm:text-sm ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                                                        {p.subject}
                                                    </h4>
                                                    <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600 font-medium"}`}>
                                                        শিক্ষক: {p.teacher} • কক্ষ: {p.room || "১০১"} {p.time && `• সময়: ${p.time}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                <button
                                                    onClick={() => {
                                                        setEditingPeriodIdx(idx);
                                                        setPeriodForm({
                                                            period: p.period || "১ম পিরিয়ড",
                                                            subject: p.subject || "",
                                                            teacher: p.teacher || "",
                                                            room: p.room || "১০১"
                                                        });
                                                        setNewPeriodModal(true);
                                                    }}
                                                    className={`p-2 rounded-xl text-xs transition-all duration-200 cursor-pointer border hover:scale-105 active:scale-95 ${
                                                        isDark
                                                            ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                                                            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs hover:border-slate-400"
                                                    }`}
                                                    title="সম্পাদনা করুন"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePeriod(idx)}
                                                    className={`p-2 rounded-xl text-xs transition-all duration-200 cursor-pointer border hover:scale-105 active:scale-95 ${
                                                        isDark
                                                            ? "bg-red-950/40 hover:bg-red-900/60 text-red-400 border-red-800/50"
                                                            : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 shadow-xs hover:border-red-300"
                                                    }`}
                                                    title="মুছে ফেলুন"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}

                    {/* TAB: সম্মানিত শিক্ষকমণ্ডলী পরিচালনা (Teachers & Faculty Management) */}
                    {activeTab === "teachers" && (
                        <div className={`rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 transition-all ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-slate-200/50"
                        }`}>
                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <div>
                                    <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                        <GraduationCap className="w-5 h-5 text-emerald-500" />
                                        <span>সম্মানিত শিক্ষকমণ্ডলী পরিচালনা (Teachers & Faculty)</span>
                                    </h3>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600 font-medium"}`}>
                                        পাবলিক পোর্টাল ও হোমপেজে প্রদর্শিত বিদ্যালয়ের সম্মানিত শিক্ষকদের তথ্য, ছবি, পদবি ও ক্রম রিয়েল-টাইমে আপডেট করুন।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <a
                                        href="#/teachers"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 border hover:scale-105 ${
                                            isDark 
                                                ? "bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700"
                                                : "bg-slate-100 hover:bg-slate-200 text-emerald-800 border-slate-300 shadow-xs"
                                        }`}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>পাবলিক শিক্ষক পেজ</span>
                                    </a>

                                    <button
                                        onClick={() => {
                                            setEditingTeacherIdx(null);
                                            setTeacherForm({
                                                name_bn: "",
                                                name_en: "",
                                                designation_bn: "সহকারী শিক্ষক",
                                                designation_en: "Assistant Teacher",
                                                department_bn: "সাধারণ",
                                                department_en: "General",
                                                qualification: "B.A, B.Ed",
                                                phone: "",
                                                email: "",
                                                image_url: "",
                                                order: (formData.teachers || []).length + 1
                                            });
                                            setTeacherModalOpen(true);
                                        }}
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>নতুন শিক্ষক যোগ করুন</span>
                                    </button>

                                    <button
                                        onClick={() => handleSaveSection("teachers", formData.teachers)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Summary Banner */}
                            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isDark ? "bg-slate-950 border-slate-800" : "bg-emerald-50/60 border-emerald-200"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black text-sm">
                                        {(formData.teachers || []).length}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                            মোট তালিকাভুক্ত শিক্ষক: {(formData.teachers || []).length} জন
                                        </div>
                                        <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                            যেকোনো শিক্ষকের ক্রম বা তথ্য পরিবর্তন করলে স্বয়ংক্রিয়ভাবে মূল ওয়েবসাইটে আপডেট হবে।
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teachers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(formData.teachers || []).map((t, idx) => (
                                    <div
                                        key={t.id || idx}
                                        className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between gap-3 ${
                                            isDark 
                                                ? "bg-slate-950 border-slate-800/80 hover:border-emerald-500/50" 
                                                : "bg-white border-slate-200 hover:border-emerald-400 shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3.5">
                                            {/* Photo */}
                                            <div className="relative shrink-0">
                                                <img
                                                    src={resolveMediaUrl(t.image_url || t.image)}
                                                    alt={t.name_bn || t.name}
                                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md group-hover:scale-105 transition-transform"
                                                    onError={(e) => { e.target.src = "/headmaster.png"; }}
                                                />
                                                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                                                    {idx + 1}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className={`font-black text-sm truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                        {t.name_bn || t.name}
                                                    </h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                        isDark
                                                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                                            : "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold"
                                                    }`}>
                                                        {t.designation_bn || t.designation}
                                                    </span>
                                                </div>
                                                {t.name_en && (
                                                    <div className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                        {t.name_en}
                                                    </div>
                                                )}
                                                <div className={`text-[11px] mt-1 flex items-center gap-2 flex-wrap ${
                                                    isDark ? "text-slate-300" : "text-slate-700 font-semibold"
                                                }`}>
                                                    <span>বিষয়: {t.department_bn || t.department || "সাধারণ"}</span>
                                                    <span>•</span>
                                                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>{t.qualification}</span>
                                                </div>
                                                <div className={`text-[10px] mt-1 flex items-center gap-3 ${
                                                    isDark ? "text-slate-400" : "text-slate-600"
                                                }`}>
                                                    {t.phone && <span>📞 {t.phone}</span>}
                                                    {t.email && <span className="truncate">✉️ {t.email}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions footer */}
                                        <div className={`pt-2.5 border-t flex items-center justify-between gap-2 ${
                                            isDark ? "border-slate-800/80" : "border-slate-100"
                                        }`}>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleMoveTeacher(idx, -1)}
                                                    disabled={idx === 0}
                                                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                                                        idx === 0
                                                            ? "opacity-30 cursor-not-allowed"
                                                            : isDark
                                                                ? "hover:bg-slate-800 text-slate-300 border-slate-700"
                                                                : "hover:bg-slate-100 text-slate-700 border-slate-300"
                                                    }`}
                                                    title="উপরে নিন"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => handleMoveTeacher(idx, 1)}
                                                    disabled={idx === (formData.teachers || []).length - 1}
                                                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                                                        idx === (formData.teachers || []).length - 1
                                                            ? "opacity-30 cursor-not-allowed"
                                                            : isDark
                                                                ? "hover:bg-slate-800 text-slate-300 border-slate-700"
                                                                : "hover:bg-slate-100 text-slate-700 border-slate-300"
                                                    }`}
                                                    title="নিচে নিন"
                                                >
                                                    ↓
                                                </button>
                                                <span className={`text-[10px] ml-1 font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                    ক্রম: #{idx + 1}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setEditingTeacherIdx(idx);
                                                        setTeacherForm({
                                                            name_bn: t.name_bn || t.name || "",
                                                            name_en: t.name_en || "",
                                                            designation_bn: t.designation_bn || t.designation || "সহকারী শিক্ষক",
                                                            designation_en: t.designation_en || "Assistant Teacher",
                                                            department_bn: t.department_bn || t.department || "",
                                                            department_en: t.department_en || "",
                                                            qualification: t.qualification || "",
                                                            phone: t.phone || "",
                                                            email: t.email || "",
                                                            image_url: t.image_url || t.image || "",
                                                            order: t.order || idx + 1
                                                        });
                                                        setTeacherModalOpen(true);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border flex items-center gap-1 hover:scale-105 active:scale-95 ${
                                                        isDark
                                                            ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                                                            : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs"
                                                    }`}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span>সম্পাদনা</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteTeacher(idx)}
                                                    className={`p-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer border hover:scale-105 active:scale-95 ${
                                                        isDark
                                                            ? "bg-red-950/40 hover:bg-red-900/60 text-red-400 border-red-800/50"
                                                            : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 shadow-xs"
                                                    }`}
                                                    title="মুছে ফেলুন"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: কর্মকর্তা ও কর্মচারী (School Staff / Officers) */}
                    {activeTab === "staff" && (
                        <div className={`rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                                <div>
                                    <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                        <Briefcase className="w-5 h-5 text-emerald-500" />
                                        <span>কর্মকর্তা ও কর্মচারী বাতায়ন (Staff Management)</span>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                            {(formData.staff || []).length} জন কর্মকর্তা-কর্মচারী
                                        </span>
                                    </h3>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        বিদ্যালয়ের অফিস সহকারী, হিসাব সহকারী, লাইব্রেরি সহকারী, ল্যাব সহকারী ও অন্যান্য কর্মকর্তা-কর্মচারীদের তথ্য পরিচালনা করুন (পাবলিক ওয়েবসাইটে সরাসরি প্রদর্শিত হবে)।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={handleOpenAddStaff}
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>নতুন কর্মকর্তা/কর্মচারী যোগ করুন</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, staff: defaultStaffList });
                                            handleSaveSection("staff", defaultStaffList);
                                        }}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                            isDark ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                        title="অফিসিয়াল প্রাথমিক স্টাফ তালিকা ফিরিয়ে আনুন"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>রিসেট তালিকা</span>
                                    </button>

                                    <button
                                        onClick={() => handleSaveSection("staff", formData.staff)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Staff Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(formData.staff || []).map((st, idx) => (
                                    <div
                                        key={st.id || idx}
                                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                                            isDark ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-emerald-300 shadow-xs"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3.5 mb-3">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 flex-shrink-0 bg-slate-800 shadow-md">
                                                <img
                                                    src={st.image || st.image_url || sampleStaffAvatars[0].url}
                                                    alt={st.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        e.target.src = sampleStaffAvatars[0].url;
                                                    }}
                                                />
                                                <span className="absolute bottom-0 right-0 bg-slate-900/90 text-[10px] font-bold text-emerald-400 px-1 py-0.5 rounded-tl-md">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        {st.designation || "কর্মচারী"}
                                                    </span>
                                                </div>
                                                <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                    {st.name}
                                                </h4>
                                                {st.qualification && (
                                                    <p className={`text-[11px] mt-0.5 truncate font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                        যোগ্যতা: {st.qualification}
                                                    </p>
                                                )}
                                                <div className="mt-1 space-y-0.5 text-[10.5px]">
                                                    {st.phone && (
                                                        <p className={`truncate ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                            📞 {st.phone}
                                                        </p>
                                                    )}
                                                    {st.email && (
                                                        <p className={`truncate ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                                            ✉️ {st.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-800/60">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditStaff(idx)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                                    isDark ? "bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "bg-white text-slate-700 hover:text-emerald-700 border border-slate-200"
                                                }`}
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>সম্পাদনা</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteStaff(idx)}
                                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 5: সাধারণ তথ্য ও যোগাযোগ */}
                    {activeTab === "general" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-emerald-400" />
                                        <span>সাধারণ প্রাতিষ্ঠানিক তথ্য ও যোগাযোগ</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        বিদ্যালয়ের নাম, EIIN, স্থাপিত সাল, ফোন, ইমেইল ও স্লোগান পরিচালনা করুন।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("general", formData.general)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">বিদ্যালয়ের নাম (বাংলা)</label>
                                    <input
                                        type="text"
                                        value={formData.general.school_name_bn}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, school_name_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">বিদ্যালয়ের নাম (English)</label>
                                    <input
                                        type="text"
                                        value={formData.general.school_name_en}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, school_name_en: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ইআইআইএন (EIIN)</label>
                                    <input
                                        type="text"
                                        value={formData.general.eiin}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, eiin: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">স্থাপিত সাল (Est. Year)</label>
                                    <input
                                        type="text"
                                        value={formData.general.est_year}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, est_year: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">অফিসিয়াল হেল্পলাইন ফোন</label>
                                    <input
                                        type="text"
                                        value={formData.general.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, phone: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">অফিসিয়াল ইমেইল</label>
                                    <input
                                        type="email"
                                        value={formData.general.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, email: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ঠিকানা (বাংলা)</label>
                                    <input
                                        type="text"
                                        value={formData.general.address_bn}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            general: { ...formData.general, address_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: জরুরি নোটিশ বার */}
                    {activeTab === "notice" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-emerald-400" />
                                        <span>জরুরি নোটিশ বার (স্ক্রলিং টিকার)</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        ওয়েবসাইটের একদম উপরে লাল ব্যাজে যে জরুরি নোটিশটি স্ক্রল করে।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("emergency_notice", formData.emergency_notice)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                    <input
                                        type="checkbox"
                                        id="noticeActive"
                                        checked={formData.emergency_notice.is_active}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            emergency_notice: { ...formData.emergency_notice, is_active: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                    />
                                    <label htmlFor="noticeActive" className="text-xs font-bold text-white cursor-pointer">
                                        জরুরি নোটিশ টিকার সক্রিয় রাখুন (Show on Website)
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">নোটিশ বার্তা (বাংলা)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.emergency_notice.notice_bn}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            emergency_notice: { ...formData.emergency_notice, notice_bn: e.target.value }
                                        })}
                                        placeholder="জরুরি নোটিশ বার্তা বাংলায় লিখুন..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                                    />
                                </div>

                                {/* EMERGENCY NOTICE LIVE PREVIEW (As requested by user) */}
                                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-emerald-400" />
                                            <h4 className="text-xs font-bold text-white tracking-wide">
                                                লাইভ ওয়েবসাইট প্রিভিউ (Emergency Notice Live Preview)
                                            </h4>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                                            formData.emergency_notice.is_active
                                                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                                : "bg-red-500/15 border border-red-500/30 text-red-400"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${formData.emergency_notice.is_active ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}></span>
                                            {formData.emergency_notice.is_active ? "পাবলিক ওয়েবসাইটে সক্রিয়" : "বর্তমানে বন্ধ রয়েছে"}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        পাবলিক ওয়েবসাইটের একদম শীর্ষভাগে জরুরি নোটিশ বারটি দর্শকদের স্ক্রিনে যেভাবে স্ক্রল করবে:
                                    </p>

                                    {/* Mockup Bar */}
                                    <div className="rounded-xl overflow-hidden border border-emerald-800/60 shadow-lg bg-emerald-900 text-white p-2.5 flex items-center gap-3">
                                        <span className="flex items-center gap-1.5 bg-red-600 text-white font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider shadow-sm flex-shrink-0 animate-pulse">
                                            <Bell className="w-3 h-3" />
                                            জরুরি নোটিশ
                                        </span>
                                        <div className="overflow-hidden whitespace-nowrap text-emerald-100 text-xs font-semibold flex-1">
                                            {formData.emergency_notice.is_active ? (
                                                <marquee
                                                    scrollamount="5"
                                                    onMouseEnter={(e) => e.target.stop()}
                                                    onMouseLeave={(e) => e.target.start()}
                                                    className="cursor-pointer"
                                                    title="মাউস রাখলে নোটিশ পড়া যাবে"
                                                >
                                                    {formData.emergency_notice.notice_bn || "এখানে আপনার জরুরি নোটিশ বার্তাটি স্ক্রল করবে..."}
                                                </marquee>
                                            ) : (
                                                <span className="text-slate-400 italic text-[11px]">
                                                    (জরুরি নোটিশ টিকারটি নিষ্ক্রিয় রয়েছে। সক্রিয় করতে উপরের বক্সে টিক চিহ্ন দিন)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 7: প্রধান শিক্ষকের বাণী ও গল্প */}
                    {activeTab === "headmaster" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Award className="w-5 h-5 text-emerald-400" />
                                        <span>প্রতিষ্ঠান প্রধানের বাণী ও পরিচিতি</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        প্রধান শিক্ষকের নাম, পদবি, ছবি এবং সম্পূর্ণ বাণী এখান থেকে আপডেট করুন।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("headmaster", formData.headmaster)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                {/* Photo Preview & Upload */}
                                <div className="md:col-span-4 flex flex-col items-center p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                                    <div className="w-28 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-md bg-slate-900 mb-3 relative">
                                        <img
                                            src={resolveMediaUrl(formData.headmaster.image_url)}
                                            alt="Headmaster Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/headmaster.png";
                                            }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-300 mb-2">প্রধান শিক্ষকের ছবি</span>

                                    <label className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors flex items-center gap-1.5">
                                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>{uploading ? "আপলোড হচ্ছে..." : "নতুন ছবি আপলোড"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleFileUpload(
                                                        file,
                                                        (url) => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                headmaster: { ...prev.headmaster, image_url: url }
                                                            }));
                                                        },
                                                        {
                                                            maxWidth: 800,
                                                            maxHeight: 1000,
                                                            onPreview: (blobUrl) => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    headmaster: { ...prev.headmaster, image_url: blobUrl }
                                                                }));
                                                            }
                                                        }
                                                    );
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Text Fields */}
                                <div className="md:col-span-8 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1.5">প্রধান শিক্ষকের নাম (বাংলা)</label>
                                            <input
                                                type="text"
                                                value={formData.headmaster.name_bn}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    headmaster: { ...formData.headmaster, name_bn: e.target.value }
                                                })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1.5">পদবি (বাংলা)</label>
                                            <input
                                                type="text"
                                                value={formData.headmaster.designation_bn}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    headmaster: { ...formData.headmaster, designation_bn: e.target.value }
                                                })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5">প্রধান শিক্ষকের বাণী / বক্তব্য (বাংলা)</label>
                                        <textarea
                                            rows={6}
                                            value={formData.headmaster.message_bn}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                headmaster: { ...formData.headmaster, message_bn: e.target.value }
                                            })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 8: প্রতিষ্ঠানের সময়সূচি */}
                    {activeTab === "timings" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-emerald-400" />
                                        <span>প্রতিষ্ঠানের সময়সূচি পরিচালনা</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        বিদ্যালয়ের প্রাত্যহিক সমাবেশ, শ্রেণি পাঠদান, টিফিন বিরতি, ছুটি ও অফিস সময়সূচি।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("timings", formData.timings)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">প্রাত্যহিক সমাবেশ (সকাল ১০:০০ - ১০:১৫)</label>
                                    <input
                                        type="text"
                                        value={formData.timings.assembly_bn || "১০:০০ AM - ১০:১৫ AM"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            timings: { ...formData.timings, assembly_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">শ্রেণি পাঠদান (১ম পর্ব) (সকাল ১০:১৫ - ০১:১৫)</label>
                                    <input
                                        type="text"
                                        value={formData.timings.first_half_bn || "১০:১৫ AM - ০১:১৫ PM"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            timings: { ...formData.timings, first_half_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">টিফিন বিরতি (দুপুর ০১:১৫ - ০২:০০)</label>
                                    <input
                                        type="text"
                                        value={formData.timings.tiffin_break_bn || "০১:১৫ PM - ০২:০০ PM"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            timings: { ...formData.timings, tiffin_break_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">শ্রেণি পাঠদান ও ছুটি (দুপুর ০২:০০ - ০৪:০০)</label>
                                    <input
                                        type="text"
                                        value={formData.timings.second_half_bn || "০২:০০ PM - ০৪:০০ PM"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            timings: { ...formData.timings, second_half_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">অফিস সময় (সকাল ০৯:৩০ - ০৪:৩০)</label>
                                    <input
                                        type="text"
                                        value={formData.timings.office_hours_bn || "০৯:৩০ AM - ০৪:৩০ PM"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            timings: { ...formData.timings, office_hours_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ছুটির দিনের বিবরণ</label>
                                    <input
                                        type="text"
                                        value={formData.timings.weekend_note_bn || "ছুটির দিন: শুক্রবার ও শনিবার"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            timings: { ...formData.timings, weekend_note_bn: e.target.value }
                                        })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 9: ডান পাশের গুরুত্বপূর্ণ লিংক */}
                    {activeTab === "links" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <Link2 className="w-5 h-5 text-emerald-400" />
                                        <span>ডান পাশের গুরুত্বপূর্ণ লিঙ্ক ও বাতায়ন পরিচালনা</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        পাবলিক ওয়েবসাইটের ডানপাশের সাইডবারে 'জরুরি লিঙ্ক ও তথ্য বাতায়ন' তালিকার লিংক যোগ, এডিট ও ডিলিট করুন।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const newLinks = [
                                                ...formData.important_links,
                                                { id: Date.now(), title_bn: "নতুন লিঙ্ক", title_en: "New Link", url: "https://", desc: "website.gov.bd" }
                                            ];
                                            setFormData({ ...formData, important_links: newLinks });
                                        }}
                                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                                    >
                                        <Plus className="w-4 h-4 text-emerald-400" />
                                        <span>নতুন লিঙ্ক যোগ করুন</span>
                                    </button>

                                    <button
                                        onClick={() => handleSaveSection("important_links", formData.important_links)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {formData.important_links.map((link, idx) => (
                                    <div
                                        key={link.id || idx}
                                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                                    >
                                        <div className="sm:col-span-5">
                                            <label className="block text-[10.5px] font-bold text-slate-400 mb-1">পোর্টাল / লিংকের নাম (বাংলা)</label>
                                            <input
                                                type="text"
                                                value={link.title_bn || link.title || ""}
                                                onChange={(e) => {
                                                    const updated = [...formData.important_links];
                                                    updated[idx] = { ...updated[idx], title_bn: e.target.value, title: e.target.value };
                                                    setFormData({ ...formData, important_links: updated });
                                                }}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                                            />
                                        </div>

                                        <div className="sm:col-span-5">
                                            <label className="block text-[10.5px] font-bold text-slate-400 mb-1">ওয়েবসাইট লিংক (URL)</label>
                                            <input
                                                type="text"
                                                value={link.url || ""}
                                                onChange={(e) => {
                                                    const updated = [...formData.important_links];
                                                    updated[idx] = { ...updated[idx], url: e.target.value };
                                                    setFormData({ ...formData, important_links: updated });
                                                }}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                                            />
                                        </div>

                                        <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-3 sm:pt-0">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                                                title="লিঙ্ক টেস্ট করুন"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    const updated = formData.important_links.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, important_links: updated });
                                                }}
                                                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors border border-red-800/50"
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 10: ব্যবস্থাপনা কমিটি */}
                    {activeTab === "committee" && (
                        <div className={`rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                                <div>
                                    <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                        <Users className="w-5 h-5 text-emerald-500" />
                                        <span>ব্যবস্থাপনা কমিটি (Managing Committee)</span>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                            {(formData.committee || []).length} জন সদস্য
                                        </span>
                                    </h3>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        বিদ্যালয় পরিচালনা ও উন্নয়ন পর্ষদের সম্মানিত সদস্যবৃন্দের তালিকা ও পদবি পরিচালনা করুন (ওয়েবসাইটে সরাসরি প্রদর্শিত হবে)।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={handleOpenAddCommittee}
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>নতুন সদস্য যোগ করুন</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, committee: defaultCommitteeList });
                                            handleSaveSection("committee", defaultCommitteeList);
                                        }}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                            isDark ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                        title="অফিসিয়াল প্রাথমিক তালিকা ফিরিয়ে আনুন"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>রিসেট তালিকা</span>
                                    </button>

                                    <button
                                        onClick={() => handleSaveSection("committee", formData.committee)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Committee Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(formData.committee || []).map((member, idx) => (
                                    <div
                                        key={member.id || idx}
                                        className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                                            isDark ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-emerald-300 shadow-xs"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3.5 min-w-0">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 flex-shrink-0 bg-slate-800 shadow-md">
                                                <img
                                                    src={member.image_url || member.image || sampleCommitteeAvatars[0].url}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = sampleCommitteeAvatars[0].url;
                                                    }}
                                                />
                                                <span className="absolute bottom-0 right-0 bg-slate-900/90 text-[10px] font-bold text-emerald-400 px-1 py-0.5 rounded-tl-md">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        {member.role || "সদস্য"}
                                                    </span>
                                                </div>
                                                <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                    {member.name}
                                                </h4>
                                                <p className={`text-xs mt-0.5 truncate ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                    {member.sub || "বিদ্যালয় পরিচালনা পর্ষদ"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditCommittee(idx)}
                                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                                    isDark ? "hover:bg-slate-800 text-slate-400 hover:text-emerald-400" : "hover:bg-slate-200 text-slate-600 hover:text-emerald-700"
                                                }`}
                                                title="সম্পাদনা করুন"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCommittee(idx)}
                                                className="p-2 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 11: কৃতি শিক্ষার্থী */}
                    {activeTab === "achievers" && (
                        <div className={`rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                                <div>
                                    <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                        <Award className="w-5 h-5 text-emerald-500" />
                                        <span>কৃতি শিক্ষার্থী ও মেধা তালিকা (Achievers)</span>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                            {(formData.achievers || []).length} জন কৃতি শিক্ষার্থী
                                        </span>
                                    </h3>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        বোর্ড পরীক্ষায় গোল্ডেন এ+ ও মেধা বৃত্তিতে উত্তীর্ণ শিক্ষার্থীদের সাফল্য পরিচালনা করুন (হোমপেজে স্লাইডার হিসেবে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে)।
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={handleOpenAddAchiever}
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>নতুন কৃতি শিক্ষার্থী যোগ করুন</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, achievers: defaultAchieversList });
                                            handleSaveSection("achievers", defaultAchieversList);
                                        }}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                            isDark ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                        title="ডিফল্ট কৃতি শিক্ষার্থী তালিকা ফিরিয়ে আনুন"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>রিসেট তালিকা</span>
                                    </button>

                                    <button
                                        onClick={() => handleSaveSection("achievers", formData.achievers)}
                                        disabled={saving}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Achievers Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(formData.achievers || []).map((student, idx) => (
                                    <div
                                        key={student.id || idx}
                                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                                            isDark ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-emerald-300 shadow-xs"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 flex-shrink-0 bg-slate-800 shadow-md">
                                                <img
                                                    src={student.image_url || student.image || sampleStudentAvatars[0].url}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        e.target.src = sampleStudentAvatars[0].url;
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className={`text-sm font-black truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                                    {student.name}
                                                </h4>
                                                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        {student.gpa || "GPA 5.00"}
                                                    </span>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                                        {student.exam || "SSC"}
                                                    </span>
                                                </div>
                                                {student.award && (
                                                    <p className={`text-[11px] mt-1.5 truncate font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                                        🏆 {student.award}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-800/60">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditAchiever(idx)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                                    isDark ? "bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "bg-white text-slate-700 hover:text-emerald-700 border border-slate-200"
                                                }`}
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>সম্পাদনা</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAchiever(idx)}
                                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title="মুছে ফেলুন"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 12: ফটো ও ভিডিও গ্যালারি */}
                    {activeTab === "gallery" && (
                        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-emerald-400" />
                                        <span>ফটো ও ভিডিও গ্যালারি</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        বিদ্যালয়ের বিভিন্ন অনুষ্ঠান ও ক্যাম্পাস ইভেন্টের ফটো গ্যালারি।
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSaveSection("gallery", formData.gallery)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                                ক্যাম্পাসের ছবিগুলো ওয়েবসাইট ভিজিটরদের বিদ্যালয়ের নান্দনিক পরিবেশ প্রদর্শন করে।
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* NOTICE ADD/EDIT MODAL */}
            {noticeModalOpen && editingNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="font-bold text-base text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-emerald-400" />
                                <span>{editingNotice.id ? "বিজ্ঞপ্তি এডিট করুন" : "নতুন বিজ্ঞপ্তি প্রকাশ করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setNoticeModalOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1.5">বিজ্ঞপ্তির শিরোনাম (বাংলা) *</label>
                                <input
                                    type="text"
                                    value={editingNotice.title_bn || ""}
                                    onChange={(e) => setEditingNotice({ ...editingNotice, title_bn: e.target.value })}
                                    placeholder="যেমন: ২০২৬ শিক্ষাবর্ষের অর্ধবার্ষিক পরীক্ষার সময়সূচি সংক্রান্ত"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ক্যাটাগরি / ধরন</label>
                                    <select
                                        value={editingNotice.category || "admission"}
                                        onChange={(e) => {
                                            const cat = e.target.value;
                                            const names = {
                                                admission: "ভর্তি সংক্রান্ত",
                                                exam: "পরীক্ষা সংক্রান্ত",
                                                stipend: "উপবৃত্তি ও সহায়তা",
                                                co_curricular: "সহশিক্ষা ও সাংস্কৃতিক",
                                                general: "সাধারণ বিজ্ঞপ্তি"
                                            };
                                            setEditingNotice({
                                                ...editingNotice,
                                                category: cat,
                                                category_name_bn: names[cat] || "বিজ্ঞপ্তি"
                                            });
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="admission">ভর্তি সংক্রান্ত</option>
                                        <option value="exam">পরীক্ষা সংক্রান্ত</option>
                                        <option value="stipend">উপবৃত্তি ও সহায়তা</option>
                                        <option value="co_curricular">সহশিক্ষা ও সাংস্কৃতিক</option>
                                        <option value="general">সাধারণ বিজ্ঞপ্তি</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5">প্রকাশের তারিখ</label>
                                    <input
                                        type="text"
                                        value={editingNotice.date || ""}
                                        onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                                        placeholder="যেমন: ২৯ অক্টোবর, ২০২৬"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1.5">বিস্তারিত বিবরণ (বাংলা)</label>
                                <textarea
                                    rows={4}
                                    value={editingNotice.description_bn || ""}
                                    onChange={(e) => setEditingNotice({ ...editingNotice, description_bn: e.target.value })}
                                    placeholder="বিজ্ঞপ্তির মূল বিষয়বস্তু ও নির্দেশনা এখানে লিখুন..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                                />
                            </div>

                            {/* Notice PDF or Picture Attachment */}
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                                    <span>নোটিশের ফাইল / ছবি / পিডিএফ সংযুক্তি (PDF / Image Attachment)</span>
                                    <span className="text-[10px] text-emerald-400">ঐচ্ছিক (Optional)</span>
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editingNotice.file_url || ""}
                                            onChange={(e) => setEditingNotice({ ...editingNotice, file_url: e.target.value })}
                                            placeholder="ফাইলের সরাসরি লিংক (যেমন: /uploads/cms/... বা গুগল ড্রাইভ লিংক)"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                                        />
                                        <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0 border border-slate-700 transition-colors">
                                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>{uploading ? "আপলোড..." : "PDF / ছবি আপলোড"}</span>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleFileUpload(file, (url) => {
                                                            setEditingNotice({ ...editingNotice, file_url: url });
                                                            showToast("নোটিশ ফাইল সফলভাবে আপলোড হয়েছে!", "success");
                                                        });
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {editingNotice.file_url && (
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                                            <div className="flex items-center gap-2 text-slate-300 truncate max-w-md">
                                                {editingNotice.file_url.toLowerCase().endsWith(".pdf") ? (
                                                    <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                                )}
                                                <span className="truncate">{editingNotice.file_url}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setEditingNotice({ ...editingNotice, file_url: "" })}
                                                className="text-red-400 hover:text-red-300 text-[11px] font-bold cursor-pointer"
                                            >
                                                মুছে ফেলুন
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                            <button
                                onClick={() => setNoticeModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleSaveNotice}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                            >
                                <Check className="w-4 h-4" />
                                <span>বিজ্ঞপ্তি প্রকাশ ও সংরক্ষণ</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW PERIOD MODAL FOR CLASS ROUTINES */}
            {newPeriodModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                                <span>{editingPeriodIdx !== null ? "পিরিয়ড সম্পাদনা" : "নতুন পিরিয়ড যুক্ত করুন"} ({routineDay})</span>
                            </h3>
                            <button
                                onClick={() => setNewPeriodModal(false)}
                                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">পিরিয়ড নির্বাচন</label>
                                <select
                                    value={periodForm.period}
                                    onChange={(e) => setPeriodForm({ ...periodForm, period: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                                >
                                    <option value="১ম পিরিয়ড">১ম পিরিয়ড (১০:১৫ - ১১:০০ AM)</option>
                                    <option value="২য় পিরিয়ড">২য় পিরিয়ড (১১:০০ - ১১:৪৫ AM)</option>
                                    <option value="৩য় পিরিয়ড">৩য় পিরিয়ড (১১:৪৫ - ১২:৩০ PM)</option>
                                    <option value="৪র্থ পিরিয়ড">৪র্থ পিরিয়ড (১২:৩০ - ০১:১৫ PM)</option>
                                    <option value="৫ম পিরিয়ড">৫ম পিরিয়ড (০২:০০ - ০২:৪০ PM / ০৩:০০ PM)</option>
                                    <option value="৬ষ্ঠ পিরিয়ড">৬ষ্ঠ পিরিয়ড (০২:৪০ - ০৩:২০ PM / ০৪:০০ PM)</option>
                                    <option value="৭ম পিরিয়ড">৭ম পিরিয়ড (০৩:২০ - ০৪:০০ PM - ৯ম ও ১০ম)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                                    <span>বিষয়ের নাম *</span>
                                    <span className="text-[10px] text-emerald-400">ড্রপডাউন অথবা সরাসরি লিখুন</span>
                                </label>
                                <div className="space-y-1.5">
                                    <select
                                        value={
                                            (routineClass === "class_9" || routineClass === "class_10" ? routineSubjectsSenior : routineSubjectsJunior).includes(periodForm.subject)
                                                ? periodForm.subject
                                                : (periodForm.subject ? "__custom__" : "")
                                        }
                                        onChange={(e) => {
                                            if (e.target.value !== "__custom__" && e.target.value !== "") {
                                                setPeriodForm({ ...periodForm, subject: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none cursor-pointer"
                                    >
                                        <option value="">-- ড্রপডাউন থেকে বিষয় নির্বাচন করুন --</option>
                                        {(routineClass === "class_9" || routineClass === "class_10" ? routineSubjectsSenior : routineSubjectsJunior).map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                        <option value="__custom__">অন্যান্য / ম্যানুয়াল বিষয় টাইপ করুন...</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={periodForm.subject}
                                        onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })}
                                        placeholder="অথবা সরাসরি বিষয়ের নাম লিখুন (যেমন: সাধারণ গণিত)"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                                    <span>শিক্ষকের নাম *</span>
                                    <span className="text-[10px] text-emerald-400">তালিকা থেকে অথবা সরাসরি নাম</span>
                                </label>
                                <div className="space-y-1.5">
                                    <select
                                        value={routineTeachers.includes(periodForm.teacher) ? periodForm.teacher : (periodForm.teacher ? "__custom__" : "")}
                                        onChange={(e) => {
                                            if (e.target.value !== "__custom__" && e.target.value !== "") {
                                                setPeriodForm({ ...periodForm, teacher: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none cursor-pointer"
                                    >
                                        <option value="">-- ড্রপডাউন থেকে শিক্ষক নির্বাচন করুন --</option>
                                        {routineTeachers.map((teacher) => (
                                            <option key={teacher} value={teacher}>{teacher}</option>
                                        ))}
                                        <option value="__custom__">অন্যান্য শিক্ষক / ম্যানুয়াল নাম টাইপ করুন...</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={periodForm.teacher}
                                        onChange={(e) => setPeriodForm({ ...periodForm, teacher: e.target.value })}
                                        placeholder="অথবা শিক্ষকের নাম লিখুন (যেমন: মোছাঃ সেলিনা আক্তার)"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                                    <span>কক্ষ নম্বর</span>
                                    <span className="text-[10px] text-emerald-400">রুম সিলেক্ট বা টাইপ</span>
                                </label>
                                <div className="space-y-1.5">
                                    <select
                                        value={routineRooms.includes(periodForm.room) ? periodForm.room : (periodForm.room ? "__custom__" : "")}
                                        onChange={(e) => {
                                            if (e.target.value !== "__custom__" && e.target.value !== "") {
                                                setPeriodForm({ ...periodForm, room: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none cursor-pointer"
                                    >
                                        <option value="">-- ড্রপডাউন থেকে কক্ষ নির্বাচন করুন --</option>
                                        {routineRooms.map((rm) => (
                                            <option key={rm} value={rm}>{rm}</option>
                                        ))}
                                        <option value="__custom__">অন্যান্য কক্ষ...</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={periodForm.room}
                                        onChange={(e) => setPeriodForm({ ...periodForm, room: e.target.value })}
                                        placeholder="যেমন: ১০১ / কম্পিউটার ল্যাব"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                            <button
                                onClick={() => setNewPeriodModal(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={handleAddPeriodToRoutine}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                <span>{editingPeriodIdx !== null ? "পরিবর্তন সংরক্ষণ করুন" : "যোগ করুন ও সংরক্ষণ"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HERO SLIDE EDIT / ADD MODAL */}
            {slideModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto border ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}>
                        <div className={`flex items-center justify-between pb-3 border-b ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <h3 className={`font-bold text-base flex items-center gap-2 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                <Layers className="w-5 h-5 text-emerald-500" />
                                <span>{editingSlideIdx !== null ? "স্লাইড সম্পাদনা" : "নতুন স্লাইড তৈরি করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setSlideModalOpen(false)}
                                className={`p-1.5 rounded-xl cursor-pointer ${
                                    isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    স্লাইড শিরোনাম (বাংলা) *
                                </label>
                                <input
                                    type="text"
                                    value={slideForm.title_bn}
                                    onChange={(e) => setSlideForm({ ...slideForm, title_bn: e.target.value })}
                                    placeholder="উদাঃ ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border ${
                                        isDark 
                                            ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                            : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    স্লাইড শিরোনাম (English)
                                </label>
                                <input
                                    type="text"
                                    value={slideForm.title_en}
                                    onChange={(e) => setSlideForm({ ...slideForm, title_en: e.target.value })}
                                    placeholder="e.g. Dimla Government Girls' High School"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border ${
                                        isDark 
                                            ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                            : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    টপ ব্যাজ টেক্সট (বাংলা)
                                </label>
                                <input
                                    type="text"
                                    value={slideForm.badge_bn}
                                    onChange={(e) => setSlideForm({ ...slideForm, badge_bn: e.target.value })}
                                    placeholder="উদাঃ ঐতিহ্যবাহী সরকারি নারী বিদ্যাপীঠ • স্থাপিত ১৯৬৭"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border ${
                                        isDark 
                                            ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                            : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    সাবটাইটেল / বিবরণ (বাংলা) *
                                </label>
                                <textarea
                                    rows={3}
                                    value={slideForm.subtitle_bn}
                                    onChange={(e) => setSlideForm({ ...slideForm, subtitle_bn: e.target.value })}
                                    placeholder="স্লাইডের বিস্তারিত বার্তা বা বিবরণ লিখুন..."
                                    className={`w-full rounded-xl p-3 text-xs outline-none leading-relaxed border ${
                                        isDark 
                                            ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                            : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    স্কুল ও ক্যাম্পাসের ব্যাকগ্রাউন্ড ছবি নির্বাচন
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={slideForm.image_url}
                                            onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                                            placeholder="ছবির লিংক অথবা নিচে থেকে সরাসরি আপনার স্কুলের ছবি আপলোড করুন"
                                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border ${
                                                isDark 
                                                    ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                            }`}
                                        />
                                        <label className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-sm transition-colors">
                                            <Upload className="w-3.5 h-3.5 text-white" />
                                            <span>{uploading ? "আপলোড হচ্ছে..." : "স্কুল ছবি আপলোড"}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(
                                                            file,
                                                            (url) => setSlideForm((prev) => ({ ...prev, image_url: url })),
                                                            {
                                                                maxWidth: 1600,
                                                                maxHeight: 1000,
                                                                onPreview: (blobUrl) => setSlideForm((prev) => ({ ...prev, image_url: blobUrl }))
                                                            }
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* Quick Campus Preset Suggestions */}
                                    <div className="pt-1">
                                        <span className={`text-[11px] font-semibold block mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                            অথবা প্রস্তাবিত ক্যাম্পাসের ছবি থেকে এক ক্লিকে পছন্দ করুন:
                                        </span>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {[
                                                { label: "মূল ক্যাম্পাস ভবন", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80" },
                                                { label: "কম্পিউটার ও আইসিটি ল্যাব", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=80" },
                                                { label: "ব্যবহারিক বিজ্ঞানাগার", url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&auto=format&fit=crop&q=80" },
                                                { label: "বার্ষিক ক্রীড়া ও মাঠ", url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&auto=format&fit=crop&q=80" }
                                            ].map((sample, sIdx) => (
                                                <button
                                                    key={sIdx}
                                                    type="button"
                                                    onClick={() => setSlideForm({ ...slideForm, image_url: sample.url })}
                                                    className={`p-1.5 rounded-xl border text-left transition-all group cursor-pointer ${
                                                        isDark ? "bg-slate-950 border-slate-800 hover:border-emerald-500" : "bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20"
                                                    }`}
                                                >
                                                    <div className="h-12 w-full rounded-lg overflow-hidden mb-1">
                                                        <img src={sample.url} alt={sample.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    </div>
                                                    <span className={`text-[10px] font-medium block truncate ${
                                                        isDark ? "text-slate-300 group-hover:text-emerald-400" : "text-slate-700 group-hover:text-emerald-600"
                                                    }`}>
                                                        {sample.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {slideForm.image_url && (
                                        <div className={`h-28 w-full rounded-xl overflow-hidden border ${
                                            isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-100"
                                        }`}>
                                            <img
                                                src={resolveMediaUrl(slideForm.image_url)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                            }`}>
                                <input
                                    type="checkbox"
                                    id="slideActive"
                                    checked={slideForm.is_active}
                                    onChange={(e) => setSlideForm({ ...slideForm, is_active: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <label htmlFor="slideActive" className={`text-xs font-bold cursor-pointer ${
                                    isDark ? "text-white" : "text-slate-800"
                                }`}>
                                    স্লাইডটি ওয়েবসাইটে সক্রিয় রাখুন (Active)
                                </label>
                            </div>
                        </div>

                        <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <button
                                type="button"
                                onClick={() => setSlideModalOpen(false)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                    isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                বাতিল
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveSlideModal}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                <span>{editingSlideIdx !== null ? "পরিবর্তন সংরক্ষণ করুন" : "স্লাইড যুক্ত করুন"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TEACHER ADD / EDIT MODAL */}
            {teacherModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto border ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}>
                        <div className={`flex items-center justify-between pb-3 border-b ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <h3 className={`font-bold text-base flex items-center gap-2 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                <GraduationCap className="w-5 h-5 text-emerald-500" />
                                <span>{editingTeacherIdx !== null ? "শিক্ষকের তথ্য সম্পাদনা" : "নতুন শিক্ষক যোগ করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setTeacherModalOpen(false)}
                                className={`p-1.5 rounded-xl cursor-pointer ${
                                    isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTeacher} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">শিক্ষকের নাম (বাংলা) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={teacherForm.name_bn}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, name_bn: e.target.value })}
                                        placeholder="যেমন: মোছাঃ সালমা খাতুন"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">শিক্ষকের নাম (English)</label>
                                    <input
                                        type="text"
                                        value={teacherForm.name_en}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, name_en: e.target.value })}
                                        placeholder="e.g. Mst. Salma Khatun"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">পদবি (Designation) *</label>
                                    <select
                                        value={teacherForm.designation_bn}
                                        onChange={(e) => {
                                            const desBn = e.target.value;
                                            let desEn = "Assistant Teacher";
                                            if (desBn === "প্রধান শিক্ষক") desEn = "Head Teacher";
                                            else if (desBn === "সহকারী প্রধান শিক্ষক") desEn = "Assistant Head Teacher";
                                            else if (desBn === "সিনিয়র শিক্ষক") desEn = "Senior Teacher";
                                            else if (desBn === "সহকারী শিক্ষক") desEn = "Assistant Teacher";
                                            else if (desBn === "আইসিটি শিক্ষক") desEn = "ICT Teacher";
                                            else if (desBn === "ধর্মীয় শিক্ষক") desEn = "Religious Teacher";
                                            else if (desBn === "খণ্ডকালীন শিক্ষক") desEn = "Part-Time Teacher";
                                            setTeacherForm({ ...teacherForm, designation_bn: desBn, designation_en: desEn });
                                        }}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="প্রধান শিক্ষক">প্রধান শিক্ষক (Head Teacher)</option>
                                        <option value="সহকারী প্রধান শিক্ষক">সহকারী প্রধান শিক্ষক (Assistant Head Teacher)</option>
                                        <option value="সিনিয়র শিক্ষক">সিনিয়র শিক্ষক (Senior Teacher)</option>
                                        <option value="সহকারী শিক্ষক">সহকারী শিক্ষক (Assistant Teacher)</option>
                                        <option value="আইসিটি শিক্ষক">আইসিটি শিক্ষক (ICT Teacher)</option>
                                        <option value="ধর্মীয় শিক্ষক">ধর্মীয় শিক্ষক (Religious Teacher)</option>
                                        <option value="খণ্ডকালীন শিক্ষক">খণ্ডকালীন শিক্ষক (Part-Time Teacher)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5">বিষয় / বিভাগ (Subject) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={teacherForm.department_bn}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, department_bn: e.target.value, department_en: e.target.value })}
                                        placeholder="যেমন: বাংলা, গণিত, পদার্থবিজ্ঞান"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">শিক্ষাগত যোগ্যতা</label>
                                    <input
                                        type="text"
                                        value={teacherForm.qualification}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                                        placeholder="যেমন: M.Sc (Math), B.Ed"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">ফোন / মোবাইল</label>
                                    <input
                                        type="text"
                                        value={teacherForm.phone}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                                        placeholder="০১৭১২-৩৪৫৬৭৮"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">ইমেইল ঠিকানা</label>
                                    <input
                                        type="email"
                                        value={teacherForm.email}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                                        placeholder="teacher@dimlagirls.edu.bd"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold">শিক্ষকের ছবি (Image URL বা ফাইল আপলোড)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={teacherForm.image_url}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, image_url: e.target.value })}
                                        placeholder="ছবি URL অথবা কম্পিউটার থেকে ফাইল আপলোড করুন"
                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                                    />
                                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>ছবি আপলোড</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                handleFileUpload(
                                                    file,
                                                    (url) => setTeacherForm((prev) => ({ ...prev, image_url: url })),
                                                    {
                                                        maxWidth: 600,
                                                        maxHeight: 600,
                                                        onPreview: (blobUrl) => setTeacherForm((prev) => ({ ...prev, image_url: blobUrl }))
                                                    }
                                                );
                                            }}
                                        />
                                    </label>
                                </div>

                                {teacherForm.image_url && (
                                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                                        <img
                                            src={resolveMediaUrl(teacherForm.image_url)}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                                            onError={(e) => { e.target.src = "/headmaster.png"; }}
                                        />
                                        <span className="text-[11px] text-slate-400">ছবির প্রিভিউ সক্রিয় রয়েছে</span>
                                    </div>
                                )}
                            </div>

                            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <button
                                    type="button"
                                    onClick={() => setTeacherModalOpen(false)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                        isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{editingTeacherIdx !== null ? "পরিবর্তন সংরক্ষণ করুন" : "শিক্ষক যুক্ত করুন"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* COMMITTEE MEMBER ADD / EDIT MODAL */}
            {committeeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto border ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}>
                        <div className={`flex items-center justify-between pb-3 border-b ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <h3 className={`font-bold text-base flex items-center gap-2 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                <Users className="w-5 h-5 text-emerald-500" />
                                <span>{editingCommitteeIdx !== null ? "কমিটি সদস্যের তথ্য সম্পাদনা" : "নতুন কমিটি সদস্য যোগ করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setCommitteeModalOpen(false)}
                                className={`p-1.5 rounded-xl cursor-pointer ${
                                    isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCommitteeModal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1.5">সদস্যের নাম *</label>
                                <input
                                    type="text"
                                    required
                                    value={committeeForm.name}
                                    onChange={(e) => setCommitteeForm({ ...committeeForm, name: e.target.value })}
                                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1.5">কমিটিতে ভূমিকা / পদবি *</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        required
                                        value={committeeForm.role}
                                        onChange={(e) => setCommitteeForm({ ...committeeForm, role: e.target.value })}
                                        placeholder="যেমন: সভাপতি / সদস্য সচিব / অভিভাবক সদস্য"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                    <div className="flex flex-wrap gap-1.5">
                                        {["সভাপতি", "সহ-সভাপতি", "সদস্য সচিব", "অভিভাবক সদস্য", "শিক্ষক প্রতিনিধি", "দাতা সদস্য", "বিদ্যোৎসাহী সদস্য"].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setCommitteeForm({ ...committeeForm, role: r })}
                                                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                                    committeeForm.role === r
                                                        ? "bg-emerald-600 text-white border-emerald-500 font-bold"
                                                        : isDark
                                                            ? "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                                                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1.5">মূল পদবি / কর্মস্থল / পরিচিতি *</label>
                                <input
                                    type="text"
                                    value={committeeForm.sub}
                                    onChange={(e) => setCommitteeForm({ ...committeeForm, sub: e.target.value })}
                                    placeholder="যেমন: ডিমলা, নীলফামারী / সমাজসেবক ও শিক্ষানুরাগী"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                            </div>

                            {/* Member Photo Selection */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold">সদস্যের ছবি (Photo)</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-800 flex-shrink-0 shadow-sm">
                                        <img
                                            src={committeeForm.image_url || sampleCommitteeAvatars[0].url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = sampleCommitteeAvatars[0].url; }}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="text"
                                            value={committeeForm.image_url}
                                            onChange={(e) => setCommitteeForm({ ...committeeForm, image_url: e.target.value })}
                                            placeholder="ছবির লিংক (Image URL)"
                                            className={`w-full rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 outline-none border font-mono ${
                                                isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                            }`}
                                        />
                                    </div>
                                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>আপলোড</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                handleFileUpload(
                                                    file,
                                                    (url) => setCommitteeForm((prev) => ({ ...prev, image_url: url })),
                                                    {
                                                        maxWidth: 600,
                                                        maxHeight: 600,
                                                        onPreview: (blobUrl) => setCommitteeForm((prev) => ({ ...prev, image_url: blobUrl }))
                                                    }
                                                );
                                            }}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <span className={`text-[11px] block mb-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                        অথবা ডেমো ছবি থেকে এক ক্লিকে পছন্দ করুন:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {sampleCommitteeAvatars.map((av, avIdx) => (
                                            <button
                                                key={avIdx}
                                                type="button"
                                                onClick={() => setCommitteeForm({ ...committeeForm, image_url: av.url })}
                                                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                                    committeeForm.image_url === av.url ? "border-emerald-500 scale-110 shadow-md shadow-emerald-500/30" : "border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100"
                                                }`}
                                                title={av.label}
                                            >
                                                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <button
                                    type="button"
                                    onClick={() => setCommitteeModalOpen(false)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                        isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{editingCommitteeIdx !== null ? "সংরক্ষণ করুন" : "সদস্য যুক্ত করুন"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ACHIEVER STUDENT ADD / EDIT MODAL */}
            {achieverModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto border ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}>
                        <div className={`flex items-center justify-between pb-3 border-b ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <h3 className={`font-bold text-base flex items-center gap-2 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                <Award className="w-5 h-5 text-emerald-500" />
                                <span>{editingAchieverIdx !== null ? "কৃতি শিক্ষার্থীর তথ্য সম্পাদনা" : "নতুন কৃতি শিক্ষার্থী যোগ করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setAchieverModalOpen(false)}
                                className={`p-1.5 rounded-xl cursor-pointer ${
                                    isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAchieverModal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1.5">শিক্ষার্থীর নাম *</label>
                                <input
                                    type="text"
                                    required
                                    value={achieverForm.name}
                                    onChange={(e) => setAchieverForm({ ...achieverForm, name: e.target.value })}
                                    placeholder="যেমন: সুমাইয়া জাহান"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">পরীক্ষা ও শিক্ষাবর্ষ *</label>
                                    <input
                                        type="text"
                                        required
                                        value={achieverForm.exam}
                                        onChange={(e) => setAchieverForm({ ...achieverForm, exam: e.target.value })}
                                        placeholder="যেমন: SSC 2026"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {["SSC 2026", "SSC 2025", "SSC 2024", "জেএসসি"].map((ex) => (
                                            <button
                                                key={ex}
                                                type="button"
                                                onClick={() => setAchieverForm({ ...achieverForm, exam: ex })}
                                                className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                                    achieverForm.exam === ex
                                                        ? "bg-indigo-600 text-white border-indigo-500 font-bold"
                                                        : isDark
                                                            ? "bg-slate-950 border-slate-800 text-slate-300"
                                                            : "bg-slate-100 border-slate-200 text-slate-700"
                                                }`}
                                            >
                                                {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5">প্রাপ্ত ফলাফল (GPA) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={achieverForm.gpa}
                                        onChange={(e) => setAchieverForm({ ...achieverForm, gpa: e.target.value })}
                                        placeholder="যেমন: GPA 5.00 (Golden)"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {["GPA 5.00 (Golden)", "GPA 5.00", "GPA 4.88"].map((gp) => (
                                            <button
                                                key={gp}
                                                type="button"
                                                onClick={() => setAchieverForm({ ...achieverForm, gpa: gp })}
                                                className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                                    achieverForm.gpa === gp
                                                        ? "bg-emerald-600 text-white border-emerald-500 font-bold"
                                                        : isDark
                                                            ? "bg-slate-950 border-slate-800 text-slate-300"
                                                            : "bg-slate-100 border-slate-200 text-slate-700"
                                                }`}
                                            >
                                                {gp}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1.5">বিশেষ অর্জন / বৃত্তির ধরণ</label>
                                <input
                                    type="text"
                                    value={achieverForm.award}
                                    onChange={(e) => setAchieverForm({ ...achieverForm, award: e.target.value })}
                                    placeholder="যেমন: মেধাবৃত্তি প্রাপ্ত / বিজ্ঞান বিভাগ সেরা"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {["মেধাবৃত্তি প্রাপ্ত", "বিজ্ঞান বিভাগ সেরা", "মানবিক বিভাগ সেরা", "সাধারণ বৃত্তি", "উপজেলা পর্যায়ে ১ম"].map((aw) => (
                                        <button
                                            key={aw}
                                            type="button"
                                            onClick={() => setAchieverForm({ ...achieverForm, award: aw })}
                                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                                achieverForm.award === aw
                                                    ? "bg-emerald-600 text-white border-emerald-500 font-bold"
                                                    : isDark
                                                        ? "bg-slate-950 border-slate-800 text-slate-300"
                                                        : "bg-slate-100 border-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {aw}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Photo Selection */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold">শিক্ষার্থীর ছবি</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-800 flex-shrink-0">
                                        <img
                                            src={achieverForm.image_url || sampleStudentAvatars[0].url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = sampleStudentAvatars[0].url; }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={achieverForm.image_url}
                                        onChange={(e) => setAchieverForm({ ...achieverForm, image_url: e.target.value })}
                                        placeholder="ছবির লিংক (Image URL)"
                                        className={`flex-1 rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 outline-none border font-mono ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <span className={`text-[11px] block mb-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                        অথবা ডেমো অ্যাভাটার ছবি থেকে এক ক্লিকে পছন্দ করুন:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {sampleStudentAvatars.map((av, avIdx) => (
                                            <button
                                                key={avIdx}
                                                type="button"
                                                onClick={() => setAchieverForm({ ...achieverForm, image_url: av.url })}
                                                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                                    achieverForm.image_url === av.url ? "border-emerald-500 scale-110 shadow-md shadow-emerald-500/30" : "border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <button
                                    type="button"
                                    onClick={() => setAchieverModalOpen(false)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                        isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{editingAchieverIdx !== null ? "সংরক্ষণ করুন" : "শিক্ষার্থী যুক্ত করুন"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* STAFF / OFFICER ADD & EDIT MODAL */}
            {staffModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto border ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}>
                        <div className={`flex items-center justify-between pb-3 border-b ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <h3 className={`font-bold text-base flex items-center gap-2 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                <Briefcase className="w-5 h-5 text-emerald-500" />
                                <span>{editingStaffIdx !== null ? "কর্মকর্তা/কর্মচারীর তথ্য সম্পাদনা" : "নতুন কর্মকর্তা/কর্মচারী যোগ করুন"}</span>
                            </h3>
                            <button
                                onClick={() => setStaffModalOpen(false)}
                                className={`p-1.5 rounded-xl cursor-pointer ${
                                    isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveStaffModal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1.5">কর্মকর্তা/কর্মচারীর নাম *</label>
                                <input
                                    type="text"
                                    required
                                    value={staffForm.name}
                                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                                    placeholder="যেমন: মোঃ মোখলেছুর রহমান"
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">পদবি (Designation) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={staffForm.designation}
                                        onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                                        placeholder="যেমন: হিসাব সহকারী"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {["প্রধান অফিস সহকারী", "হিসাব সহকারী", "লাইব্রেরি সহকারী", "ল্যাব সহকারী", "অফিস সহায়ক", "নিরাপত্তা প্রহরী"].map((ds) => (
                                            <button
                                                key={ds}
                                                type="button"
                                                onClick={() => setStaffForm({ ...staffForm, designation: ds })}
                                                className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                                    staffForm.designation === ds
                                                        ? "bg-emerald-600 text-white border-emerald-500 font-bold"
                                                        : isDark
                                                            ? "bg-slate-950 border-slate-800 text-slate-300"
                                                            : "bg-slate-100 border-slate-200 text-slate-700"
                                                }`}
                                            >
                                                {ds}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5">শিক্ষাগত যোগ্যতা</label>
                                    <input
                                        type="text"
                                        value={staffForm.qualification}
                                        onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                                        placeholder="যেমন: B.Com / H.S.C / S.S.C"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5">মোবাইল নম্বর</label>
                                    <input
                                        type="text"
                                        value={staffForm.phone}
                                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                                        placeholder="০১৭৮৯-১২৩৪৫৬"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5">ইমেইল ঠিকানা</label>
                                    <input
                                        type="email"
                                        value={staffForm.email}
                                        onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                                        placeholder="staff@dimlagirls.edu.bd"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 outline-none border ${
                                            isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Staff Photo */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold">ছবি (Photo)</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-800 flex-shrink-0 shadow-sm">
                                        <img
                                            src={staffForm.image || sampleStaffAvatars[0].url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = sampleStaffAvatars[0].url; }}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="text"
                                            value={staffForm.image}
                                            onChange={(e) => setStaffForm({ ...staffForm, image: e.target.value })}
                                            placeholder="ছবির লিংক (Image URL)"
                                            className={`w-full rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 outline-none border font-mono ${
                                                isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                                            }`}
                                        />
                                    </div>
                                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>আপলোড</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                handleFileUpload(
                                                    file,
                                                    (url) => setStaffForm((prev) => ({ ...prev, image: url })),
                                                    {
                                                        maxWidth: 600,
                                                        maxHeight: 600,
                                                        onPreview: (blobUrl) => setStaffForm((prev) => ({ ...prev, image: blobUrl }))
                                                    }
                                                );
                                            }}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <span className={`text-[11px] block mb-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                        অথবা ডেমো ছবি থেকে এক ক্লিকে পছন্দ করুন:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {sampleStaffAvatars.map((av, avIdx) => (
                                            <button
                                                key={avIdx}
                                                type="button"
                                                onClick={() => setStaffForm({ ...staffForm, image: av.url })}
                                                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                                    staffForm.image === av.url ? "border-emerald-500 scale-110 shadow-md shadow-emerald-500/30" : "border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100"
                                                }`}
                                                title={av.label}
                                            >
                                                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <button
                                    type="button"
                                    onClick={() => setStaffModalOpen(false)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                        isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{editingStaffIdx !== null ? "সংরক্ষণ করুন" : "যুক্ত করুন"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CMSDashboard;
