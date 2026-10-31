/**
 * Bangladesh NCTB / Education Board Grading System
 *
 * Rules:
 * 1. Bangla 1st Paper + Bangla 2nd Paper: Combined 200 marks for Grade & Grade Point (1 academic subject).
 * 2. English 1st Paper + English 2nd Paper: Combined 200 marks for Grade & Grade Point (1 academic subject).
 * 3. 4th / Optional Subject (ঐচ্ছিক বিষয়):
 *    - Point above 2 (GP - 2, max 3) is added to total grade points.
 *    - Optional subject is NOT included in the denominator (divisor) for GPA.
 *    - A fail in the optional subject does NOT fail the student overall.
 * 4. GPA = (Sum of Compulsory Subject GPs + (Optional GP - 2)) / (Number of Compulsory Subjects)
 *    - Max capped at 5.00
 *    - If any compulsory subject is F (0.00), final GPA is 0.00 (FAILED).
 */

const getBangladeshGrade = (obtained, max) => {
    if (!max || max <= 0) return { grade: "N/A", point: 0 };
    const pct = (obtained / max) * 100;
    if (pct >= 79.5) return { grade: "A+", point: 5.0 };
    if (pct >= 69.5) return { grade: "A", point: 4.0 };
    if (pct >= 59.5) return { grade: "A-", point: 3.5 };
    if (pct >= 49.5) return { grade: "B", point: 3.0 };
    if (pct >= 39.5) return { grade: "C", point: 2.0 };
    if (pct >= 32.5) return { grade: "D", point: 1.0 };
    return { grade: "F", point: 0.0 };
};

const isBanglaPaper = (code, name) => {
    const c = String(code || "").toUpperCase();
    const n = String(name || "").toLowerCase();
    return c.includes("BAN") || n.includes("bangla") || n.includes("বাংলা");
};

const isEnglishPaper = (code, name) => {
    const c = String(code || "").toUpperCase();
    const n = String(name || "").toLowerCase();
    return c.includes("ENG") || n.includes("english") || n.includes("ইংরেজি");
};

const isOptionalSubject = (sub, courseCode) => {
    // Junior secondary (Class 6, 7, 8) NEVER has optional subjects in Bangladesh NCTB
    const c = String(courseCode || sub?.courcecode || "").toUpperCase();
    if (c.includes("CLASS-6") || c.includes("CLASS-7") || c.includes("CLASS-8")) {
        return false;
    }
    const type = String(sub?.subjecttype || "").toLowerCase();
    const name = String(sub?.subjectname || "").toLowerCase();
    return (
        type === "optional" ||
        type === "4th" ||
        name.includes("ঐচ্ছিক") ||
        name.includes("optional") ||
        name.includes("4th")
    );
};

const calculateBangladeshResult = (rows, courseCodeParam) => {
    if (!rows || rows.length === 0) {
        return {
            processedRows: [],
            summary: {
                totalObtained: 0,
                totalMaximum: 0,
                percentage: 0,
                gpa: "0.00",
                finalGrade: "F",
                division: "FAILED",
                result: "FAILED"
            }
        };
    }

    let totalObtained = 0;
    let totalMaximum = 0;

    // 1. Process individual subjects
    const processedRows = rows.map((r) => {
        const cq = Number(r.cq_marks) || 0;
        const mcq = Number(r.mcq_marks) || 0;
        const practical = Number(r.practicalmarks) || 0;
        const theory = (r.cq_marks !== null && r.cq_marks !== undefined) || (r.mcq_marks !== null && r.mcq_marks !== undefined)
            ? (cq + mcq)
            : (Number(r.theorymarks) || 0);

        const theoryFull = Number(r.theoryfull) || 0;
        const practicalFull = Number(r.practicalfull) || 0;
        const subjectTotal = theory + practical;
        const subjectMax = (theoryFull + practicalFull) > 0 ? (theoryFull + practicalFull) : 100;

        totalObtained += subjectTotal;
        totalMaximum += subjectMax;

        const { grade, point } = getBangladeshGrade(subjectTotal, subjectMax);

        return {
            ...r,
            cq_marks: cq,
            mcq_marks: mcq,
            theorymarks: theory,
            practicalmarks: practical,
            totalmarks: subjectTotal,
            maxmarks: subjectMax,
            grade,
            gradepoint: point.toFixed(2),
            numericPoint: point,
            isOptional: isOptionalSubject(r, courseCodeParam || r.courcecode)
        };
    });

    // 2. Separate papers
    const banglaPapers = processedRows.filter(r => isBanglaPaper(r.subjectcode, r.subjectname) && !r.isOptional);
    const englishPapers = processedRows.filter(r => isEnglishPaper(r.subjectcode, r.subjectname) && !r.isOptional);
    const optionalSubjects = processedRows.filter(r => r.isOptional);

    const otherCoreSubjects = processedRows.filter(r =>
        !isBanglaPaper(r.subjectcode, r.subjectname) &&
        !isEnglishPaper(r.subjectcode, r.subjectname) &&
        !r.isOptional
    );

    let hasCompulsoryFailed = false;
    let compulsoryGradePoints = 0;
    let compulsorySubjectCount = 0;

    // A. Bangla Combined (1st + 2nd Paper)
    let combinedBangla = null;
    if (banglaPapers.length >= 2) {
        const bTotal = banglaPapers.reduce((sum, p) => sum + p.totalmarks, 0);
        const bMax = banglaPapers.reduce((sum, p) => sum + p.maxmarks, 0);
        const { grade, point } = getBangladeshGrade(bTotal, bMax);
        if (grade === "F") hasCompulsoryFailed = true;
        compulsoryGradePoints += point;
        compulsorySubjectCount += 1;
        combinedBangla = { total: bTotal, max: bMax, grade, point };
    } else if (banglaPapers.length === 1) {
        if (banglaPapers[0].grade === "F") hasCompulsoryFailed = true;
        compulsoryGradePoints += banglaPapers[0].numericPoint;
        compulsorySubjectCount += 1;
    }

    // B. English Combined (1st + 2nd Paper)
    let combinedEnglish = null;
    if (englishPapers.length >= 2) {
        const eTotal = englishPapers.reduce((sum, p) => sum + p.totalmarks, 0);
        const eMax = englishPapers.reduce((sum, p) => sum + p.maxmarks, 0);
        const { grade, point } = getBangladeshGrade(eTotal, eMax);
        if (grade === "F") hasCompulsoryFailed = true;
        compulsoryGradePoints += point;
        compulsorySubjectCount += 1;
        combinedEnglish = { total: eTotal, max: eMax, grade, point };
    } else if (englishPapers.length === 1) {
        if (englishPapers[0].grade === "F") hasCompulsoryFailed = true;
        compulsoryGradePoints += englishPapers[0].numericPoint;
        compulsorySubjectCount += 1;
    }

    // C. Other Core Subjects
    otherCoreSubjects.forEach(s => {
        if (s.grade === "F") hasCompulsoryFailed = true;
        compulsoryGradePoints += s.numericPoint;
        compulsorySubjectCount += 1;
    });

    // D. 4th / Optional Subject: GP Above 2 (max 3 points)
    let optionalBonus = 0;
    let optionalInfo = null;
    if (optionalSubjects.length > 0) {
        const opt = optionalSubjects[0];
        const optPoint = opt.numericPoint;
        optionalBonus = Math.max(0, optPoint - 2.0);
        optionalInfo = {
            subjectcode: opt.subjectcode,
            subjectname: opt.subjectname,
            grade: opt.grade,
            point: optPoint,
            bonusAdded: Number(optionalBonus.toFixed(2))
        };
        // Note: F in optional subject does NOT fail the student
    }

    // E. Final GPA
    let calculatedGpa = 0;
    if (compulsorySubjectCount > 0) {
        calculatedGpa = (compulsoryGradePoints + optionalBonus) / compulsorySubjectCount;
    }
    if (calculatedGpa > 5.0) {
        calculatedGpa = 5.0;
    }

    const finalGpa = hasCompulsoryFailed ? "0.00" : calculatedGpa.toFixed(2);

    let finalGrade = "F";
    if (!hasCompulsoryFailed) {
        if (calculatedGpa >= 5.0) finalGrade = "A+";
        else if (calculatedGpa >= 4.0) finalGrade = "A";
        else if (calculatedGpa >= 3.5) finalGrade = "A-";
        else if (calculatedGpa >= 3.0) finalGrade = "B";
        else if (calculatedGpa >= 2.0) finalGrade = "C";
        else if (calculatedGpa >= 1.0) finalGrade = "D";
    }

    const percentage = totalMaximum > 0
        ? Number(((totalObtained / totalMaximum) * 100).toFixed(2))
        : 0;

    const result = hasCompulsoryFailed ? "FAILED" : "PASSED";

    return {
        processedRows,
        summary: {
            totalObtained,
            totalMaximum,
            percentage,
            gpa: finalGpa,
            finalGrade,
            division: hasCompulsoryFailed ? "FAILED" : (calculatedGpa >= 5.0 ? "Golden A+" : `GPA ${finalGpa}`),
            result,
            hasCompulsoryFailed,
            compulsorySubjectCount,
            compulsoryGradePoints: Number(compulsoryGradePoints.toFixed(2)),
            optionalBonus: Number(optionalBonus.toFixed(2)),
            combinedBangla,
            combinedEnglish,
            optionalInfo
        }
    };
};

module.exports = {
    getBangladeshGrade,
    calculateBangladeshResult,
    isOptionalSubject
};
