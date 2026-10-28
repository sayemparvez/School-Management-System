const db = require("../config/db");

/*
  Course / Class Controller (শ্রেণি ও শিক্ষাবর্ষ)
  -----------------------------------------------
*/

// ============================
// Create Course / Class
// ============================
exports.createCourse = async (req, res) => {
    const { course_code, course_name, academic_year, total_semesters, sem_or_year } = req.body;

    if (!course_code || !course_name) {
        return res.status(400).json({ message: "শ্রেণি কোড এবং শ্রেণির নাম আবশ্যক।" });
    }

    const finalYear = String(academic_year || "2026").trim();
    const finalTotal = Number(total_semesters) || 2;
    const finalType = sem_or_year || "sem";

    try {
        await db.query(
            `INSERT INTO courses (course_code, course_name, sem_or_year, total_semesters, academic_year) 
             VALUES ($1, $2, $3, $4, $5)`,
            [
                course_code.trim().toUpperCase(),
                course_name.trim(),
                finalType,
                finalTotal,
                finalYear
            ]
        );

        res.status(201).json({ message: "শ্রেণি সফলভাবে যুক্ত করা হয়েছে।" });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                message: "এই শ্রেণি কোড বা শ্রেণির নাম ইতিমধ্যে বিদ্যমান।"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Error creating class" });
    }
};


// ============================
// Get All Courses / Classes (WITH COUNTS)
// ============================
exports.getCourses = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.id,
                c.course_code,
                c.course_name,
                c.total_semesters,
                c.sem_or_year,
                COALESCE(c.academic_year, '2026') AS academic_year,
                (SELECT COUNT(*) FROM subject s WHERE LOWER(s.courcecode) = LOWER(c.course_code)) AS subject_count,
                (SELECT COUNT(*) FROM students st WHERE LOWER(st.courcecode) = LOWER(c.course_code)) AS student_count
            FROM courses c
            ORDER BY c.course_code ASC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching classes" });
    }
};


// ============================
// Update Course / Class
// ============================
exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { course_code, course_name, academic_year, total_semesters, sem_or_year } = req.body;

    if (!course_code || !course_name) {
        return res.status(400).json({ message: "শ্রেণি কোড এবং শ্রেণির নাম আবশ্যক।" });
    }

    const finalYear = String(academic_year || "2026").trim();
    const finalTotal = Number(total_semesters) || 2;
    const finalType = sem_or_year || "sem";

    try {
        const result = await db.query(
            `UPDATE courses 
             SET course_code = $1, course_name = $2, sem_or_year = $3, total_semesters = $4, academic_year = $5 
             WHERE id = $6`,
            [
                course_code.trim().toUpperCase(),
                course_name.trim(),
                finalType,
                finalTotal,
                finalYear,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.json({ message: "শ্রেণি সফলভাবে আপডেট করা হয়েছে।" });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                message: "এই শ্রেণি কোড বা শ্রেণির নাম ইতিমধ্যে বিদ্যমান।"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Error updating class" });
    }
};


// ============================
// Delete Course / Class
// ============================
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM courses WHERE id = $1 RETURNING course_code",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.json({ message: "শ্রেণি সফলভাবে মুছে ফেলা হয়েছে।" });

    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                message: "এই শ্রেণির সাথে যুক্ত বিষয়, শিক্ষক বা শিক্ষার্থী বিদ্যমান থাকায় মুছে ফেলা সম্ভব নয়।"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Error deleting class" });
    }
};
