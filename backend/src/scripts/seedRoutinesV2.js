const pool = require("../config/db");

async function seedUpdatedRoutines() {
    try {
        console.log("Seeding realistic 6-period (Class 6-8) and 7-period (Class 9-10) routines...");

        const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];

        // Class 6-8 Schedule Template (6 periods)
        // 4 periods before tiffin, 2 after
        const class6to8Subjects = {
            "রবিবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "সাধারণ গণিত", teacher: "মিজানুর রহমান", room: "১০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "সাধারণ বিজ্ঞান", teacher: "মোছাঃ ফাতেমা বেগম", room: "১০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০৩:০০ PM", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মোঃ হাফিজুর রহমান", room: "১০১" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০৩:০০ - ০৪:০০ PM", subject: "তথ্য ও যোগাযোগ প্রযুক্তি (ল্যাব)", teacher: "ফারহানা হক", room: "ডিজিটাল ল্যাব" }
            ],
            "সোমবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "সাধারণ গণিত", teacher: "মিজানুর রহমান", room: "১০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "ইসলাম ও নৈতিক শিক্ষা / হিন্দুধর্ম", teacher: "মাওলানা আব্দুর রশিদ / সুবোধ রায়", room: "১০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০৩:০০ PM", subject: "সাধারণ বিজ্ঞান (ব্যবহারিক)", teacher: "মোছাঃ ফাতেমা বেগম", room: "বিজ্ঞান ল্যাব" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০৩:০০ - ০৪:০০ PM", subject: "শারীরিক শিক্ষা ও স্বাস্থ্য", teacher: "আব্দুল মজিদ", room: "খেলার মাঠ" }
            ],
            "মঙ্গলবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "সাধারণ গণিত", teacher: "মিজানুর রহমান", room: "১০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "সাধারণ বিজ্ঞান", teacher: "মোছাঃ ফাতেমা বেগম", room: "১০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "বাংলা ১ম পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "ইংরেজি ১ম পত্র", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০৩:০০ PM", subject: "চারু ও কারুকলা", teacher: "নিলুফার ইয়াসমিন", room: "১০১" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০৩:০০ - ০৪:০০ PM", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মোঃ হাফিজুর রহমান", room: "১০১" }
            ],
            "বুধবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "তথ্য ও যোগাযোগ প্রযুক্তি", teacher: "ফারহানা হক", room: "ডিজিটাল ল্যাব" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "সাধারণ গণিত", teacher: "মিজানুর রহমান", room: "১০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "ইংরেজি ২য় পত্র", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "বাংলা ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০৩:০০ PM", subject: "সাধারণ বিজ্ঞান", teacher: "মোছাঃ ফাতেমা বেগম", room: "১০১" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০৩:০০ - ০৪:০০ PM", subject: "কৃষি শিক্ষা / গার্হস্থ্য বিজ্ঞান", teacher: "শামসুন্নাহার পারভীন", room: "১০১" }
            ],
            "বৃহস্পতিবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "সাধারণ গণিত (কুইজ ও মূল্যায়ন)", teacher: "মিজানুর রহমান", room: "১০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "ইংরেজি ১ম ও ২য় পত্র", teacher: "মোঃ রফিকুল ইসলাম", room: "১০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "বাংলা ১ম ও ২য় পত্র", teacher: "মোছাঃ সেলিনা আক্তার", room: "১০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "মোঃ হাফিজুর রহমান", room: "১০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০৩:০০ PM", subject: "ধর্ম ও নৈতিক শিক্ষা", teacher: "মাওলানা আব্দুর রশিদ / সুবোধ রায়", room: "১০১" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০৩:০০ - ০৪:০০ PM", subject: "স্কাউটিং ও সহশিক্ষা কার্যক্রম", teacher: "আব্দুল মজিদ ও শিক্ষকবৃন্দ", room: "মাঠ / অডিটোরিয়াম" }
            ]
        };

        // Class 9 & 10 Schedule Template (7 periods)
        // 4 periods before tiffin, 3 after
        const class9to10Subjects = {
            "রবিবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "বাংলা ১ম পত্র (যৌথ)", teacher: "প্রভাষক কামরুল হাসান", room: "২০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "ইংরেজি ১ম পত্র (যৌথ)", teacher: "মাহমুদা খাতুন", room: "২০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "সাধারণ গণিত (যৌথ)", teacher: "আব্দুল কাদের জিলানী", room: "২০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "পদার্থবিজ্ঞান / ইতিহাস", teacher: "ড. শফিকুল ইসলাম / সুলতানা রাজিয়া", room: "২০১ / ২০২" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪০ PM", subject: "রসায়ন / ভূগোল ও পরিবেশ", teacher: "মোছাঃ নাজনীন জাহান / আসমা খাতুন", room: "২০১ / ২০২" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪০ - ০৩:২০ PM", subject: "উচ্চতর গণিত / অর্থনীতি", teacher: "আব্দুল কাদের জিলানী / মোজাম্মেল হক", room: "২০১ / ২০২" },
                { period: "৭ম পিরিয়ড", time: "০৩:২০ - ০৪:০০ PM", subject: "তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)", teacher: "ইঞ্জি. তারেক মাহমুদ", room: "ডিজিটাল ল্যাব" }
            ],
            "সোমবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "ইংরেজি ২য় পত্র (যৌথ)", teacher: "মাহমুদা খাতুন", room: "২০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "বাংলা ২য় পত্র (যৌথ)", teacher: "প্রভাষক কামরুল হাসান", room: "২০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "সাধারণ গণিত (যৌথ)", teacher: "আব্দুল কাদের জিলানী", room: "২০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "জীববিজ্ঞান / পৌরনীতি ও নাগরিকতা", teacher: "মুহাম্মদ আলী / আসমা খাতুন", room: "২০১ / ২০২" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪০ PM", subject: "পদার্থবিজ্ঞান (ব্যবহারিক) / যুক্তিবিদ্যা", teacher: "ড. শফিকুল ইসলাম", room: "ল্যাবরেটরি" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪০ - ০৩:২০ PM", subject: "বাংলাদেশ ও বিশ্বপরিচয় (যৌথ)", teacher: "সুলতানা রাজিয়া", room: "২০১" },
                { period: "৭ম পিরিয়ড", time: "০৩:২০ - ০৪:০০ PM", subject: "ধর্ম ও নৈতিক শিক্ষা (যৌথ)", teacher: "মাওলানা মোজাম্মেল / স্বপন কুমার", room: "২০১" }
            ],
            "মঙ্গলবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "পদার্থবিজ্ঞান / ইতিহাস", teacher: "ড. শফিকুল ইসলাম / সুলতানা রাজিয়া", room: "২০১ / ২০২" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "রসায়ন / অর্থনীতি", teacher: "মোছাঃ নাজনীন জাহান / মোজাম্মেল হক", room: "২০১ / ২০২" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "সাধারণ গণিত (যৌথ)", teacher: "আব্দুল কাদের জিলানী", room: "২০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "উচ্চতর গণিত / ভূগোল", teacher: "আব্দুল কাদের জিলানী / আসমা খাতুন", room: "২০১ / ২০২" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪০ PM", subject: "বাংলা ১ম পত্র (যৌথ)", teacher: "প্রভাষক কামরুল হাসান", room: "২০১" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪০ - ০৩:২০ PM", subject: "ইংরেজি ১ম পত্র (যৌথ)", teacher: "মাহমুদা খাতুন", room: "২০১" },
                { period: "৭ম পিরিয়ড", time: "০৩:২০ - ০৪:০০ PM", subject: "শারীরিক শিক্ষা ও ক্যারিয়ার শিক্ষা", teacher: "আব্দুল মজিদ", room: "মাঠ / ২০১" }
            ],
            "বুধবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "জীববিজ্ঞান (ব্যবহারিক) / পৌরনীতি", teacher: "মুহাম্মদ আলী / আসমা খাতুন", room: "ল্যাব / ২০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "রসায়ন (ব্যবহারিক) / অর্থনীতি", teacher: "মোছাঃ নাজনীন জাহান", room: "বিজ্ঞান ল্যাব" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "ইংরেজি ২য় পত্র (যৌথ)", teacher: "মাহমুদা খাতুন", room: "২০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "বাংলা ২য় পত্র (যৌথ)", teacher: "প্রভাষক কামরুল হাসান", room: "২০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪০ PM", subject: "সাধারণ গণিত", teacher: "আব্দুল কাদের জিলানী", room: "২০১" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪০ - ০৩:২০ PM", subject: "তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)", teacher: "ইঞ্জি. তারেক মাহমুদ", room: "ডিজিটাল ল্যাব" },
                { period: "৭ম পিরিয়ড", time: "০৩:২০ - ০৪:০০ PM", subject: "বাংলাদেশ ও বিশ্বপরিচয়", teacher: "সুলতানা রাজিয়া", room: "২০১" }
            ],
            "বৃহস্পতিবার": [
                { period: "১ম পিরিয়ড", time: "১০:১৫ - ১১:০০ AM", subject: "সাধারণ গণিত ও উচ্চতর গণিত সমস্যা সমাধান", teacher: "আব্দুল কাদের জিলানী", room: "২০১" },
                { period: "২য় পিরিয়ড", time: "১১:০০ - ১১:৪৫ AM", subject: "পদার্থবিজ্ঞান / রসায়ন রিভিশন", teacher: "ড. শফিকুল ইসলাম / মোছাঃ নাজনীন জাহান", room: "২০১" },
                { period: "৩য় পিরিয়ড", time: "১১:৪৫ - ১২:৩০ PM", subject: "ইংরেজি গ্রামার ও রাইটিং স্কিল", teacher: "মাহমুদা খাতুন", room: "২০১" },
                { period: "৪র্থ পিরিয়ড", time: "১২:৩০ - ০১:১৫ PM", subject: "বাংলা ব্যাকরণ ও সাহিত্য পাঠ", teacher: "প্রভাষক কামরুল হাসান", room: "২০১" },
                { period: "৫ম পিরিয়ড", time: "০২:০০ - ০২:৪০ PM", subject: "বিজ্ঞান ও সমাজ মডেল টেস্ট", teacher: "বিষয়ভিত্তিক শিক্ষকবৃন্দ", room: "২০১ / ২০২" },
                { period: "৬ষ্ঠ পিরিয়ড", time: "০২:৪০ - ০৩:২০ PM", subject: "ধর্ম ও নৈতিক শিক্ষা", teacher: "মাওলানা মোজাম্মেল / স্বপন কুমার", room: "২০১" },
                { period: "৭ম পিরিয়ড", time: "০৩:২০ - ০৪:০০ PM", subject: "সাপ্তাহিক বিতর্ক, কুইজ ও ক্লাব এক্টিভিটিজ", teacher: "ক্লাব মডারেটর শিক্ষকবৃন্দ", room: "অডিটোরিয়াম" }
            ]
        };

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
                    daily_periods: 6,
                    schedule: class6to8Subjects
                },
                "class_7": {
                    name_bn: "৭ম শ্রেণি",
                    name_en: "Class 7",
                    section_bn: "কোনো শাখা নেই (সাধারণ)",
                    room_no: "১০২",
                    class_teacher: "মোঃ রফিকুল ইসলাম",
                    daily_periods: 6,
                    schedule: class6to8Subjects
                },
                "class_8": {
                    name_bn: "৮ম শ্রেণি",
                    name_en: "Class 8",
                    section_bn: "কোনো শাখা নেই (সাধারণ)",
                    room_no: "১০৩",
                    class_teacher: "মিজানুর রহমান",
                    daily_periods: 6,
                    schedule: class6to8Subjects
                },
                "class_9": {
                    name_bn: "৯ম শ্রেণি",
                    name_en: "Class 9",
                    section_bn: "বিজ্ঞান ও মানবিক শাখা",
                    room_no: "২০১ ও ২০২",
                    class_teacher: "ড. শফিকুল ইসলাম",
                    daily_periods: 7,
                    schedule: class9to10Subjects
                },
                "class_10": {
                    name_bn: "১০ম শ্রেণি (এসএসসি ২০২৭)",
                    name_en: "Class 10 (SSC 2027)",
                    section_bn: "বিজ্ঞান ও মানবিক শাখা",
                    room_no: "২০৩ ও ২০৪",
                    class_teacher: "প্রভাষক কামরুল হাসান",
                    daily_periods: 7,
                    schedule: class9to10Subjects
                }
            }
        };

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('class_routines', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(routinesData)]);

        console.log("✓ Updated class_routines in website_cms successfully!");
    } catch (e) {
        console.error("Error seeding updated routines:", e);
    } finally {
        pool.end();
    }
}

seedUpdatedRoutines();
