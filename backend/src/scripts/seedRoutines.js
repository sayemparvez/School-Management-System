const pool = require("../config/db");

async function seedRoutinesAndStory() {
    try {
        console.log("Seeding class routines and school story into website_cms...");

        // 1. Ensure school_story has full rich text & campus image
        const schoolStoryData = {
            title_bn: "প্রতিষ্ঠানের গল্প ও ইতিহাস",
            title_en: "Our Heritage & Overview",
            image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
            short_intro_bn: "১৯৬৭ সালে প্রতিষ্ঠিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় অত্র অঞ্চলের নারী শিক্ষার এক অনন্য ও ঐতিহ্যবাহী বাতিঘর।",
            short_intro_en: "Established in 1967, Dimla Government Girls' High School is a historic premier institution dedicated to female empowerment and academic excellence.",
            content_bn: "ডিমলা উপজেলার প্রাণকেন্দ্রে মনোরম ও প্রাকৃতিক ছায়াসুনিবিড় পরিবেশে অবস্থিত ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়। সুদক্ষ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী, তথ্যপ্রযুক্তিনির্ভর মাল্টিমিডিয়া ক্লাসরুম, সুপরিসর বিজ্ঞানাগার, সমৃদ্ধ লাইব্রেরি ও আধুনিক কম্পিউটার ল্যাব সমৃদ্ধ এই প্রতিষ্ঠান প্রতিবছর বোর্ড পরীক্ষায় শতভাগ সাফল্যের গৌরব অর্জন করে চলেছে। পাঠ্যবইয়ের শিক্ষার পাশাপাশি সহশিক্ষা কার্যক্রম, খেলাধুলা, বিতর্ক প্রতিযোগিতা ও স্কাউটিং কার্যক্রমে আমাদের ছাত্রীরা দেশসেরা সাফল্য বয়ে এনেছে।",
            content_en: "Nestled in the serene heart of Dimla Upazila, Dimla Government Girls' High School features well-equipped modern laboratories, digital classrooms, an enriched library, and a proud history of 100% board exam passing rates."
        };

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('school_story', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(schoolStoryData)]);
        console.log("✓ Updated school_story in website_cms.");

        // 2. Class Routines Data for all classes (6 to 10)
        const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];
        
        const periodSlots = [
            { period: "সমাবেশ", time: "১০:০০ - ১০:১৫ AM", isBreak: true },
            { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:১৫ AM" },
            { period: "২য় পিরিয়ড", time: "১১:১৫ - ১২:১৫ PM" },
            { period: "৩য় পিরিয়ড", time: "১২:১৫ - ০১:১৫ PM" },
            { period: "টিফিন বিরতি", time: "০১:১৫ - ০২:০০ PM", isBreak: true },
            { period: "৪র্থ পিরিয়ড", time: "০২:০০ - ০৩:০০ PM" },
            { period: "৫ম পিরিয়ড", time: "০৩:০০ - ০৪:০০ PM" }
        ];

        const routinesData = {
            academic_year: "২০২৬",
            updated_at: new Date().toISOString(),
            classes: {
                "class_6": {
                    name_bn: "৬ষ্ঠ শ্রেণি",
                    name_en: "Class 6",
                    section_bn: "কোনো শাখা নেই (সাধারণ)",
                    room_no: "১০১",
                    class_teacher: "মোছাঃ সেলিনা আক্তার",
                    schedule: {
                        "রবিবার": [
                            { period: "১ম পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                            { period: "২য় পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০১" },
                            { period: "৩য় পিরিয়ড", subject: "গণিত", teacher: "মোঃ নূর আলম", room: "১০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                            { period: "৫ম পিরিয়ড", subject: "তথ্য ও যোগাযোগ প্রযুক্তি", teacher: "মোছাঃ শাহনাজ পারভীন", room: "কম্পিউটার ল্যাব" }
                        ],
                        "সোমবার": [
                            { period: "১ম পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০১" },
                            { period: "২য় পিরিয়ড", subject: "গণিত", teacher: "মোঃ নূর আলম", room: "১০১" },
                            { period: "৩য় পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "১০১" },
                            { period: "৫ম পিরিয়ড", subject: "ধর্ম ও নৈতিক শিক্ষা", teacher: "মোঃ রেজাউল করিম", room: "১০১" }
                        ],
                        "মঙ্গলবার": [
                            { period: "১ম পিরিয়ড", subject: "গণিত", teacher: "মোঃ নূর আলম", room: "১০১" },
                            { period: "২য় পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                            { period: "৩য় পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "ডিজিটাল প্রযুক্তি", teacher: "মোছাঃ শাহনাজ পারভীন", room: "ল্যাব" },
                            { period: "৫ম পিরিয়ড", subject: "স্বাস্থ্য সুরক্ষা ও খেলাধুলা", teacher: "মোঃ রফিকুল ইসলাম", room: "মাঠ" }
                        ],
                        "বুধবার": [
                            { period: "১ম পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                            { period: "২য় পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "গণিত", teacher: "মোঃ নূর আলম", room: "১০১" },
                            { period: "৫ম পিরিয়ড", subject: "শিল্প ও সংস্কৃতি", teacher: "মিসেস মমতাজ বেগম", room: "১০১" }
                        ],
                        "বৃহস্পতিবার": [
                            { period: "১ম পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০১" },
                            { period: "২য় পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "১০১" },
                            { period: "৩য় পিরিয়ড", subject: "গণিত রিভিশন", teacher: "মোঃ নূর আলম", room: "১০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "বিজ্ঞান ব্যবহারিক", teacher: "মোঃ রফিকুল ইসলাম", room: "ল্যাবরেটরি" },
                            { period: "৫ম পিরিয়ড", subject: "সাপ্তাহিক বিতর্ক ও কুইজ", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" }
                        ]
                    }
                },
                "class_7": {
                    name_bn: "৭ম শ্রেণি",
                    name_en: "Class 7",
                    section_bn: "কোনো শাখা নেই (সাধারণ)",
                    room_no: "১০২",
                    class_teacher: "মোঃ রেজাউল করিম",
                    schedule: {
                        "রবিবার": [
                            { period: "১ম পিরিয়ড", subject: "গণিত", teacher: "মোছাঃ শাহনাজ পারভীন", room: "১০২" },
                            { period: "২য় পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০২" },
                            { period: "৩য় পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০২" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০২" },
                            { period: "৫ম পিরিয়ড", subject: "ডিজিটাল প্রযুক্তি", teacher: "মোঃ নূর আলম", room: "১০২" }
                        ],
                        "সোমবার": [
                            { period: "১ম পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০২" },
                            { period: "২য় পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০২" },
                            { period: "৩য় পিরিয়ড", subject: "গণিত", teacher: "মোছাঃ শাহনাজ পারভীন", room: "১০২" },
                            { period: "৪র্থ পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০২" },
                            { period: "৫ম পিরিয়ড", subject: "স্বাস্থ্য সুরক্ষা", teacher: "মিসেস মমতাজ বেগম", room: "১০২" }
                        ],
                        "মঙ্গলবার": [
                            { period: "১ম পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০২" },
                            { period: "২য় পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০২" },
                            { period: "৩য় পিরিয়ড", subject: "গণিত", teacher: "মোছাঃ শাহনাজ পারভীন", room: "১০২" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "১০২" },
                            { period: "৫ম পিরিয়ড", subject: "ধর্ম ও নৈতিক শিক্ষা", teacher: "মোঃ রেজাউল করিম", room: "১০২" }
                        ],
                        "বুধবার": [
                            { period: "১ম পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০২" },
                            { period: "২য় পিরিয়ড", subject: "গণিত", teacher: "মোছাঃ শাহনাজ পারভীন", room: "১০২" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০২" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০২" },
                            { period: "৫ম পিরিয়ড", subject: "জীবন ও জীবিকা", teacher: "মিসেস মমতাজ বেগম", room: "১০২" }
                        ],
                        "বৃহস্পতিবার": [
                            { period: "১ম পিরিয়ড", subject: "গণিত প্র্যাকটিস", teacher: "মোছাঃ শাহনাজ পারভীন", room: "১০২" },
                            { period: "২য় পিরিয়ড", subject: "বিজ্ঞান ল্যাব", teacher: "মোঃ রফিকুল ইসলাম", room: "বিজ্ঞানাগার" },
                            { period: "৩য় পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "১০২" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি স্পোকেন", teacher: "মোঃ রেজাউল করিম", room: "১০২" },
                            { period: "৫ম পিরিয়ড", subject: "সহশিক্ষা কার্যক্রম", teacher: "মোছাঃ সেলিনা আক্তার", room: "মাঠ" }
                        ]
                    }
                },
                "class_8": {
                    name_bn: "৮ম শ্রেণি",
                    name_en: "Class 8",
                    section_bn: "কোনো শাখা নেই (সাধারণ)",
                    room_no: "১০৩",
                    class_teacher: "মোঃ রফিকুল ইসলাম",
                    schedule: {
                        "রবিবার": [
                            { period: "১ম পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০৩" },
                            { period: "২য় পিরিয়ড", subject: "গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "১০৩" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০৩" },
                            { period: "৫ম পিরিয়ড", subject: "ডিজিটাল প্রযুক্তি", teacher: "মোঃ নূর আলম", room: "১০৩" }
                        ],
                        "সোমবার": [
                            { period: "১ম পিরিয়ড", subject: "গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "১০৩" },
                            { period: "২য় পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০৩" },
                            { period: "৩য় পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০৩" },
                            { period: "৫ম পিরিয়ড", subject: "ধর্ম ও নৈতিক শিক্ষা", teacher: "মোঃ নূর আলম", room: "১০৩" }
                        ],
                        "মঙ্গলবার": [
                            { period: "১ম পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০৩" },
                            { period: "২য় পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০৩" },
                            { period: "৩য় পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "১০৩" },
                            { period: "৫ম পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "১০৩" }
                        ],
                        "বুধবার": [
                            { period: "১ম পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "১০৩" },
                            { period: "২য় পিরিয়ড", subject: "গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "১০৩" },
                            { period: "৩য় পিরিয়ড", subject: "বিজ্ঞান", teacher: "মোঃ রফিকুল ইসলাম", room: "১০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০৩" },
                            { period: "৫ম পিরিয়ড", subject: "স্বাস্থ্য সুরক্ষা", teacher: "মিসেস মমতাজ বেগম", room: "১০৩" }
                        ],
                        "বৃহস্পতিবার": [
                            { period: "১ম পিরিয়ড", subject: "গণিত এক্সট্রা ক্লাস", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "১০৩" },
                            { period: "২য় পিরিয়ড", subject: "বিজ্ঞান ল্যাব", teacher: "মোঃ রফিকুল ইসলাম", room: "বিজ্ঞানাগার" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি গ্রামার", teacher: "মোঃ রেজাউল করিম", room: "১০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "আইসিটি প্র্যাকটিক্যাল", teacher: "মোঃ নূর আলম", room: "কম্পিউটার ল্যাব" },
                            { period: "৫ম পিরিয়ড", subject: "স্কাউটিং ও সাংস্কৃতিক", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০৩" }
                        ]
                    }
                },
                "class_9": {
                    name_bn: "৯ম শ্রেণি",
                    name_en: "Class 9",
                    section_bn: "বিজ্ঞান ও মানবিক বিভাগ",
                    room_no: "২০১ ও ২০২",
                    class_teacher: "মোছাঃ শাহনাজ পারভীন",
                    schedule: {
                        "রবিবার": [
                            { period: "১ম পিরিয়ড", subject: "পদার্থবিজ্ঞান / ইতিহাস", teacher: "মোঃ রফিকুল ইসলাম / মমতাজ বেগম", room: "২০১/২০২" },
                            { period: "২য় পিরিয়ড", subject: "উচ্চতর গণিত / অর্থনীতি", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০১/২০২" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "২০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "২০১" },
                            { period: "৫ম পিরিয়ড", subject: "তথ্য ও যোগাযোগ প্রযুক্তি", teacher: "মোঃ নূর আলম", room: "ল্যাব" }
                        ],
                        "সোমবার": [
                            { period: "১ম পিরিয়ড", subject: "রসায়ন / ভূগোল", teacher: "মোঃ রফিকুল ইসলাম / মমতাজ বেগম", room: "২০১/২০২" },
                            { period: "২য় পিরিয়ড", subject: "জীববিজ্ঞান / পৌরনীতি", teacher: "মোছাঃ শাহনাজ পারভীন", room: "২০১/২০২" },
                            { period: "৩য় পিরিয়ড", subject: "সাধারণ গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "২০১" },
                            { period: "৫ম পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "২০১" }
                        ],
                        "মঙ্গলবার": [
                            { period: "১ম পিরিয়ড", subject: "সাধারণ গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০১" },
                            { period: "২য় পিরিয়ড", subject: "পদার্থবিজ্ঞান / ইতিহাস", teacher: "মোঃ রফিকুল ইসলাম", room: "২০১/২০২" },
                            { period: "৩য় পিরিয়ড", subject: "রসায়ন / ভূগোল", teacher: "মোছাঃ শাহনাজ পারভীন", room: "২০১/২০২" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "২০১" },
                            { period: "৫ম পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "২০১" }
                        ],
                        "বুধবার": [
                            { period: "১ম পিরিয়ড", subject: "জীববিজ্ঞান / পৌরনীতি", teacher: "মোছাঃ শাহনাজ পারভীন", room: "২০১/২০২" },
                            { period: "২য় পিরিয়ড", subject: "উচ্চতর গণিত / অর্থনীতি", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০১/২০২" },
                            { period: "৩য় পিরিয়ড", subject: "পদার্থবিজ্ঞান প্র্যাকটিক্যাল", teacher: "মোঃ রফিকুল ইসলাম", room: "বিজ্ঞানাগার" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "২০১" },
                            { period: "৫ম পিরিয়ড", subject: "ধর্ম ও নৈতিক শিক্ষা", teacher: "মোঃ রেজাউল করিম", room: "২০১" }
                        ],
                        "বৃহস্পতিবার": [
                            { period: "১ম পিরিয়ড", subject: "রসায়ন প্র্যাকটিক্যাল", teacher: "মোঃ রফিকুল ইসলাম", room: "ল্যাব" },
                            { period: "২য় পিরিয়ড", subject: "জীববিজ্ঞান প্র্যাকটিক্যাল", teacher: "মোছাঃ শাহনাজ পারভীন", room: "ল্যাব" },
                            { period: "৩য় পিরিয়ড", subject: "সাধারণ গণিত স্পেশাল", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০১" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি গ্রামার", teacher: "মোঃ রেজাউল করিম", room: "২০১" },
                            { period: "৫ম পিরিয়ড", subject: "আইসিটি ল্যাব", teacher: "মোঃ নূর আলম", room: "ল্যাব" }
                        ]
                    }
                },
                "class_10": {
                    name_bn: "১০ম শ্রেণি (এসএসসি ২০২৭)",
                    name_en: "Class 10 (SSC 2027)",
                    section_bn: "বিজ্ঞান ও মানবিক বিভাগ",
                    room_no: "২০৩ ও ২০৪",
                    class_teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
                    schedule: {
                        "রবিবার": [
                            { period: "১ম পিরিয়ড", subject: "পদার্থবিজ্ঞান / ইতিহাস", teacher: "মোঃ রফিকুল ইসলাম", room: "২০৩/২০৪" },
                            { period: "২য় পিরিয়ড", subject: "রসায়ন / ভূগোল", teacher: "মোছাঃ শাহনাজ পারভীন", room: "২০৩/২০৪" },
                            { period: "৩য় পিরিয়ড", subject: "উচ্চতর গণিত / অর্থনীতি", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০৩/২০৪" },
                            { period: "৪র্থ পিরিয়ড", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রেজাউল করিম", room: "২০৩" },
                            { period: "৫ম পিরিয়ড", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "২০৩" }
                        ],
                        "সোমবার": [
                            { period: "১ম পিরিয়ড", subject: "জীববিজ্ঞান / পৌরনীতি", teacher: "মোছাঃ শাহনাজ পারভীন", room: "২০৩/২০৪" },
                            { period: "২য় পিরিয়ড", subject: "পদার্থবিজ্ঞান / ইতিহাস", teacher: "মোঃ রফিকুল ইসলাম", room: "২০৩/২০৪" },
                            { period: "৩য় পিরিয়ড", subject: "সাধারণ গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "রসায়ন / ভূগোল", teacher: "মোছাঃ শাহনাজ পারভীন", room: "২০৩/২০৪" },
                            { period: "৫ম পিরিয়ড", subject: "আইসিটি", teacher: "মোঃ নূর আলম", room: "ল্যাব" }
                        ],
                        "মঙ্গলবার": [
                            { period: "১ম পিরিয়ড", subject: "সাধারণ গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০৩" },
                            { period: "২য় পিরিয়ড", subject: "উচ্চতর গণিত / অর্থনীতি", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০৩/২০৪" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রেজাউল করিম", room: "২০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "২০৩" },
                            { period: "৫ম পিরিয়ড", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মিসেস মমতাজ বেগম", room: "২০৩" }
                        ],
                        "বুধবার": [
                            { period: "১ম পিরিয়ড", subject: "পদার্থবিজ্ঞান ল্যাব", teacher: "মোঃ রফিকুল ইসলাম", room: "বিজ্ঞানাগার" },
                            { period: "২য় পিরিয়ড", subject: "রসায়ন ল্যাব", teacher: "মোছাঃ শাহনাজ পারভীন", room: "বিজ্ঞানাগার" },
                            { period: "৩য় পিরিয়ড", subject: "জীববিজ্ঞান ল্যাব", teacher: "মোঃ রফিকুল ইসলাম", room: "বিজ্ঞানাগার" },
                            { period: "৪র্থ পিরিয়ড", subject: "সাধারণ গণিত রিভিশন", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০৩" },
                            { period: "৫ম পিরিয়ড", subject: "ইংরেজি মডেল টেস্ট", teacher: "মোঃ রেজাউল করিম", room: "২০৩" }
                        ],
                        "বৃহস্পতিবার": [
                            { period: "১ম পিরিয়ড", subject: "এসএসসি স্পেশাল গণিত", teacher: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্", room: "২০৩" },
                            { period: "২য় পিরিয়ড", subject: "পদার্থ ও রসায়ন সলভ ক্লাস", teacher: "মোঃ রফিকুল ইসলাম", room: "২০৩" },
                            { period: "৩য় পিরিয়ড", subject: "ইংরেজি রাইটিং স্কিল", teacher: "মোঃ রেজাউল করিম", room: "২০৩" },
                            { period: "৪র্থ পিরিয়ড", subject: "বাংলা মডেল টেস্ট", teacher: "মোছাঃ সেলিনা আক্তার", room: "২০৩" },
                            { period: "৫ম পিরিয়ড", subject: "আইসিটি প্র্যাকটিক্যাল", teacher: "মোঃ নূর আলম", room: "ল্যাব" }
                        ]
                    }
                }
            }
        };

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('class_routines', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(routinesData)]);
        console.log("✓ Initialized class_routines in website_cms.");

        console.log("Seeding finished successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seedRoutinesAndStory();
