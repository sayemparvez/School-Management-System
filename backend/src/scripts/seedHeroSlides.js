const pool = require("../config/db");

async function seedHeroSlides() {
    try {
        const slides = [
            {
                id: 1,
                title_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়",
                title_en: "Dimla Government Girls' High School",
                subtitle_bn: "দক্ষ শিক্ষক, তথ্যপ্রযুক্তিনির্ভর মাল্টিমিডিয়া ক্লাসরুম ও সৃজনশীল সহশিক্ষা কার্যক্রমের মাধ্যমে আদর্শ ও মানবিক গুণসম্পন্ন নারী নেতৃত্ব গড়ে তোলাই আমাদের লক্ষ্য।",
                subtitle_en: "Empowering female learners with dedicated faculty, modern digital classrooms, and holistic co-curricular excellence to build enlightened future leaders.",
                badge_bn: "ঐতিহ্যবাহী সরকারি নারী বিদ্যাপীঠ • স্থাপিত ১৯৬৭",
                badge_en: "Premier Govt. Girls' Institution • Est. 1967",
                image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80",
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

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('hero_slides', $1, CURRENT_TIMESTAMP)
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify(slides)]);

        console.log("Hero slides successfully seeded to website_cms!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding hero slides:", err);
        process.exit(1);
    }
}

seedHeroSlides();
