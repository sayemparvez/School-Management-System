const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
    try {
        // Active Students (excluding alumni)
        const studentResult = await db.query(
            "SELECT COUNT(*) AS total_students FROM students WHERE is_alumni = false OR is_alumni IS NULL"
        );

        // Alumni Students
        const alumniResult = await db.query(
            "SELECT COUNT(*) AS total_alumni FROM students WHERE is_alumni = true"
        );

        // Faculty
        const facultyResult = await db.query(
            "SELECT COUNT(*) AS total_faculty FROM faculties"
        );

        // Classes / Courses
        const courseResult = await db.query(
            "SELECT COUNT(*) AS total_courses FROM courses"
        );

        // Subjects count
        const subjectResult = await db.query(
            "SELECT COUNT(DISTINCT subjectcode) AS total_subjects FROM subject"
        );

        // Total fee collected in academic year 2026
        const feeResult = await db.query(
            "SELECT COALESCE(SUM(amount_paid), 0) AS total_collected FROM fee_collections"
        );

        // Scholarship distribution
        const scholarshipResult = await db.query(`
            SELECT 
                COUNT(*) FILTER (WHERE scholarship_type = 'britti') AS britti_count,
                COUNT(*) FILTER (WHERE scholarship_type = 'upobritti') AS upobritti_count,
                COUNT(*) FILTER (WHERE scholarship_type = 'none' OR scholarship_type IS NULL) AS regular_count
            FROM students
            WHERE is_alumni = false OR is_alumni IS NULL
        `);

        // Class breakdown with student count
        const classBreakdownResult = await db.query(`
            SELECT c.course_code, c.course_name, COUNT(s.sr_no) AS student_count
            FROM courses c
            LEFT JOIN students s ON c.course_code = s.courcecode AND (s.is_alumni = false OR s.is_alumni IS NULL)
            GROUP BY c.course_code, c.course_name
            ORDER BY c.course_code ASC
        `);

        // Recent 5 fee collections
        const recentFeeResult = await db.query(`
            SELECT receipt_no, student_rollnumber, student_name, course_code, 
                   fee_name, amount_paid, payment_date, collected_by_name
            FROM fee_collections
            ORDER BY id DESC
            LIMIT 5
        `);

        // Today's attendance summary
        const attResult = await db.query(`
            SELECT 
                COUNT(*) AS total_records,
                COUNT(*) FILTER (WHERE present = 1) AS present_count
            FROM attendance
            WHERE attendance_date::date = CURRENT_DATE
        `);

        res.json({
            total_students: Number(studentResult.rows[0].total_students || 0),
            total_alumni: Number(alumniResult.rows[0].total_alumni || 0),
            total_faculty: Number(facultyResult.rows[0].total_faculty || 0),
            total_courses: Number(courseResult.rows[0].total_courses || 0),
            total_subjects: Number(subjectResult.rows[0].total_subjects || 0),
            total_collected: Number(feeResult.rows[0].total_collected || 0),
            scholarships: scholarshipResult.rows[0],
            class_breakdown: classBreakdownResult.rows,
            recent_transactions: recentFeeResult.rows,
            today_attendance: {
                total: Number(attResult.rows[0]?.total_records || 0),
                present: Number(attResult.rows[0]?.present_count || 0)
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
