const db = require("../config/db");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { uploadFileToCloudinary } = require("../config/cloudinary");

// ============================
// Get Student Profile
// ============================

exports.getStudentProfile = async (req, res) => {
  try {
    const email = req.user.email;

    const result = await db.query(
        "SELECT * FROM students WHERE emailid = $1",
        [email]
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = rows[0];
    if (student && (!student.profilepic || !student.profilepic.startsWith("http"))) {
      student.profilepic = getStudentImage(student.rollnumber);
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// ============================
// Get Student Subjects
// ============================

exports.getStudentSubjects = async (req, res) => {
  try {
    const email = req.user.email;

    const studentResult = await db.query(
        "SELECT Courcecode, semoryear FROM students WHERE emailid = $1",
        [email]
    );

    const student = studentResult.rows;

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { Courcecode, semoryear } = student[0];

    const subjectsResult = await db.query(
        "SELECT * FROM subject WHERE courcecode = $1 AND semoryear = $2",
        [Courcecode, semoryear]
    );

    const subjects = subjectsResult.rows;

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

// ============================
// Update Student Profile
// ============================

exports.updateStudentProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { emailid, contactnumber, state, city } = req.body;

    await db.query(
        `UPDATE students
         SET emailid = $1, contactnumber = $2, state = $3, city = $4
         WHERE emailid = $5`,
        [emailid, contactnumber, state, city, email]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

// ============================
// Admin: Get All Students
// ============================

const studentUploadDir = path.resolve(__dirname, "../../uploads/students");

const getStudentImage = (rollnumber) => {
  if (!fs.existsSync(studentUploadDir)) return "default.png";

  const files = fs.readdirSync(studentUploadDir);

  const match = files.find((file) => {
    const name = path.basename(file, path.extname(file));
    return name.trim().toLowerCase() === String(rollnumber).trim().toLowerCase();
  });

  return match || "default.png";
};

exports.getAllStudents = async (req, res) => {
  try {
    const { include_alumni } = req.query;
    let query = `SELECT * FROM students`;
    if (include_alumni !== "true") {
      query += ` WHERE (is_alumni = false OR is_alumni IS NULL) AND (activestatus = 1 OR activestatus IS NULL) AND (Courcecode != 'ALUMNI' OR Courcecode IS NULL)`;
    }
    query += ` ORDER BY sr_no DESC`;
    const result = await db.query(query);

    const rows = result.rows;

    const updatedStudents = rows.map((student) => ({
      ...student,
      profilepic: (student.profilepic && (student.profilepic.startsWith("http://") || student.profilepic.startsWith("https://")))
        ? student.profilepic
        : getStudentImage(student.rollnumber),
    }));

    res.json(updatedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching students" });
  }
};

// ============================
// Admin: Create Student
// ============================

exports.createStudent = async (req, res) => {
  try {
    const {
      fullname,
      name_bn,
      rollnumber,
      emailid,
      contactnumber,
      dateofbirth,
      gender,
      state,
      city,
      fathername,
      fathername_bn,
      fatheroccupation,
      mothername,
      mothername_bn,
      motheroccupation,
      Courcecode,
      semoryear,
      optionalsubject,
      admissiondate,
      password
    } = req.body;

    if (
        !fullname ||
        !name_bn ||
        !rollnumber ||
        !contactnumber ||
        !dateofbirth ||
        !fathername ||
        !mothername ||
        !Courcecode
    ) {
      return res.status(400).json({ message: "শিক্ষার্থীর ইংরেজি ও বাংলা নাম, রোল নম্বর, মোবাইল, জন্মতারিখ এবং পিতা-মাতার ইংরেজি নাম আবশ্যক।" });
    }

    const isClass9Or10 = String(Courcecode).includes("9") || String(Courcecode).includes("10");
    if (isClass9Or10 && (!optionalsubject || !optionalsubject.trim())) {
      return res.status(400).json({ message: "৯ম ও ১০ম শ্রেণির শিক্ষার্থীদের জন্য ৪র্থ/ঐচ্ছিক বিষয় (Optional Subject) নির্বাচন করা বাধ্যতামূলক।" });
    }

    const nameParts = fullname.trim().split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || "";

    // Check duplicate email only if provided
    const cleanEmail = emailid && emailid.trim() !== "" ? emailid.trim() : null;
    if (cleanEmail) {
      const existingResult = await db.query(
          `SELECT * FROM students WHERE emailid = $1`,
          [cleanEmail]
      );

      const existing = existingResult.rows;

      if (existing.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Default password = @Student123@ if blank
    const finalPassword = (password && password.trim() !== "") ? password.trim() : "@Student123@";
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    let profilepic = null;
    if (req.file) {
      const cloudUrl = await uploadFileToCloudinary(req.file.path, "students");
      profilepic = cloudUrl || req.file.filename;
    }

    const effectiveAcademicYear = req.body.academic_year || (semoryear && Number(semoryear) > 100 ? String(semoryear) : "2026");
    const effectiveSemOrYear = (semoryear && Number(semoryear) > 100) ? 1 : (Number(semoryear) || 1);

    await db.query(
        `INSERT INTO students
         (Courcecode, semoryear, rollnumber, optionalsubject, firstname, lastname, emailid,
          contactnumber, dateofbirth, gender, state, city,
          fathername, fatheroccupation, mothername, motheroccupation,
          profilepic, password, activestatus, admissiondate, academic_year,
          name_bn, fathername_bn, mothername_bn)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                 $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
                 $22, $23, $24)`,
        [
          Courcecode,
          effectiveSemOrYear,
          rollnumber,
          isClass9Or10 ? (optionalsubject || null) : null,
          firstname,
          lastname,
          cleanEmail,
          contactnumber,
          dateofbirth,
          gender || "Female",
          state || "Rangpur",
          city || "Nilphamari",
          fathername.trim(),
          fatheroccupation || null,
          mothername.trim(),
          motheroccupation || null,
          profilepic,
          hashedPassword,
          0,
          admissiondate || null,
          effectiveAcademicYear,
          name_bn ? name_bn.trim() : null,
          fathername_bn ? fathername_bn.trim() : null,
          mothername_bn ? mothername_bn.trim() : null
        ]
    );

    res.json({ message: "Student created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating student" });
  }
};

// ============================
// Admin: Update Student
// ============================

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullname,
      name_bn,
      rollnumber,
      emailid,
      contactnumber,
      dateofbirth,
      gender,
      state,
      city,
      fathername,
      fathername_bn,
      fatheroccupation,
      mothername,
      mothername_bn,
      motheroccupation,
      Courcecode,
      semoryear,
      optionalsubject,
      admissiondate,
      password,
      activestatus
    } = req.body;

    const nameParts = fullname ? fullname.trim().split(" ") : [""];
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || "";

    const cleanEmail = emailid && emailid.trim() !== "" ? emailid.trim() : null;
    if (cleanEmail) {
      const existingResult = await db.query(
        `SELECT sr_no FROM students WHERE emailid = $1 AND sr_no != $2`,
        [cleanEmail, id]
      );
      if (existingResult.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const isClass9Or10 = String(Courcecode).includes("9") || String(Courcecode).includes("10");

    const effectiveAcademicYear = req.body.academic_year || (semoryear && Number(semoryear) > 100 ? String(semoryear) : undefined);
    const effectiveSemOrYear = (semoryear && Number(semoryear) > 100) ? 1 : (Number(semoryear) || 1);

    let updateQuery = `
      UPDATE students SET
                        Courcecode = $1,
                        semoryear = $2,
                        rollnumber = $3,
                        optionalsubject = $4,
                        firstname = $5,
                        lastname = $6,
                        emailid = $7,
                        contactnumber = $8,
                        dateofbirth = $9,
                        gender = $10,
                        state = $11,
                        city = $12,
                        fathername = $13,
                        fatheroccupation = $14,
                        mothername = $15,
                        motheroccupation = $16,
                        admissiondate = $17,
                        activestatus = $18,
                        academic_year = COALESCE($19, academic_year, '2026'),
                        name_bn = COALESCE($20, name_bn),
                        fathername_bn = COALESCE($21, fathername_bn),
                        mothername_bn = COALESCE($22, mothername_bn)
    `;

    const values = [
      Courcecode,
      effectiveSemOrYear,
      rollnumber,
      isClass9Or10 ? (optionalsubject || null) : null,
      firstname,
      lastname,
      cleanEmail,
      contactnumber,
      dateofbirth,
      gender || "Female",
      state || "Rangpur",
      city || "Nilphamari",
      fathername ? fathername.trim() : null,
      fatheroccupation || null,
      mothername ? mothername.trim() : null,
      motheroccupation || null,
      admissiondate || null,
      activestatus,
      effectiveAcademicYear || null,
      name_bn ? name_bn.trim() : null,
      fathername_bn ? fathername_bn.trim() : null,
      mothername_bn ? mothername_bn.trim() : null
    ];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.push(hashedPassword);
      updateQuery += `, password = $${values.length}`;
    }

    if (req.file) {
      const cloudUrl = await uploadFileToCloudinary(req.file.path, "students");
      values.push(cloudUrl || req.file.filename);
      updateQuery += `, profilepic = $${values.length}`;
    }

    values.push(id);
    updateQuery += ` WHERE sr_no = $${values.length}`;

    await db.query(updateQuery, values);

    res.json({ message: "Student updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating student" });
  }
};

// ============================
// Admin: Delete Student
// ============================

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
        "SELECT rollnumber FROM students WHERE sr_no = $1",
        [id]
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const rollnumber = rows[0].rollnumber;

    await db.query(
        "DELETE FROM students WHERE sr_no = $1",
        [id]
    );

    const dynamicImage = getStudentImage(rollnumber);

    if (dynamicImage !== "default.png") {
      const filePath = path.join(studentUploadDir, dynamicImage);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Student deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting student" });
  }
};

// ============================
// Download Student Template
// ============================

exports.downloadStudentTemplate = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Students");

    const headers = [
      "fullname",
      "rollnumber",
      "emailid",
      "contactnumber",
      "dateofbirth",
      "gender",
      "state",
      "city",
      "fathername",
      "fatheroccupation",
      "mothername",
      "motheroccupation",
      "Courcecode",
      "semoryear",
      "optionalsubject",
      "admissiondate"
    ];

    sheet.addRow(headers);

    sheet.columns.forEach(col => {
      col.width = 22;
    });

    sheet.getRow(1).font = { bold: true };

    sheet.addRow([
      "Mst. Sadia Sultana",
      "1001",
      "",
      "01712345678",
      "2009-03-15",
      "Female",
      "Rangpur",
      "Nilphamari",
      "Md. Rafiqul Islam",
      "Teacher",
      "Mst. Rahima Begum",
      "Housewife",
      "CLASS-10-SCI",
      1,
      "Higher Mathematics",
      "2024-01-01"
    ]);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=Student_Import_Template.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating template" });
  }
};

// ============================
// Import Students From Excel
// ============================

exports.importStudentsFromExcel = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;

  let totalRows = 0;
  let inserted = 0;
  let duplicates = 0;
  let invalidRows = 0;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    totalRows = data.length;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      const {
        fullname,
        rollnumber,
        emailid,
        contactnumber,
        dateofbirth,
        gender,
        state,
        city,
        fathername,
        fatheroccupation,
        mothername,
        motheroccupation,
        Courcecode,
        semoryear,
        optionalsubject,
        admissiondate
      } = row;

      if (!fullname || !rollnumber || !Courcecode || !semoryear) {
        invalidRows++;
        continue;
      }

      try {
        const nameParts = String(fullname).trim().split(" ");
        const firstname = nameParts[0];
        const lastname = nameParts.slice(1).join(" ") || "";

        const cleanEmail = emailid && String(emailid).trim() !== "" ? String(emailid).trim() : null;
        const passText = dateofbirth ? String(dateofbirth) : String(rollnumber);
        const hashedPassword = await bcrypt.hash(passText, 10);

        await db.query(
            `INSERT INTO students
             (Courcecode, semoryear, rollnumber, optionalsubject, firstname, lastname, emailid,
              contactnumber, dateofbirth, gender, state, city,
              fathername, fatheroccupation, mothername, motheroccupation,
              password, activestatus, admissiondate)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                     $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
            [
              Courcecode,
              semoryear,
              rollnumber,
              optionalsubject || null,
              firstname,
              lastname,
              cleanEmail,
              contactnumber || null,
              dateofbirth || null,
              gender || "Female",
              state || "Rangpur",
              city || "Nilphamari",
              fathername || null,
              fatheroccupation || null,
              mothername || null,
              motheroccupation || null,
              hashedPassword,
              1,
              admissiondate || null
            ]
        );

        inserted++;

      } catch (error) {
        if (error.code === "23505") {
          duplicates++;
        } else {
          invalidRows++;
        }
      }
    }

    fs.unlinkSync(filePath);

    res.json({
      totalRows,
      inserted,
      duplicates,
      invalidRows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Import failed" });
  }
};
// ============================
// Admin: Promote Students
// ============================

exports.promoteStudents = async (req, res) => {
  try {
    const { fromCourse, toCourse, studentIds, passingYear } = req.body;

    if (!fromCourse || !toCourse || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Source class, target class, and student selection are required." });
    }

    if (toCourse === "ALUMNI" || toCourse === "GRADUATED") {
      const year = passingYear || new Date().getFullYear().toString();
      const result = await db.query(
        `UPDATE students
         SET is_alumni = true,
             ssc_passing_year = $1,
             graduation_date = CURRENT_DATE,
             activestatus = 0
         WHERE sr_no = ANY($2::int[]) AND Courcecode = $3
         RETURNING sr_no, rollnumber, firstname, lastname`,
        [year, studentIds, fromCourse]
      );

      return res.json({
        message: `${result.rowCount} জন শিক্ষার্থীকে সফলভাবে প্রাক্তন শিক্ষার্থী আর্কাইভে (এসএসসি ব্যাচ ${year}) স্থানান্তর করা হয়েছে।`,
        promotedCount: result.rowCount,
        students: result.rows
      });
    }

    const result = await db.query(
      `UPDATE students
       SET Courcecode = $1, semoryear = 1
       WHERE sr_no = ANY($2::int[]) AND Courcecode = $3
       RETURNING sr_no, rollnumber, firstname, lastname`,
      [toCourse, studentIds, fromCourse]
    );

    res.json({
      message: `Successfully promoted ${result.rowCount} student(s) to ${toCourse}.`,
      promotedCount: result.rowCount,
      students: result.rows
    });
  } catch (error) {
    console.error("Error promoting students:", error);
    res.status(500).json({ message: "Failed to promote students." });
  }
};

// ============================
// Ex-Students / Alumni Management
// ============================

exports.getAlumniStudents = async (req, res) => {
  try {
    const { passing_year, course_code, search } = req.query;

    let query = `
      SELECT sr_no, rollnumber, firstname, lastname, emailid, contactnumber, 
             dateofbirth, gender, courcecode, academic_year, scholarship_type,
             is_alumni, ssc_passing_year, ssc_gpa, ssc_board_roll, ssc_reg_no,
             graduation_date, fathername, mothername, city, state, profilepic
      FROM students
      WHERE (is_alumni = true OR Courcecode = 'ALUMNI')
    `;
    const params = [];

    if (passing_year) {
      params.push(passing_year);
      query += ` AND ssc_passing_year = ${params.length}`;
    }

    if (course_code) {
      params.push(course_code);
      query += ` AND courcecode = ${params.length}`;
    }

    if (search) {
      params.push(`%${search.trim()}%`);
      query += ` AND (
        CONCAT(firstname, ' ', lastname) ILIKE ${params.length}
        OR CAST(rollnumber AS TEXT) ILIKE ${params.length}
        OR ssc_board_roll ILIKE ${params.length}
        OR ssc_reg_no ILIKE ${params.length}
      )`;
    }

    query += ` ORDER BY ssc_passing_year DESC, rollnumber ASC`;

    const result = await db.query(query, params);

    const yearsResult = await db.query(`
      SELECT DISTINCT ssc_passing_year 
      FROM students 
      WHERE (is_alumni = true OR Courcecode = 'ALUMNI') AND ssc_passing_year IS NOT NULL 
      ORDER BY ssc_passing_year DESC
    `);
    const availableYears = yearsResult.rows.map(r => r.ssc_passing_year);

    res.json({
      students: result.rows.map(s => ({
        ...s,
        profilepic: getStudentImage(s.rollnumber)
      })),
      total: result.rowCount,
      availableYears
    });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ message: "Error fetching alumni records" });
  }
};

exports.graduateStudents = async (req, res) => {
  try {
    const { studentIds, passingYear, graduationDate } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Student IDs are required." });
    }

    const year = passingYear || new Date().getFullYear().toString();
    const gradDate = graduationDate || new Date().toISOString().split("T")[0];

    const result = await db.query(
      `UPDATE students
       SET is_alumni = true,
           ssc_passing_year = $1,
           graduation_date = $2,
           activestatus = 0
       WHERE sr_no = ANY($3::int[])
       RETURNING sr_no, rollnumber, firstname, lastname, ssc_passing_year`,
      [year, gradDate, studentIds]
    );

    res.json({
      message: `${result.rowCount} জন শিক্ষার্থীকে সফলভাবে প্রাক্তন শিক্ষার্থী আর্কাইভে (এসএসসি ব্যাচ ${year}) স্থানান্তর করা হয়েছে।`,
      graduated: result.rows
    });
  } catch (error) {
    console.error("Error graduating students:", error);
    res.status(500).json({ message: "Error graduating students" });
  }
};

exports.addAlumniStudent = async (req, res) => {
  try {
    const {
      rollnumber,
      firstname,
      lastname,
      contactnumber,
      courcecode,
      ssc_passing_year,
      ssc_board_roll,
      ssc_reg_no,
      ssc_gpa,
      fathername,
      mothername,
      city,
      dateofbirth,
      gender
    } = req.body;

    if (!rollnumber || !firstname || !ssc_passing_year) {
      return res.status(400).json({ message: "Roll number, Name and SSC Passing Year are required." });
    }

    const check = await db.query("SELECT sr_no FROM students WHERE rollnumber = $1", [rollnumber]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Student with this roll number already exists." });
    }

    const result = await db.query(
      `INSERT INTO students (
        rollnumber, firstname, lastname, contactnumber, courcecode,
        ssc_passing_year, ssc_board_roll, ssc_reg_no, ssc_gpa,
        fathername, mothername, city, dateofbirth, gender,
        is_alumni, activestatus, semoryear, graduation_date
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        true, 0, 2, CURRENT_DATE
      ) RETURNING *`,
      [
        rollnumber,
        firstname,
        lastname || "",
        contactnumber || "",
        courcecode || "CLASS-10-SCI",
        ssc_passing_year,
        ssc_board_roll || null,
        ssc_reg_no || null,
        ssc_gpa || null,
        fathername || null,
        mothername || null,
        city || null,
        dateofbirth || null,
        gender || "Female"
      ]
    );

    res.json({
      message: "প্রাক্তন শিক্ষার্থী সফলভাবে যুক্ত করা হয়েছে।",
      student: result.rows[0]
    });
  } catch (error) {
    console.error("Error adding alumni student:", error);
    res.status(500).json({ message: "Error adding alumni student" });
  }
};

exports.updateAlumniStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ssc_passing_year,
      ssc_board_roll,
      ssc_reg_no,
      ssc_gpa,
      contactnumber,
      fathername,
      mothername,
      city
    } = req.body;

    const result = await db.query(
      `UPDATE students
       SET ssc_passing_year = COALESCE($1, ssc_passing_year),
           ssc_board_roll = COALESCE($2, ssc_board_roll),
           ssc_reg_no = COALESCE($3, ssc_reg_no),
           ssc_gpa = COALESCE($4, ssc_gpa),
           contactnumber = COALESCE($5, contactnumber),
           fathername = COALESCE($6, fathername),
           mothername = COALESCE($7, mothername),
           city = COALESCE($8, city)
       WHERE sr_no = $9
       RETURNING *`,
      [
        ssc_passing_year,
        ssc_board_roll,
        ssc_reg_no,
        ssc_gpa,
        contactnumber,
        fathername,
        mothername,
        city,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Alumni student not found" });
    }

    res.json({
      message: "তথ্য সফলভাবে আপডেট করা হয়েছে।",
      student: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating alumni student:", error);
    res.status(500).json({ message: "Error updating alumni student" });
  }
};
