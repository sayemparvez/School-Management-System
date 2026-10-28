const db = require("../config/db");

// Helper: Check if user is Head Teacher or Admin
const isHeadTeacherOrAdmin = async (user) => {
    if (!user) return false;
    const role = (user.role || "").toLowerCase();
    if (role === "admin") return true;
    if (role === "faculty") {
        const res = await db.query(
            "SELECT position FROM faculties WHERE emailid = $1",
            [user.email]
        );
        if (res.rows.length > 0) {
            const pos = String(res.rows[0].position || "").toLowerCase();
            return pos.includes("head") || pos.includes("principal") || pos.includes("ভারপ্রাপ্ত");
        }
    }
    return false;
};

// Helper: Check if user is Class Teacher of the specified class (or Headmaster/Admin)
const canManageClassFee = async (user, courseCode, academicYear = "2026") => {
    if (!user) return { allowed: false, role: "none" };
    if (await isHeadTeacherOrAdmin(user)) {
        return { allowed: true, role: user.role === "admin" ? "Admin" : "Headmaster" };
    }

    if (user.role === "faculty") {
        // Check if assigned in class_teachers table
        const ctRes = await db.query(
            `SELECT id, faculty_name FROM class_teachers 
             WHERE course_code = $1 AND academic_year = $2 AND faculty_email = $3`,
            [courseCode, academicYear, user.email]
        );
        if (ctRes.rows.length > 0) {
            return { allowed: true, role: "Class Teacher", teacherName: ctRes.rows[0].faculty_name };
        }
    }

    return { allowed: false, role: "none" };
};

// ==========================================
// 1. CLASS TEACHER APPOINTMENT & DIRECTORY
// ==========================================

// GET /api/fees/class-teachers
exports.getClassTeachers = async (req, res) => {
    try {
        const academicYear = req.query.academic_year || "2026";
        
        // Fetch all courses
        const coursesRes = await db.query("SELECT course_code, course_name FROM courses ORDER BY course_code");
        
        // Fetch appointed class teachers
        const ctRes = await db.query(
            `SELECT ct.id, ct.course_code, ct.academic_year, ct.faculty_id, ct.faculty_email, 
                    ct.faculty_name, ct.assigned_by, ct.assigned_at,
                    f.position, f.contactnumber
             FROM class_teachers ct
             LEFT JOIN faculties f ON ct.faculty_id = f.sr_no OR ct.faculty_email = f.emailid
             WHERE ct.academic_year = $1`,
            [academicYear]
        );

        const ctMap = new Map();
        ctRes.rows.forEach(r => ctMap.set(r.course_code, r));

        const result = coursesRes.rows.map(c => {
            const ct = ctMap.get(c.course_code);
            return {
                course_code: c.course_code,
                course_name: c.course_name,
                academic_year: academicYear,
                has_class_teacher: !!ct,
                class_teacher: ct ? {
                    id: ct.id,
                    faculty_id: ct.faculty_id,
                    name: ct.faculty_name,
                    email: ct.faculty_email,
                    position: ct.position,
                    phone: ct.contactnumber,
                    assigned_by: ct.assigned_by,
                    assigned_at: ct.assigned_at
                } : null
            };
        });

        // Current user permission info
        const isHeadOrAdmin = await isHeadTeacherOrAdmin(req.user);
        
        // Find which classes the logged-in user is Class Teacher for
        let myClassTeacherOf = [];
        if (req.user?.role === "faculty") {
            const myClasses = ctRes.rows.filter(r => r.faculty_email === req.user.email);
            myClassTeacherOf = myClasses.map(r => r.course_code);
        }

        res.json({
            academic_year: academicYear,
            isHeadOrAdmin,
            myClassTeacherOf,
            classes: result
        });
    } catch (err) {
        console.error("Error in getClassTeachers:", err);
        res.status(500).json({ message: "শ্রেণি শিক্ষক তালিকা লোড করতে ব্যর্থ হয়েছে।" });
    }
};

// POST /api/fees/class-teachers/assign (Only Admin and Headmaster can assign)
exports.assignClassTeacher = async (req, res) => {
    try {
        const isAuthorized = await isHeadTeacherOrAdmin(req.user);
        if (!isAuthorized) {
            return res.status(403).json({
                message: "অনুমতি অস্বীকৃত! শুধুমাত্র প্রধান শিক্ষক (Headmaster) এবং অ্যাডমিন শ্রেণি শিক্ষক নিয়োগ বা পরিবর্তন করতে পারবেন।"
            });
        }

        const { course_code, academic_year = "2026", faculty_id } = req.body;
        if (!course_code) {
            return res.status(400).json({ message: "শ্রেণি নির্বাচন করুন।" });
        }

        if (!faculty_id) {
            // Remove assignment
            await db.query(
                "DELETE FROM class_teachers WHERE course_code = $1 AND academic_year = $2",
                [course_code, academic_year]
            );
            return res.json({ message: "শ্রেণি শিক্ষক নিয়োগ প্রত্যাহার করা হয়েছে।" });
        }

        // Get faculty details
        const fRes = await db.query(
            "SELECT sr_no, facultyname, emailid, position FROM faculties WHERE sr_no = $1",
            [faculty_id]
        );
        if (!fRes.rows.length) {
            return res.status(404).json({ message: "শিক্ষক খুঁজে পাওয়া যায়নি।" });
        }
        const faculty = fRes.rows[0];

        let assignerName = "Admin";
        if (req.user?.role === "faculty") {
            const assignerRes = await db.query("SELECT facultyname, position FROM faculties WHERE emailid = $1", [req.user.email]);
            assignerName = assignerRes.rows[0]?.facultyname || "প্রধান শিক্ষক";
        }

        // Upsert into class_teachers
        await db.query(`
            INSERT INTO class_teachers (course_code, academic_year, faculty_id, faculty_email, faculty_name, assigned_by, assigned_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            ON CONFLICT (course_code, academic_year)
            DO UPDATE SET 
                faculty_id = EXCLUDED.faculty_id,
                faculty_email = EXCLUDED.faculty_email,
                faculty_name = EXCLUDED.faculty_name,
                assigned_by = EXCLUDED.assigned_by,
                assigned_at = NOW()
        `, [course_code, academic_year, faculty.sr_no, faculty.emailid, faculty.facultyname, assignerName]);

        res.json({
            message: `${faculty.facultyname}-কে ${course_code} শ্রেণির শ্রেণি শিক্ষক হিসেবে সফলভাবে নিয়োগ দেওয়া হয়েছে!`
        });
    } catch (err) {
        console.error("Error in assignClassTeacher:", err);
        res.status(500).json({ message: "শ্রেণি শিক্ষক নিয়োগ ব্যর্থ হয়েছে।" });
    }
};

// ==========================================
// 2. FEE STRUCTURE (Admin / Headmaster)
// ==========================================

// GET /api/fees/structure?course_code=CLASS-6&academic_year=2026
exports.getFeeStructure = async (req, res) => {
    try {
        const { course_code, academic_year = "2026" } = req.query;
        if (!course_code) {
            return res.status(400).json({ message: "শ্রেণি নির্বাচন করুন।" });
        }

        const resData = await db.query(
            `SELECT id, course_code, academic_year, fee_type, fee_name, amount, applies_to, is_active
             FROM fee_structure
             WHERE course_code = $1 AND academic_year = $2
             ORDER BY id ASC`,
            [course_code, academic_year]
        );

        const isHeadOrAdmin = await isHeadTeacherOrAdmin(req.user);

        res.json({
            course_code,
            academic_year,
            isHeadOrAdmin,
            fees: resData.rows
        });
    } catch (err) {
        console.error("Error in getFeeStructure:", err);
        res.status(500).json({ message: "ফি কাঠামো লোড করতে ব্যর্থ হয়েছে।" });
    }
};

// POST /api/fees/structure (Update / save fee structure for class)
exports.saveFeeStructure = async (req, res) => {
    try {
        const isAuthorized = await isHeadTeacherOrAdmin(req.user);
        if (!isAuthorized) {
            return res.status(403).json({
                message: "শুধুমাত্র প্রধান শিক্ষক এবং অ্যাডমিন ফি কাঠামো তৈরি বা পরিবর্তন করতে পারবেন।"
            });
        }

        const { course_code, academic_year = "2026", items } = req.body;
        if (!course_code || !Array.isArray(items)) {
            return res.status(400).json({ message: "সঠিক তথ্য প্রদান করুন।" });
        }

        for (const item of items) {
            if (item.fee_type && item.fee_name) {
                await db.query(`
                    INSERT INTO fee_structure (course_code, academic_year, fee_type, fee_name, amount, applies_to, is_active)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (course_code, academic_year, fee_type)
                    DO UPDATE SET
                        fee_name = EXCLUDED.fee_name,
                        amount = EXCLUDED.amount,
                        applies_to = EXCLUDED.applies_to,
                        is_active = EXCLUDED.is_active
                `, [
                    course_code,
                    academic_year,
                    item.fee_type,
                    item.fee_name,
                    Number(item.amount) || 0,
                    item.applies_to || 'all',
                    item.is_active !== false
                ]);
            }
        }

        res.json({ message: "ফি কাঠামো সফলভাবে সংরক্ষণ করা হয়েছে!" });
    } catch (err) {
        console.error("Error in saveFeeStructure:", err);
        res.status(500).json({ message: "ফি কাঠামো সংরক্ষণ ব্যর্থ হয়েছে।" });
    }
};

// ==========================================
// 3. STUDENT SCHOLARSHIP STATUS
// ==========================================

// PUT /api/fees/students/:rollnumber/scholarship
exports.updateStudentScholarship = async (req, res) => {
    try {
        const { rollnumber } = req.params;
        const { scholarship_type } = req.body; // 'none', 'britti', 'upobritti'

        const validTypes = ['none', 'britti', 'upobritti'];
        if (!validTypes.includes(scholarship_type)) {
            return res.status(400).json({ message: "সঠিক বৃত্তির ধরন নির্বাচন করুন (none, britti, upobritti)।" });
        }

        await db.query(
            "UPDATE students SET scholarship_type = $1 WHERE rollnumber = $2",
            [scholarship_type, rollnumber]
        );

        let label = "সাধারণ (কোনো বৃত্তি নেই)";
        if (scholarship_type === "britti") label = "মেধা বৃত্তিপ্রাপ্ত (Britti)";
        if (scholarship_type === "upobritti") label = "সরকারি উপবৃত্তিপ্রাপ্ত (Upobritti)";

        res.json({ message: `শিক্ষার্থীর বৃত্তির ধরন হালনাগাদ করা হয়েছে: ${label}` });
    } catch (err) {
        console.error("Error in updateStudentScholarship:", err);
        res.status(500).json({ message: "বৃত্তির তথ্য হালনাগাদ ব্যর্থ হয়েছে।" });
    }
};

// ==========================================
// 4. FEE COLLECTION & STUDENTS STATUS
// ==========================================

// GET /api/fees/students?course_code=CLASS-6&academic_year=2026&fee_type=monthly_tuition&month_number=1
exports.getStudentsWithFeeStatus = async (req, res) => {
    try {
        const { 
            course_code, 
            academic_year = "2026", 
            fee_type = "monthly_tuition", 
            month_number = (new Date().getMonth() + 1) 
        } = req.query;

        if (!course_code) {
            return res.status(400).json({ message: "শ্রেণি নির্বাচন করুন।" });
        }

        // Check permission (Admin, Headmaster, or Class Teacher of this class)
        const perm = await canManageClassFee(req.user, course_code, academic_year);

        // Fetch all active fee items for this class
        const allStructureRes = await db.query(
            `SELECT fee_type, fee_name, amount, applies_to 
             FROM fee_structure 
             WHERE course_code = $1 AND academic_year = $2 AND is_active = true
             ORDER BY id ASC`,
            [course_code, academic_year]
        );

        // Fetch selected fee structure item
        const structRes = await db.query(
            `SELECT fee_type, fee_name, amount, applies_to 
             FROM fee_structure 
             WHERE course_code = $1 AND academic_year = $2 AND fee_type = $3`,
            [course_code, academic_year, fee_type]
        );

        const feeItem = structRes.rows[0] || {
            fee_type,
            fee_name: fee_type === "monthly_tuition" ? "মাসিক বেতন" : fee_type,
            amount: 200,
            applies_to: fee_type === "monthly_tuition" ? "non_scholarship" : "all"
        };

        // Fetch all students in this class
        const studentsRes = await db.query(
            `SELECT rollnumber, firstname, lastname, contactnumber, COALESCE(scholarship_type, 'none') AS scholarship_type
             FROM students
             WHERE courcecode = $1
             ORDER BY rollnumber ASC`,
            [course_code]
        );

        // Fetch payments for this fee type and month/year
        const paymentsRes = await db.query(
            `SELECT receipt_no, student_rollnumber, amount_due, amount_paid, payment_date, 
                    payment_method, collected_by_name, collected_by_role, notes
             FROM fee_collections
             WHERE course_code = $1 AND academic_year = $2 AND fee_type = $3
               AND ($4::int IS NULL OR month_number = $4::int)`,
            [course_code, academic_year, fee_type, fee_type === 'monthly_tuition' ? Number(month_number) : null]
        );

        const paymentMap = new Map();
        paymentsRes.rows.forEach(p => paymentMap.set(String(p.student_rollnumber), p));

        const baseAmount = Number(feeItem.amount) || 0;
        const isMonthly = fee_type === "monthly_tuition";

        let totalPayableSum = 0;
        let totalCollectedSum = 0;
        let paidCount = 0;
        let waivedCount = 0;
        let pendingCount = 0;

        const students = studentsRes.rows.map(st => {
            const isScholarship = st.scholarship_type === "britti" || st.scholarship_type === "upobritti";
            const isWaived = isMonthly && isScholarship; // Monthly tuition is WAIVED for scholarship/stipend students!

            const amountDue = isWaived ? 0 : baseAmount;
            const payment = paymentMap.get(String(st.rollnumber));
            const isPaid = isWaived ? true : !!payment;

            if (isWaived) {
                waivedCount++;
            } else if (isPaid) {
                paidCount++;
                totalCollectedSum += Number(payment.amount_paid);
                totalPayableSum += amountDue;
            } else {
                pendingCount++;
                totalPayableSum += amountDue;
            }

            return {
                rollnumber: st.rollnumber,
                name: `${st.firstname || ""} ${st.lastname || ""}`.trim(),
                contactnumber: st.contactnumber,
                scholarship_type: st.scholarship_type,
                is_scholarship: isScholarship,
                is_waived: isWaived,
                waiver_reason: isWaived ? (st.scholarship_type === "britti" ? "মেধা বৃত্তিপ্রাপ্ত (মওকুফ)" : "উপবৃত্তিপ্রাপ্ত (মওকুফ)") : null,
                amount_due: amountDue,
                is_paid: isPaid,
                payment: payment ? {
                    receipt_no: payment.receipt_no,
                    amount_paid: Number(payment.amount_paid),
                    payment_date: payment.payment_date,
                    payment_method: payment.payment_method,
                    collected_by_name: payment.collected_by_name,
                    collected_by_role: payment.collected_by_role,
                    notes: payment.notes
                } : null
            };
        });

        // Appointed Class Teacher info
        const ctRes = await db.query(
            "SELECT faculty_name, faculty_email FROM class_teachers WHERE course_code = $1 AND academic_year = $2",
            [course_code, academic_year]
        );
        const appointedTeacher = ctRes.rows[0] || null;

        res.json({
            course_code,
            academic_year,
            fee_item: feeItem,
            all_fee_items: allStructureRes.rows,
            month_number: Number(month_number),
            user_permission: perm,
            appointed_class_teacher: appointedTeacher,
            stats: {
                total_students: students.length,
                paid_count: paidCount,
                waived_count: waivedCount,
                pending_count: pendingCount,
                total_payable: totalPayableSum,
                total_collected: totalCollectedSum,
                total_due: totalPayableSum - totalCollectedSum
            },
            students
        });
    } catch (err) {
        console.error("Error in getStudentsWithFeeStatus:", err);
        res.status(500).json({ message: "শিক্ষার্থীদের ফি বিবরণী লোড ব্যর্থ হয়েছে।" });
    }
};

// POST /api/fees/collect (Record payment)
exports.collectFee = async (req, res) => {
    try {
        const {
            student_rollnumber,
            course_code,
            academic_year = "2026",
            fee_type,
            month_number,
            month_name,
            amount_paid,
            payment_method = "cash",
            notes = ""
        } = req.body;

        if (!student_rollnumber || !course_code || !fee_type) {
            return res.status(400).json({ message: "প্রয়োজনীয় সকল তথ্য প্রদান করুন।" });
        }

        // Permission check: Must be Admin, Headmaster, or appointed Class Teacher of this class!
        const perm = await canManageClassFee(req.user, course_code, academic_year);
        if (!perm.allowed) {
            return res.status(403).json({
                message: "অনুমতি অস্বীকৃত! বিদ্যালয়ের নিয়ম অনুযায়ী শুধুমাত্র এই শ্রেণির শ্রেণি শিক্ষক, প্রধান শিক্ষক এবং অ্যাডমিন ফি গ্রহণ করতে পারবেন।"
            });
        }

        // Get student details
        const stRes = await db.query(
            "SELECT rollnumber, firstname, lastname, scholarship_type FROM students WHERE rollnumber = $1",
            [student_rollnumber]
        );
        if (!stRes.rows.length) {
            return res.status(404).json({ message: "শিক্ষার্থী খুঁজে পাওয়া যায়নি।" });
        }
        const student = stRes.rows[0];
        const studentName = `${student.firstname || ""} ${student.lastname || ""}`.trim();

        // Check if student has scholarship & fee is monthly
        const isScholarship = student.scholarship_type === "britti" || student.scholarship_type === "upobritti";
        if (fee_type === "monthly_tuition" && isScholarship) {
            return res.status(400).json({
                message: "এই শিক্ষার্থী বৃত্তি/উপবৃত্তি প্রাপ্ত। নিয়ম অনুযায়ী তাকে মাসিক বেতন দিতে হবে না।"
            });
        }

        // Get fee structure item
        const structRes = await db.query(
            "SELECT fee_name, amount FROM fee_structure WHERE course_code = $1 AND academic_year = $2 AND fee_type = $3",
            [course_code, academic_year, fee_type]
        );
        const feeName = structRes.rows[0]?.fee_name || (fee_type === "monthly_tuition" ? "মাসিক বেতন" : fee_type);
        const amountDue = Number(structRes.rows[0]?.amount) || Number(amount_paid) || 0;
        const paid = Number(amount_paid) || amountDue;

        // Determine collector details
        let collectorName = "অ্যাডমিন";
        let collectorRole = perm.role;
        let collectorEmail = req.user.email;

        if (req.user?.role === "faculty") {
            const facRes = await db.query("SELECT facultyname, position FROM faculties WHERE emailid = $1", [req.user.email]);
            if (facRes.rows.length > 0) {
                collectorName = facRes.rows[0].facultyname;
            }
        }

        // Generate receipt number (e.g. REC-2026-601-8492)
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const receiptNo = `REC-${academicYear}-${student_rollnumber}-${randNum}`;

        // Insert into fee_collections
        const insertRes = await db.query(`
            INSERT INTO fee_collections (
                receipt_no, student_rollnumber, student_name, course_code, academic_year,
                fee_type, fee_name, month_name, month_number, amount_due, amount_paid,
                discount_waiver, payment_date, payment_method, collected_by_name,
                collected_by_role, collected_by_email, notes
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11,
                0, CURRENT_DATE, $12, $13,
                $14, $15, $16
            ) RETURNING *
        `, [
            receiptNo,
            student_rollnumber,
            studentName,
            course_code,
            academic_year,
            fee_type,
            feeName,
            month_name || null,
            month_number ? Number(month_number) : null,
            amountDue,
            paid,
            payment_method,
            collectorName,
            collectorRole,
            collectorEmail,
            notes
        ]);

        res.json({
            message: `রোল ${student_rollnumber} (${studentName})-এর ফি সফলভাবে আদায় করা হয়েছে!`,
            receipt: insertRes.rows[0]
        });
    } catch (err) {
        console.error("Error in collectFee:", err);
        res.status(500).json({ message: "ফি গ্রহণ সম্পন্ন করা যায়নি।" });
    }
};

// POST /api/fees/collect-multi (Collect multiple fee heads for a single student under 1 receipt)
exports.collectMultiFee = async (req, res) => {
    try {
        const {
            student_rollnumber,
            course_code,
            academic_year = "2026",
            fee_items, // Array of { fee_type, fee_name, amount_paid, amount_due, month_number, month_name, discount_waiver }
            payment_method = "cash",
            payment_date,
            notes = ""
        } = req.body;

        if (!student_rollnumber || !course_code || !Array.isArray(fee_items) || fee_items.length === 0) {
            return res.status(400).json({ message: "শিক্ষার্থী এবং অন্তত একটি ফি খাত নির্বাচন করুন।" });
        }

        const perm = await canManageClassFee(req.user, course_code, academic_year);
        if (!perm.allowed) {
            return res.status(403).json({
                message: "অনুমতি অস্বীকৃত! বিদ্যালয়ের নিয়ম অনুযায়ী শুধুমাত্র এই শ্রেণির শ্রেণি শিক্ষক, প্রধান শিক্ষক এবং অ্যাডমিন ফি গ্রহণ করতে পারবেন।"
            });
        }

        const stRes = await db.query(
            "SELECT rollnumber, firstname, lastname, scholarship_type FROM students WHERE rollnumber = $1",
            [student_rollnumber]
        );
        if (!stRes.rows.length) {
            return res.status(404).json({ message: "শিক্ষার্থী খুঁজে পাওয়া যায়নি।" });
        }
        const student = stRes.rows[0];
        const studentName = `${student.firstname || ""} ${student.lastname || ""}`.trim();
        const isScholarship = student.scholarship_type === "britti" || student.scholarship_type === "upobritti";

        let collectorName = "অ্যাডমিন";
        let collectorRole = perm.role;
        let collectorEmail = req.user.email;
        if (req.user?.role === "faculty") {
            const facRes = await db.query("SELECT facultyname, position FROM faculties WHERE emailid = $1", [req.user.email]);
            if (facRes.rows.length > 0) {
                collectorName = facRes.rows[0].facultyname;
            }
        }

        const randNum = Math.floor(1000 + Math.random() * 9000);
        const receiptNo = `REC-${academic_year}-${student_rollnumber}-${randNum}`;
        const payDate = payment_date || new Date().toISOString().split("T")[0];

        let totalAmountPaid = 0;
        const insertedRows = [];

        for (const item of fee_items) {
            let itemPaid = Number(item.amount_paid) || 0;
            let itemDue = Number(item.amount_due) || itemPaid;
            let waiver = Number(item.discount_waiver) || 0;

            if (item.fee_type === "monthly_tuition" && isScholarship) {
                itemPaid = 0;
                itemDue = 0;
                waiver = Number(item.amount_due) || 0;
            }

            totalAmountPaid += itemPaid;

            const r = await db.query(`
                INSERT INTO fee_collections (
                    receipt_no, student_rollnumber, student_name, course_code, academic_year,
                    fee_type, fee_name, month_name, month_number, amount_due, amount_paid,
                    discount_waiver, payment_date, payment_method, collected_by_name,
                    collected_by_role, collected_by_email, notes
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10, $11,
                    $12, $13, $14, $15,
                    $16, $17, $18
                ) RETURNING *
            `, [
                receiptNo,
                student_rollnumber,
                studentName,
                course_code,
                academic_year,
                item.fee_type,
                item.fee_name || item.fee_type,
                item.month_name || null,
                item.month_number || null,
                itemDue,
                itemPaid,
                waiver,
                payDate,
                payment_method,
                collectorName,
                collectorRole,
                collectorEmail,
                notes
            ]);
            insertedRows.push(r.rows[0]);
        }

        res.json({
            message: `রোল ${student_rollnumber} (${studentName})-এর ${fee_items.length}টি খাতের ফি সফলভাবে আদায় করা হয়েছে! (মোট: ৳${totalAmountPaid})`,
            receipt_no: receiptNo,
            total_paid: totalAmountPaid,
            items: insertedRows
        });
    } catch (err) {
        console.error("Error in collectMultiFee:", err);
        res.status(500).json({ message: "সমন্বিত ফি গ্রহণ সম্পন্ন করা যায়নি।" });
    }
};

// POST /api/fees/collect-batch (Collect selected fee heads for multiple students at once)
exports.collectBatchFee = async (req, res) => {
    try {
        const {
            student_rollnumbers,
            course_code,
            academic_year = "2026",
            fee_items, // Array of { fee_type, fee_name, amount, month_number, month_name }
            payment_method = "cash",
            payment_date,
            notes = ""
        } = req.body;

        if (!Array.isArray(student_rollnumbers) || student_rollnumbers.length === 0) {
            return res.status(400).json({ message: "অন্তত একজন শিক্ষার্থী নির্বাচন করুন।" });
        }
        if (!Array.isArray(fee_items) || fee_items.length === 0) {
            return res.status(400).json({ message: "অন্তত একটি ফি খাত নির্বাচন করুন।" });
        }

        const perm = await canManageClassFee(req.user, course_code, academic_year);
        if (!perm.allowed) {
            return res.status(403).json({
                message: "অনুমতি অস্বীকৃত! বিদ্যালয়ের নিয়ম অনুযায়ী শুধুমাত্র এই শ্রেণির শ্রেণি শিক্ষক, প্রধান শিক্ষক এবং অ্যাডমিন ফি গ্রহণ করতে পারবেন।"
            });
        }

        let collectorName = "অ্যাডমিন";
        let collectorRole = perm.role;
        let collectorEmail = req.user.email;
        if (req.user?.role === "faculty") {
            const facRes = await db.query("SELECT facultyname, position FROM faculties WHERE emailid = $1", [req.user.email]);
            if (facRes.rows.length > 0) {
                collectorName = facRes.rows[0].facultyname;
            }
        }

        const payDate = payment_date || new Date().toISOString().split("T")[0];
        const processedReceipts = [];

        for (const roll of student_rollnumbers) {
            const stRes = await db.query(
                "SELECT rollnumber, firstname, lastname, scholarship_type FROM students WHERE rollnumber = $1",
                [roll]
            );
            if (!stRes.rows.length) continue;
            const student = stRes.rows[0];
            const studentName = `${student.firstname || ""} ${student.lastname || ""}`.trim();
            const isScholarship = student.scholarship_type === "britti" || student.scholarship_type === "upobritti";

            const randNum = Math.floor(1000 + Math.random() * 9000);
            const receiptNo = `REC-${academic_year}-${roll}-${randNum}`;
            let studentTotal = 0;

            for (const item of fee_items) {
                let itemDue = Number(item.amount) || 0;
                let itemPaid = itemDue;
                let waiver = 0;

                if (item.fee_type === "monthly_tuition" && isScholarship) {
                    itemPaid = 0;
                    itemDue = 0;
                    waiver = Number(item.amount) || 0;
                }

                studentTotal += itemPaid;

                await db.query(`
                    INSERT INTO fee_collections (
                        receipt_no, student_rollnumber, student_name, course_code, academic_year,
                        fee_type, fee_name, month_name, month_number, amount_due, amount_paid,
                        discount_waiver, payment_date, payment_method, collected_by_name,
                        collected_by_role, collected_by_email, notes
                    ) VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10, $11,
                        $12, $13, $14, $15,
                        $16, $17, $18
                    )
                `, [
                    receiptNo,
                    roll,
                    studentName,
                    course_code,
                    academic_year,
                    item.fee_type,
                    item.fee_name || item.fee_type,
                    item.month_name || null,
                    item.month_number || null,
                    itemDue,
                    itemPaid,
                    waiver,
                    payDate,
                    payment_method,
                    collectorName,
                    collectorRole,
                    collectorEmail,
                    notes
                ]);
            }

            processedReceipts.push({
                rollnumber: roll,
                student_name: studentName,
                receipt_no: receiptNo,
                total_paid: studentTotal
            });
        }

        res.json({
            message: `একসাথে ${processedReceipts.length} জন শিক্ষার্থীর ফি সফলভাবে আদায় করা হয়েছে!`,
            count: processedReceipts.length,
            receipts: processedReceipts
        });
    } catch (err) {
        console.error("Error in collectBatchFee:", err);
        res.status(500).json({ message: "একসাথে ফি গ্রহণ সম্পন্ন করা যায়নি।" });
    }
};

// GET /api/fees/receipt/:receipt_no (Printable receipt info)
exports.getReceiptDetails = async (req, res) => {
    try {
        const { receipt_no } = req.params;
        const resData = await db.query(
            `SELECT fc.*, s.contactnumber, s.fathername, s.scholarship_type, c.course_name
             FROM fee_collections fc
             LEFT JOIN students s ON fc.student_rollnumber::text = s.rollnumber::text
             LEFT JOIN courses c ON fc.course_code = c.course_code
             WHERE fc.receipt_no = $1
             ORDER BY fc.id ASC`,
            [receipt_no]
        );

        if (!resData.rows.length) {
            return res.status(404).json({ message: "মানি রসিদ খুঁজে পাওয়া যায়নি।" });
        }

        const base = resData.rows[0];
        const items = resData.rows.map(r => ({
            id: r.id,
            fee_type: r.fee_type,
            fee_name: r.fee_name,
            month_name: r.month_name,
            amount_due: Number(r.amount_due),
            amount_paid: Number(r.amount_paid),
            discount_waiver: Number(r.discount_waiver)
        }));

        const totalDue = items.reduce((sum, it) => sum + it.amount_due, 0);
        const totalPaid = items.reduce((sum, it) => sum + it.amount_paid, 0);
        const totalWaiver = items.reduce((sum, it) => sum + it.discount_waiver, 0);

        res.json({
            ...base,
            items,
            total_due: totalDue,
            total_paid: totalPaid,
            total_waiver: totalWaiver,
            amount_paid: totalPaid
        });
    } catch (err) {
        console.error("Error in getReceiptDetails:", err);
        res.status(500).json({ message: "রসিদ প্রদর্শন করতে সমস্যা হয়েছে।" });
    }
};

// GET /api/fees/report (Comprehensive fee collection report)
exports.getFeeReport = async (req, res) => {
    try {
        const { course_code, academic_year = "2026", month_number, fee_type } = req.query;

        let query = `
            SELECT fc.*, s.scholarship_type
            FROM fee_collections fc
            LEFT JOIN students s ON fc.student_rollnumber::text = s.rollnumber::text
            WHERE fc.academic_year = $1
        `;
        const params = [academic_year];

        if (course_code) {
            params.push(course_code);
            query += ` AND fc.course_code = $${params.length}`;
        }

        if (fee_type) {
            params.push(fee_type);
            query += ` AND fc.fee_type = $${params.length}`;
        }

        if (month_number) {
            params.push(Number(month_number));
            query += ` AND fc.month_number = $${params.length}`;
        }

        query += ` ORDER BY fc.payment_date DESC, fc.id DESC`;

        const result = await db.query(query, params);

        let totalCollected = 0;
        result.rows.forEach(r => totalCollected += Number(r.amount_paid));

        res.json({
            academic_year,
            total_records: result.rows.length,
            total_collected: totalCollected,
            records: result.rows
        });
    } catch (err) {
        console.error("Error in getFeeReport:", err);
        res.status(500).json({ message: "রিপোর্ট প্রস্তুত করতে ব্যর্থ হয়েছে।" });
    }
};

// GET /api/fees/my-fees (For logged-in students)
exports.getStudentMyFees = async (req, res) => {
    try {
        const email = req.user.email;
        const sRes = await db.query(
            "SELECT rollnumber, firstname, lastname, courcecode, scholarship_type FROM students WHERE emailid = $1",
            [email]
        );

        if (!sRes.rows.length) {
            return res.status(404).json({ message: "শিক্ষার্থী অ্যাকাউন্ট পাওয়া যায়নি।" });
        }

        const student = sRes.rows[0];

        // Fetch payments made by this student
        const pRes = await db.query(
            `SELECT * FROM fee_collections 
             WHERE student_rollnumber = $1::text 
             ORDER BY payment_date DESC, id DESC`,
            [student.rollnumber]
        );

        // Fetch fee structure of their class
        const fsRes = await db.query(
            "SELECT * FROM fee_structure WHERE course_code = $1 AND academic_year = '2026'",
            [student.courcecode]
        );

        res.json({
            student,
            fees_structure: fsRes.rows,
            payment_history: pRes.rows
        });
    } catch (err) {
        console.error("Error in getStudentMyFees:", err);
        res.status(500).json({ message: "ফি তথ্য লোড করা যায়নি।" });
    }
};
