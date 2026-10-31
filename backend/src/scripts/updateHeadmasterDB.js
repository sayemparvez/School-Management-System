const pool = require("../config/db");

async function updateHeadmaster() {
    try {
        const headmasterData = {
            name_bn: "আবু জাফর মোঃ মোতাসিম বিল্লাহ্",
            name_en: "Abu Jafor Md. Motasim Billah",
            designation_bn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)",
            designation_en: "Head Teacher (Acting)",
            image_url: "/headmaster.png",
            message_bn: "বিসমিল্লাহির রাহমানির রাহিম। ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়ের ডিজিটাল পোর্টালে সবাইকে আন্তরিক শুভেচ্ছা। ১৯৬৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের নারী শিক্ষার এক অনন্য বাতিঘর। নৈতিকতা, শৃঙ্খলা ও আধুনিক জ্ঞানসমৃদ্ধ পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে আত্মনির্ভরশীল ও আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের ব্রত। বর্তমান তথ্যপ্রযুক্তির যুগে আমাদের ছাত্রীরা যেন আধুনিক বিশ্বের সাথে তাল মিলিয়ে এগিয়ে যেতে পারে, সেজন্য আমরা সার্বক্ষণিক সচেষ্ট। অভিভাবক ও শুভানুধ্যায়ীদের সহযোগিতায় এই বিদ্যাপীঠ তার গৌরবের ধারা অব্যাহত রাখবে—এটাই আমাদের প্রত্যাশা।",
            message_en: "Bismillahir Rahmanir Rahim. Welcome to the official digital portal of Dimla Government Girls' High School. Established in 1967, this prestigious institution is a beacon of female empowerment, discipline, and modern education in this region. We strive to nurture every girl child into an enlightened, ethical, and self-reliant citizen ready for the 21st century."
        };

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ('headmaster', $1, NOW())
            ON CONFLICT (section)
            DO UPDATE SET data = $1, updated_at = NOW();
        `, [JSON.stringify(headmasterData)]);

        console.log("✓ Headmaster updated successfully in website_cms!");
    } catch (e) {
        console.error("Error updating headmaster:", e);
    } finally {
        pool.end();
    }
}

updateHeadmaster();
