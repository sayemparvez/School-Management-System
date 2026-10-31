const db = require("../config/db");

// In-memory micro-cache (15 seconds TTL) to ensure instant responses on repeat navigations
let cachedStats = null;
let lastCachedAt = 0;
const CACHE_TTL_MS = 15000;

exports.getDashboardStats = async (req, res) => {
    try {
        const now = Date.now();
        if (cachedStats && (now - lastCachedAt < CACHE_TTL_MS)) {
            return res.json(cachedStats);
        }

        // Execute all 10 analytical queries concurrently in parallel with Promise.all
        // This eliminates 10 sequential round-trips to cloud database and speeds up loading by 10x!
        const [
            studentResult,
            alumniResult,
            facultyResult,
            courseResult,
            subjectResult,
            feeResult,
            scholarshipResult,
            classBreakdownResult,
            recentFeeResult,
            attResult
        ] = await Promise.all([
            // 1. Active Students (excluding alumni)
            db.query("SELECT COUNT(*) AS total_students FROM students WHERE is_alumni = false OR is_alumni IS NULL"),

            // 2. Alumni Students
            db.query("SELECT COUNT(*) AS total_alumni FROM students WHERE is_alumni = true"),

            // 3. Faculty
            db.query("SELECT COUNT(*) AS total_faculty FROM faculties"),

            // 4. Classes / Courses
            db.query("SELECT COUNT(*) AS total_courses FROM courses"),

            // 5. Subjects count
            db.query("SELECT COUNT(DISTINCT subjectcode) AS total_subjects FROM subject"),

            // 6. Total fee collected
            db.query("SELECT COALESCE(SUM(amount_paid), 0) AS total_collected FROM fee_collections"),

            // 7. Scholarship distribution
            db.query(`
                SELECT 
                    COUNT(*) FILTER (WHERE scholarship_type = 'britti') AS britti_count,
                    COUNT(*) FILTER (WHERE scholarship_type = 'upobritti') AS upobritti_count,
                    COUNT(*) FILTER (WHERE scholarship_type = 'none' OR scholarship_type IS NULL) AS regular_count
                FROM students
                WHERE is_alumni = false OR is_alumni IS NULL
            `),

            // 8. Class breakdown with student count
            db.query(`
                SELECT c.course_code, c.course_name, COUNT(s.sr_no) AS student_count
                FROM courses c
                LEFT JOIN students s ON c.course_code = s.courcecode AND (s.is_alumni = false OR s.is_alumni IS NULL)
                GROUP BY c.course_code, c.course_name
                ORDER BY c.course_code ASC
            `),

            // 9. Recent 5 fee collections
            db.query(`
                SELECT receipt_no, student_rollnumber, student_name, course_code, 
                       fee_name, amount_paid, payment_date, collected_by_name
                FROM fee_collections
                ORDER BY id DESC
                LIMIT 5
            `),

            // 10. Today's attendance summary
            db.query(`
                SELECT 
                    COUNT(*) AS total_records,
                    COUNT(*) FILTER (WHERE present = 1) AS present_count
                FROM attendance
                WHERE attendance_date::date = CURRENT_DATE
            `)
        ]);

        const responsePayload = {
            total_students: Number(studentResult.rows[0]?.total_students || 0),
            total_alumni: Number(alumniResult.rows[0]?.total_alumni || 0),
            total_faculty: Number(facultyResult.rows[0]?.total_faculty || 0),
            total_courses: Number(courseResult.rows[0]?.total_courses || 0),
            total_subjects: Number(subjectResult.rows[0]?.total_subjects || 0),
            total_collected: Number(feeResult.rows[0]?.total_collected || 0),
            scholarships: scholarshipResult.rows[0] || { britti_count: 0, upobritti_count: 0, regular_count: 0 },
            class_breakdown: classBreakdownResult.rows || [],
            recent_transactions: recentFeeResult.rows || [],
            today_attendance: {
                total: Number(attResult.rows[0]?.total_records || 0),
                present: Number(attResult.rows[0]?.present_count || 0)
            }
        };

        cachedStats = responsePayload;
        lastCachedAt = Date.now();

        res.json(responsePayload);

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
