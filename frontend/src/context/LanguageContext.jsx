import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
    bn: {
        schoolName: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়",
        schoolNameEn: "Dimla Government Girls' High School",
        schoolAddress: "ডিমলা, নীলফামারী, রংপুর বিভাগ",
        eiin: "১২৪৭৫৪",
        estYear: "১৯৬৭",
        slogan: "জ্ঞানই আলো • আদর্শ নারী গড়ি জাতির কল্যাণে",
        
        // Navigation
        navHome: "মূলপাতা",
        navAbout: "আমাদের পরিচিতি",
        navAtAGlance: "এক নজরে পরিচিতি",
        navHistory: "সংক্ষিপ্ত ইতিহাস",
        navCommittee: "ব্যবস্থাপনা কমিটি",
        navTeachersStaff: "শিক্ষক ও কর্মচারী",
        navTeachers: "শিক্ষক-শিক্ষিকা",
        navStaff: "কর্মকর্তা-কর্মচারী",
        navStudentsCorner: "শিক্ষার্থী বাতায়ন",
        navStudentStats: "অধ্যয়নরত শিক্ষার্থীর সংখ্যা",
        navStudentList: "অধ্যয়নরত শিক্ষার্থীর তালিকা",
        navAchievers: "কৃতি শিক্ষার্থী",
        navNotices: "নোটিশ বোর্ড",
        navExamResults: "পরীক্ষার ফলাফল",
        navPublicExam: "পাবলিক পরীক্ষা",
        navInternalExam: "বিদ্যালয়ের অভ্যন্তরীণ পরীক্ষা",
        navGallery: "গ্যালারি",
        navContact: "যোগাযোগ",
        
        // Portals & Login
        navStudentLogin: "শিক্ষার্থী লগইন",
        navTeacherLogin: "শিক্ষক লগইন",
        navAdminLogin: "অ্যাডমিন লগইন",
        myDashboard: "আমার ড্যাশবোর্ড",
        
        // Ticker & Emergency
        emergencyNotice: "জরুরি নোটিশ:",
        emergencyHotlines: "জাতীয় জরুরি সেবা",
        hotline333: "সরকারি তথ্য ও সেবা ৩৩৩",
        hotline999: "জরুরি সেবা ৯৯৯",
        hotline109: "নারী ও শিশু নির্যাতন প্রতিরোধে ১০৯",
        hotline106: "দুদক ১০৬",
        hotline1090: "দুর্যোগের আগাম বার্তা ১০৯০",
        hotline1098: "শিশুর সহায়তায় ফোন ১০৯৮",
        
        // Sidebar
        officeSchedule: "অফিসিয়াল সময়সূচি",
        officeHours: "সকাল ৯:০০ টা - বিকাল ৪:০০ টা (রবি - বৃহস্পতি)",
        fridaySaturdayClosed: "শুক্র ও শনিবার সাপ্তাহিক ছুটি",
        importantLinks: "জরুরি লিংক ও তথ্য বাতায়ন",
        prayerTime: "নামাজের সময়সূচি",
        schoolLocation: "বিদ্যালয়ের অবস্থান",
        
        // Stats
        statStudents: "শিক্ষার্থী",
        statTeachers: "শিক্ষক-শিক্ষিকা",
        statStaff: "কর্মকর্তা ও কর্মচারী",
        statPassRate: "পাশের হার",
        
        // Home Sections
        headmasterMessageTitle: "প্রতিষ্ঠান প্রধানের বাণী",
        headmasterName: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
        headmasterDesignation: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
        schoolStoryTitle: "প্রতিষ্ঠানের গল্প ও পরিচিতি",
        committeeTitle: "ব্যবস্থাপনা কমিটি",
        teachersTitle: "আমাদের সম্মানিত শিক্ষকবৃন্দ",
        achieversTitle: "কৃতি শিক্ষার্থী",
        galleryTitle: "ফটো ও ভিডিও গ্যালারি",
        latestNewsTitle: "সর্বশেষ সংবাদ ও ইভেন্ট",
        viewAll: "সকল দেখুন",
        readMore: "বিস্তারিত পড়ুন",
        download: "ডাউনলোড",
        
        // Student List
        studentListHeading: "অধ্যয়নরত শিক্ষার্থীর তালিকা",
        academicYear: "শিক্ষাবর্ষ",
        selectYear: "শিক্ষাবর্ষ নির্বাচন করুন",
        classLabel: "শ্রেণি",
        selectClass: "শ্রেণি নির্বাচন করুন",
        rollNumber: "রোল",
        studentName: "শিক্ষার্থীর নাম",
        fatherName: "পিতার নাম",
        section: "শাখা",
        status: "অবস্থা",
        noStudentsFound: "কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।",
        allClasses: "সকল শ্রেণি",
        
        // Footer
        footerAboutText: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় উত্তরাঞ্চলের নারী শিক্ষার অন্যতম ঐতিহ্যবাহী ও আদর্শ সরকারি বিদ্যাপীঠ। ১৯৬৭ সাল থেকে দক্ষ শিক্ষক ও আধুনিক পাঠ্যক্রমের মাধ্যমে নারীদের আলোকিত ভবিষ্যৎ গড়ায় আমরা প্রতিশ্রুতিবদ্ধ।",
        quickLinks: "প্রয়োজনীয় লিংক",
        contactInfo: "যোগাযোগের ঠিকানা",
        copyright: "সর্বস্বত্ব সংরক্ষিত © ২০২৬ ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়"
    },
    en: {
        schoolName: "Dimla Government Girls' High School",
        schoolNameEn: "Dimla Government Girls' High School",
        schoolAddress: "Dimla, Nilphamari, Rangpur Division",
        eiin: "124754",
        estYear: "1967",
        slogan: "Knowledge is Light • Empowering Women for the Nation",
        
        // Navigation
        navHome: "Home",
        navAbout: "About Us",
        navAtAGlance: "At a Glance",
        navHistory: "Brief History",
        navCommittee: "Managing Committee",
        navTeachersStaff: "Teachers & Staff",
        navTeachers: "Teachers",
        navStaff: "Staff",
        navStudentsCorner: "Students Corner",
        navStudentStats: "Enrolled Student Count",
        navStudentList: "Enrolled Student List",
        navAchievers: "Achieving Students",
        navNotices: "Notice Board",
        navExamResults: "Exam Results",
        navPublicExam: "Public Examination",
        navInternalExam: "School Internal Examination",
        navGallery: "Gallery",
        navContact: "Contact",
        
        // Portals & Login
        navStudentLogin: "Student Login",
        navTeacherLogin: "Teacher Login",
        navAdminLogin: "Admin Login",
        myDashboard: "My Dashboard",
        
        // Ticker & Emergency
        emergencyNotice: "Urgent Notice:",
        emergencyHotlines: "National Emergency Services",
        hotline333: "Govt Info & Services 333",
        hotline999: "National Emergency 999",
        hotline109: "Women & Child Anti-Violence 109",
        hotline106: "Anti-Corruption (ACC) 106",
        hotline1090: "Disaster Early Warning 1090",
        hotline1098: "Child Help Line 1098",
        
        // Sidebar
        officeSchedule: "Official Schedule",
        officeHours: "9:00 AM - 4:00 PM (Sun - Thu)",
        fridaySaturdayClosed: "Fri & Sat Weekend Holiday",
        importantLinks: "Important Links & Portals",
        prayerTime: "Prayer Times",
        schoolLocation: "School Location",
        
        // Stats
        statStudents: "Students",
        statTeachers: "Teachers",
        statStaff: "Staff Members",
        statPassRate: "Passing Rate",
        
        // Home Sections
        headmasterMessageTitle: "Message from Head Teacher",
        headmasterName: "Abu Jafor Md. Motasim Billah",
        headmasterDesignation: "Head Teacher (Acting)",
        schoolStoryTitle: "Our Story & Overview",
        committeeTitle: "Managing Committee",
        teachersTitle: "Our Respected Teachers",
        achieversTitle: "Achieving Students",
        galleryTitle: "Photo & Video Gallery",
        latestNewsTitle: "Latest News & Events",
        viewAll: "View All",
        readMore: "Read More",
        download: "Download",
        
        // Student List
        studentListHeading: "Enrolled Student List",
        academicYear: "Academic Year",
        selectYear: "Select Year",
        classLabel: "Class",
        selectClass: "Select Class",
        rollNumber: "Roll No",
        studentName: "Student Name",
        fatherName: "Father's Name",
        section: "Section",
        status: "Status",
        noStudentsFound: "No student records found.",
        allClasses: "All Classes",
        
        // Footer
        footerAboutText: "Dimla Government Girls' High School is one of the most prominent government institutions for female education in northern Bangladesh. Committed to shaping enlightened futures since 1967.",
        quickLinks: "Quick Links",
        contactInfo: "Contact Details",
        copyright: "All Rights Reserved © 2026 Dimla Government Girls' High School"
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem("preferred_lang") || "bn";
    });

    useEffect(() => {
        localStorage.setItem("preferred_lang", lang);
    }, [lang]);

    const toggleLanguage = () => {
        setLang((prev) => (prev === "bn" ? "en" : "bn"));
    };

    const t = (key) => {
        return translations[lang]?.[key] || translations["bn"]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
