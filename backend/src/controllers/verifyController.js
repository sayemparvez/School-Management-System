const db = require("../config/db");
const { calculateBangladeshResult } = require("../utils/bangladeshGrading");

// =========================================================
// Public Marksheet Verification Controller
// Description: Unauthenticated endpoint for employers and
// institutions to verify a student's marksheet via QR code.
// =========================================================

exports.verifyMarksheet = async (req, res) => {
    try {
        const { marksheetId } = req.params;

        // 1. Parse the Marksheet ID (Format: MS-COURSE-SEM-ROLLNUMBER)
        const parts = marksheetId.split('-');

        if (parts.length !== 4 || parts[0] !== 'MS') {
            return res.status(400).json({
                isValid: false,
                message: "Invalid Marksheet ID format."
            });
        }

        const courseCode = parts[1];
        const sem = parts[2];
        const rollNumber = parts[3];

        // 2. Get School Info
        const adminResult = await db.query(
            `SELECT collagename FROM admin LIMIT 1`
        );

        const adminRows = adminResult.rows;
        const SchoolName = adminRows.length ? adminRows[0].collagename : "School";

        // 3. Fetch Student Data
        // Using your exact column names: Courcecode, semoryear
        const studentResult = await db.query(
            `SELECT firstname, lastname, rollnumber, profilepic, fathername, mothername 
             FROM students 
             WHERE rollnumber = $1 AND Courcecode = $2`,
            [rollNumber, courseCode]
        );

        const studentRows = studentResult.rows;

        if (!studentRows.length) {
            return res.status(404).json({
                isValid: false,
                message: "No student found matching this verification ID."
            });
        }

        const student = studentRows[0];

        // 3.5 Check if result has been officially approved & published
        const resultCheck = await db.query(
            "SELECT isdeclared FROM result WHERE courcecode = $1 AND semoryear = $2",
            [courseCode, sem]
        );
        if (!resultCheck.rows.length || Number(resultCheck.rows[0].isdeclared) !== 1) {
            return res.status(403).json({
                isValid: false,
                message: "এই পরীক্ষার ফলাফল এখনও প্রধান শিক্ষক বা অ্যাডমিন কর্তৃক অনুমোদন ও প্রকাশ করা হয়নি।"
            });
        }

        // 4. Fetch Student Marks
        const marksResult = await db.query(
            `SELECT 
                 m.subjectcode, 
                 m.subjectname,
                 sub.cq_max_marks,
                 sub.mcq_max_marks,
                 sub.theorymarks AS theoryfull, 
                 sub.practicalmarks AS practicalfull, 
                 COALESCE(m.cq_marks, 0) AS cq_marks,
                 COALESCE(m.mcq_marks, 0) AS mcq_marks,
                 m.theorymarks, 
                 m.practicalmarks, 
                 sub.subjecttype
             FROM marks m
             JOIN subject sub 
               ON sub.subjectcode = m.subjectcode
               AND sub.courcecode = m.courcecode
               AND sub.semoryear = m.semoryear
             WHERE m.courcecode = $1 AND m.semoryear = $2 AND m.rollnumber = $3
             ORDER BY m.subjectcode`,
            [courseCode, sem, rollNumber]
        );

        const marksRows = marksResult.rows;

        if (!marksRows.length) {
            return res.status(404).json({
                isValid: false,
                message: "Marksheet data not found for this examination."
            });
        }

        // 5. Bangladesh NCTB Grading Logic
        const { processedRows, summary } = calculateBangladeshResult(marksRows);

        const processedMarks = processedRows.map(r => ({
            subjectcode: r.subjectcode,
            subjectname: r.subjectname,
            type: r.subjecttype,
            cq: {
                obtained: r.cq_marks,
                max: Number(r.cq_max_marks) || 0
            },
            mcq: {
                obtained: r.mcq_marks,
                max: Number(r.mcq_max_marks) || 0
            },
            theory: {
                obtained: r.theorymarks,
                max: Number(r.theoryfull) || 0
            },
            practical: {
                obtained: r.practicalmarks,
                max: Number(r.practicalfull) || 0
            },
            total: {
                obtained: r.totalmarks,
                max: r.maxmarks
            },
            grade: r.grade,
            gradePoint: r.gradepoint,
            status: (r.grade !== "F") ? "PASS" : "FAIL"
        }));

        // Exam Title
        const isClass10 = String(courseCode).toUpperCase().includes("10");
        const termNum = Number(sem);
        const examName = isClass10
            ? (termNum === 1 ? "Pre-Test Examination" : "Test Examination")
            : (termNum === 1 ? "Half Yearly Examination" : "Final Examination");

        // 8. Send Verification Payload
        res.json({
            isValid: true,
            verificationId: marksheetId,
            SchoolName,
            examName,
            student: {
                rollnumber: student.rollnumber,
                name: `${student.firstname} ${student.lastname}`.trim(),
                fathername: student.fathername || "",
                mothername: student.mothername || "",
                profilepic: student.profilepic || "default.png"
            },
            academic: {
                courseCode,
                semester: sem
            },
            performance: {
                marks: processedMarks,
                summary
            }
        });

    } catch (error) {
        console.error("Marksheet Verification Error:", error);

        res.status(500).json({
            isValid: false,
            message: "Internal server error during verification."
        });
    }
};