const pool = require("../config/db");

async function setupCMS() {
    console.log("Setting up website_cms table...");
    await pool.query(`
        CREATE TABLE IF NOT EXISTS website_cms (
            section VARCHAR(100) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const defaults = {
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
        headmaster: {
            name_bn: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
            name_en: "Abu Jafor Md. Motasim Billah",
            designation_bn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
            designation_en: "Head Teacher (Acting)",
            image_url: "/uploads/cms/headmaster.png",
            message_bn: "বিসমিল্লাহির রাহমানির রাহিম। ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ডিজিটাল পোর্টালে সবাইকে আন্তরিক শুভেচ্ছা। ১৯৬৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের নারী শিক্ষার এক অনন্য বাতিঘর। নৈতিকতা, শৃঙ্খলা ও আধুনিক জ্ঞানসমৃদ্ধ পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে আত্মনির্ভরশীল ও আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের ব্রত। বর্তমান তথ্যপ্রযুক্তির যুগে আমাদের ছাত্রীরা যেন আধুনিক বিশ্বের সাথে তাল মিলিয়ে এগিয়ে যেতে পারে, সেজন্য আমরা সার্বক্ষণিক সচেষ্ট। অভিভাবক ও শুভানুধ্যায়ীদের সহযোগিতায় এই বিদ্যাপীঠ তার গৌরবের ধারা অব্যাহত রাখবে—এটাই আমাদের প্রত্যাশা।",
            message_en: "In the name of Allah, Most Gracious, Most Merciful. Welcome to the official portal of Dimla Government Girls' High School. Established in 1967, our institution stands as a beacon of female empowerment in northern Bangladesh, fostering moral discipline, academic excellence and modern digital literacy."
        },
        institutional_info: {
            institution_type_bn: "সরকারি বালিকা উচ্চ বিদ্যালয়",
            institution_type_en: "Government Girls' High School",
            board_name_bn: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর",
            board_name_en: "Board of Intermediate & Secondary Education, Dinajpur",
            levels_bn: "৬ষ্ঠ শ্রেণি হতে ১০ম শ্রেণি",
            levels_en: "Class 6 to Class 10",
            groups_bn: "বিজ্ঞান ও মানবিক শাখা",
            groups_en: "Science & Humanities",
            shift_bn: "দিবা শিফট (সকাল ৯:০০ - বিকাল ৪:০০)",
            shift_en: "Day Shift (9:00 AM - 4:00 PM)",
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
        committee: [
            { id: 1, name: "উপজেলা নির্বাহী অফিসার (ইউএনও)", role: "সভাপতি", sub: "ডিমলা, নীলফামারী" },
            { id: 2, name: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", role: "সদস্য সচিব", sub: "প্রধান শিক্ষক (ভারপ্রাপ্ত)" },
            { id: 3, name: "মোঃ রফিকুল ইসলাম", role: "অভিভাবক সদস্য", sub: "সমাজসেবক ও শিক্ষানুরাগী" },
            { id: 4, name: "মোছাঃ পারভীন আক্তার", role: "শিক্ষক প্রতিনিধি", sub: "সিনিয়র শিক্ষক" }
        ],
        school_story: {
            title_bn: "প্রতিষ্ঠানের গল্প ও পরিচিতি",
            title_en: "Our Journey & Heritage",
            image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
            content_bn: "ডিমলা উপজেলার প্রাণকেন্দ্রে মনোরম পরিবেশে অবস্থিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়। সুদক্ষ শিক্ষকমণ্ডলী, সুপরিসর বিজ্ঞানাগার, সমৃদ্ধ লাইব্রেরি ও কম্পিউটার ল্যাব সমৃদ্ধ এই প্রতিষ্ঠান প্রতিবছর বোর্ড পরীক্ষায় শতভাগ সাফল্যের গৌরব অর্জন করে চলেছে।",
            content_en: "Nestled in the scenic center of Dimla upazila, the school boasts well-equipped science laboratories, a multimedia computer lab, an enriched library and a legacy of outstanding Board examination results."
        },
        timings: {
            class_start_bn: "০৯:০০ AM",
            class_start_en: "09:00 AM",
            tiffin_break_bn: "০১:০০ PM - ০২:০০ PM",
            tiffin_break_en: "01:00 PM - 02:00 PM",
            class_end_bn: "০৪:০০ PM",
            class_end_en: "04:00 PM",
            office_hours_bn: "০৯:০০ AM - ০৪:০০ PM",
            office_hours_en: "09:00 AM - 04:00 PM",
            weekend_note_bn: "ছুটির দিন: শুক্রবার ও শনিবার",
            weekend_note_en: "Holidays: Friday & Saturday"
        },
        achievers: [
            { id: 1, name: "সুমাইয়া জাহান", exam: "SSC 2025", gpa: "GPA 5.00 (Golden)", award: "মেধাবৃত্তি প্রাপ্ত", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
            { id: 2, name: "ফারহানা আকতার", exam: "SSC 2025", gpa: "GPA 5.00", award: "বিজ্ঞান বিভাগ সেরা", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80" },
            { id: 3, name: "নুসরাত সুলতানা", exam: "SSC 2025", gpa: "GPA 5.00", award: "সাধারণ বৃত্তি", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
            { id: 4, name: "সাদিয়া ইসলাম মিম", exam: "SSC 2024", gpa: "GPA 5.00 (Golden)", award: "উপজেলা পর্যায়ে প্রথম", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
            { id: 5, name: "মেহেরুন নেসা", exam: "SSC 2024", gpa: "GPA 5.00", award: "মেধাবৃত্তি প্রাপ্ত", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80" },
            { id: 6, name: "তানজিলা আক্তার", exam: "SSC 2024", gpa: "GPA 5.00", award: "মানবিক বিভাগ সেরা", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80" }
        ],
        gallery: [
            { id: 1, title: "বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬", image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", category: "Sports" },
            { id: 2, title: "বিজ্ঞান মেলা ও প্রজেক্ট প্রদর্শনী", image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80", category: "Academic" },
            { id: 3, title: "সাংস্কৃতিক অনুষ্ঠান ও বিতর্ক প্রতিযোগিতা", image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80", category: "Cultural" },
            { id: 4, title: "আন্তর্জাতিক মাতৃভাষা দিবস উদযাপন", image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80", category: "National" }
        ],
        important_links: [
            { id: 1, title_bn: "শিক্ষা মন্ত্রণালয়", title_en: "Ministry of Education", url: "https://moedu.gov.bd", desc: "moedu.gov.bd" },
            { id: 2, title_bn: "মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (মাউশি)", title_en: "DSHE Bangladesh", url: "https://dshe.gov.bd", desc: "dshe.gov.bd" },
            { id: 3, title_bn: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, দিনাজপুর", title_en: "BISE Dinajpur", url: "https://dinajpureducationboard.gov.bd", desc: "dinajpureducationboard.gov.bd" },
            { id: 4, title_bn: "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)", title_en: "NCTB Bangladesh", url: "http://nctb.gov.bd", desc: "nctb.gov.bd" },
            { id: 5, title_bn: "শিক্ষক বাতায়ন (Shikkhok Batayon)", title_en: "Teachers Portal", url: "https://teachers.gov.bd", desc: "teachers.gov.bd" },
            { id: 6, title_bn: "বাংলাদেশ জাতীয় তথ্য বাতায়ন", title_en: "Bangladesh National Portal", url: "https://bangladesh.gov.bd", desc: "bangladesh.gov.bd" }
        ]
    };

    for (const [section, data] of Object.entries(defaults)) {
        await pool.query(`
            INSERT INTO website_cms (section, data)
            VALUES ($1, $2)
            ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data
        `, [section, JSON.stringify(data)]);
    }

    console.log("website_cms table created and seeded successfully!");
    process.exit(0);
}

setupCMS().catch(err => {
    console.error("setupCMS error:", err);
    process.exit(1);
});
