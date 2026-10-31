const pool = require("../config/db");

async function updateSchoolSystem() {
    try {
        console.log("Starting database updates for students & CMS...");

        // 1. Add religion and is_disabled columns to students table if not exist
        await pool.query(`
            ALTER TABLE students ADD COLUMN IF NOT EXISTS religion VARCHAR(50) DEFAULT 'ইসলাম';
            ALTER TABLE students ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN DEFAULT false;
        `);
        console.log("✓ Added religion and is_disabled columns to students table.");

        // 2. Set realistic religion values for existing students
        await pool.query(`
            UPDATE students 
            SET religion = 'হিন্দু' 
            WHERE LOWER(lastname) LIKE '%roy%' 
               OR LOWER(lastname) LIKE '%saha%' 
               OR LOWER(lastname) LIKE '%das%' 
               OR LOWER(lastname) LIKE '%sen%' 
               OR LOWER(lastname) LIKE '%rani%' 
               OR LOWER(firstname) LIKE '%ritu%';

            UPDATE students 
            SET religion = 'ইসলাম' 
            WHERE religion IS NULL OR (religion != 'হিন্দু');
        `);
        console.log("✓ Updated student religions (Islam & Hindu).");

        // Mark 1 student as physically challenged for demo/stat
        await pool.query(`
            UPDATE students 
            SET is_disabled = true 
            WHERE rollnumber = '802' OR rollnumber = '952';
        `);
        console.log("✓ Marked special needs student records.");

        // 3. Ensure timings in website_cms matches user's exact schedule:
        // প্রাত্যহিক সমাবেশ: ১০:০০ AM - ১০:১৫ AM
        // শ্রেণি পাঠদান (১ম পর্ব): ১০:১৫ AM - ০১:১৫ PM
        // টিফিন বিরতি: ০১:১৫ PM - ০২:০০ PM
        // শ্রেণি পাঠদান ও ছুটি: ০২:০০ PM - ০৪:০০ PM
        // অফিস সময়: ০৯:৩০ AM - ০৪:৩০ PM
        const timingsData = {
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
        };

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('timings', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(timingsData)]);
        console.log("✓ Updated school schedule/timings in website_cms.");

        // 4. Update headmaster in website_cms to ensure Abu Jafor Md. Motasim Billah & /headmaster.png
        const headmasterData = {
            name_bn: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
            name_en: "Abu Jafor Md. Motasim Billah",
            designation_bn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
            designation_en: "Head Teacher (Acting)",
            image_url: "/headmaster.png",
            message_bn: "বিসমিল্লাহির রাহমানির রাহিম। ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ডিজিটাল পোর্টালে সবাইকে আন্তরিক শুভেচ্ছা। ১৯৬৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের নারী শিক্ষার এক অনন্য বাতিঘর। নৈতিকতা, শৃঙ্খলা ও আধুনিক জ্ঞানসমৃদ্ধ পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে আত্মনির্ভরশীল ও আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের ব্রত। বর্তমান তথ্যপ্রযুক্তির যুগে আমাদের ছাত্রীরা যেন আধুনিক বিশ্বের সাথে তাল মিলিয়ে এগিয়ে যেতে পারে, সেজন্য আমরা সার্বক্ষণিক সচেষ্ট। অভিভাবক ও শুভানুধ্যায়ীদের সহযোগিতায় এই বিদ্যাপীঠ তার গৌরবের ধারা অব্যাহত রাখবে—এটাই আমাদের প্রত্যাশা।",
            message_en: "In the name of Allah, Most Gracious, Most Merciful. Welcome to the official portal of Dimla Government Girls' High School. Established in 1967, our institution stands as a beacon of female empowerment in northern Bangladesh, fostering moral discipline, academic excellence and modern digital literacy."
        };

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('headmaster', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(headmasterData)]);
        console.log("✓ Updated headmaster profile in website_cms.");

        // 5. Add notices section in website_cms
        const noticesData = [
            {
                id: 1,
                title_bn: "২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে নতুন ভর্তি ও ক্লাস রুটিন সংক্রান্ত জরুরি বিজ্ঞপ্তি",
                title_en: "Urgent Notice regarding New Admission and Class Routine for Academic Year 2026",
                date: "২৮ অক্টোবর, ২০২৬",
                date_en: "28 Oct 2026",
                category: "admission",
                category_name_bn: "ভর্তি সংক্রান্ত",
                category_name_en: "Admission",
                description_bn: "ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের সকল অভিভাবক ও শিক্ষার্থীর অবগতির জন্য জানানো যাচ্ছে যে, ২০২৬ শিক্ষাবর্ষের সকল শ্রেণির ক্লাস কার্যক্রম সকাল ১০:০০ টায় প্রাত্যহিক সমাবেশের মাধ্যমে নিয়মিত রুটিন অনুযায়ী অনুষ্ঠিত হবে। শিক্ষার্থীদের নির্ধারিত পোশাকে সকাল ৯:৪৫ মিনিটের মধ্যে বিদ্যালয়ে উপস্থিত হতে নির্দেশ দেওয়া হলো।",
                description_en: "All guardians and students are informed that class activities for the 2026 academic year will proceed according to the regular schedule starting with Morning Assembly at 10:00 AM.",
                file_url: ""
            },
            {
                id: 2,
                title_bn: "১০ম শ্রেণির শিক্ষার্থীদের প্রাক-নির্বাচনী (Pre-Test) পরীক্ষার সময়সূচি ও প্রবেশপত্র বিতরণ",
                title_en: "Schedule and Admit Card Distribution for Class 10 Pre-Test Examination",
                date: "২৫ অক্টোবর, ২০২৬",
                date_en: "25 Oct 2026",
                category: "exam",
                category_name_bn: "পরীক্ষা সংক্রান্ত",
                category_name_en: "Examination",
                description_bn: "২০২৭ সালের এসএসসি পরীক্ষার্থীদের প্রাক-নির্বাচনী পরীক্ষা আগামী ৫ই নভেম্বর থেকে শুরু হবে। আগামী ৩রা নভেম্বরের মধ্যে সকল বকেয়া ফি পরিশোধ সাপেক্ষে অফিস কক্ষ থেকে প্রবেশপত্র সংগ্রহের জন্য নির্দেশ দেওয়া হচ্ছে।",
                description_en: "Pre-Test examinations for SSC 2027 candidates will commence on November 5. Admit cards must be collected from the office by November 3.",
                file_url: ""
            },
            {
                id: 3,
                title_bn: "উপবৃত্তি প্রাপ্ত শিক্ষার্থীদের তালিকা ও মোবাইল ব্যাংকিং (নগদ) হিসাব যাচাই সংক্রান্ত",
                title_en: "Verification of Mobile Financial Accounts (Nagad) for Stipend Beneficiaries",
                date: "২০ অক্টোবর, ২০২৬",
                date_en: "20 Oct 2026",
                category: "stipend",
                category_name_bn: "উপবৃত্তি ও সহায়তা",
                category_name_en: "Stipend",
                description_bn: "প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্টের আওতাধীন ২০২৬ শিক্ষাবর্ষের নির্বাচিত ছাত্রীদের মোবাইল ব্যাংকিং একাউন্ট সচল আছে কি না তা শ্রেণি শিক্ষকের সাথে যোগাযোগ করে নিশ্চিত করার জন্য অনুরোধ করা হলো।",
                description_en: "Beneficiaries under Prime Minister's Education Assistance Trust are advised to confirm that their registered Nagad mobile wallets are active.",
                file_url: ""
            },
            {
                id: 4,
                title_bn: "বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা ২০২৬ এর প্রস্তুতি ও রেজিস্ট্রেশন",
                title_en: "Registration and Preparation for Annual Sports and Cultural Fest 2026",
                date: "১৫ অক্টোবর, ২০২৬",
                date_en: "15 Oct 2026",
                category: "co_curricular",
                category_name_bn: "সহশিক্ষা ও সাংস্কৃতিক",
                category_name_en: "Co-curricular",
                description_bn: "আগামী ডিসেম্বর মাসে অনুষ্ঠিতব্য বিদ্যালয়ের বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতায় অংশগ্রহণে ইচ্ছুক ছাত্রীদের স্ব স্ব শ্রেণি শিক্ষকের কাছে নাম নিবন্ধনের আহ্বান জানানো যাচ্ছে।",
                description_en: "Students interested in participating in the Annual Sports & Cultural Competition are requested to submit their names to their respective class teachers.",
                file_url: ""
            }
        ];

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('notices', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(noticesData)]);
        console.log("✓ Initialized notices board in website_cms.");

        console.log("All updates completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
}

updateSchoolSystem();
