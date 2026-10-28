const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BASE_URL}/api/auth/google-callback`
);

/*
  Role-Based Login
  Supports bcrypt OR plain text passwords
*/

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const identifier = String(email || "").trim();

        if (!identifier || !password) {
            return res.status(400).json({ message: "ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড আবশ্যক।" });
        }

        let user = null;
        let role = null;
        let table = null;

        // Check admin
        const { rows: adminRows } = await db.query(
            "SELECT * FROM admin WHERE emailid = $1",
            [identifier]
        );

        if (adminRows.length > 0) {
            user = adminRows[0];
            role = "admin";
            table = "admin";
        }

        // Check faculties (by email OR mobile number OR pdsid)
        if (!user) {
            const { rows: facultyRows } = await db.query(
                `SELECT * FROM faculties 
                 WHERE emailid = $1 
                    OR contactnumber = $1 
                    OR (pdsid IS NOT NULL AND pdsid = $1)
                 LIMIT 1`,
                [identifier]
            );

            if (facultyRows.length > 0) {
                user = facultyRows[0];
                role = "faculty";
                table = "faculties";
            }
        }

        // Check students (by email OR mobile number OR rollnumber)
        if (!user) {
            const { rows: studentRows } = await db.query(
                `SELECT * FROM students 
                 WHERE emailid = $1 
                    OR contactnumber = $1 
                    OR rollnumber::text = $1
                 LIMIT 1`,
                [identifier]
            );

            if (studentRows.length > 0) {
                user = studentRows[0];
                role = "student";
                table = "students";
            }
        }

        // No user found
        if (!user) {
            return res.status(401).json({ message: "সঠিক ইমেইল/মোবাইল নম্বর বা পাসওয়ার্ড প্রদান করুন।" });
        }

        // Check password (bcrypt OR plain text)
        let isMatch = false;

        if (user.password && user.password.startsWith("$2")) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = password === user.password;
        }

        if (!isMatch) {
            return res.status(401).json({ message: "পাসওয়ার্ড সঠিক নয়।" });
        }

        const token = jwt.sign(
            { 
                email: user.emailid, 
                role,
                name: user.facultyname || user.firstname || "User"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

       await db.query(
    `UPDATE ${table} SET activestatus = 1, lastlogin = $1 WHERE emailid = $2`,
    [new Date().toISOString(), user.emailid]
);
        res.json({
            message: "Login successful",
            token,
            role,
            user: {
                name: user.facultyname || `${user.firstname || ""} ${user.lastname || ""}`.trim() || "User",
                email: user.emailid,
                position: user.position || null,
                pdsid: user.pdsid || null,
                contactnumber: user.contactnumber || null
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/* ============================================================
   FORGOT / RESET PASSWORD (SELF SERVICE)
============================================================ */
exports.forgotPassword = async (req, res) => {
    try {
        const { identifier, phone, newPassword } = req.body;
        if (!identifier || !phone || !newPassword) {
            return res.status(400).json({ 
                message: "সকল তথ্য প্রদান করুন (ইমেইল/আইডি, মোবাইল নম্বর ও নতুন পাসওয়ার্ড)।" 
            });
        }

        const cleanId = String(identifier).trim();
        const cleanPhone = String(phone).trim();

        const fRes = await db.query(
            `SELECT sr_no, emailid, contactnumber, facultyname FROM faculties 
             WHERE (emailid = $1 OR contactnumber = $1 OR (pdsid IS NOT NULL AND pdsid = $1))
               AND contactnumber = $2 
             LIMIT 1`,
            [cleanId, cleanPhone]
        );

        if (!fRes.rows.length) {
            return res.status(404).json({ 
                message: "প্রদত্ত ইমেইল এবং মোবাইল নম্বরের সাথে কোনো শিক্ষক অ্যাকাউন্ট মেলেনি।" 
            });
        }

        const teacher = fRes.rows[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE faculties SET password = $1 WHERE sr_no = $2", [hashedPassword, teacher.sr_no]);

        return res.json({ 
            message: `সম্মানিত ${teacher.facultyname || "শিক্ষক"}, আপনার পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে। নতুন পাসওয়ার্ড দিয়ে লগইন করুন।` 
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।" });
    }
};

/*
  Role-Based Logout
*/

exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { email, role } = decoded;

        let table = null;

        if (role === "admin") table = "admin";
        if (role === "faculty") table = "faculties";
        if (role === "student") table = "students";

        if (!table) {
            return res.status(400).json({ message: "Invalid role" });
        }

        await db.query(
            `
UPDATE ${table}
SET activestatus = 0
WHERE emailid = $1
    `,
            [email]
        );

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Logout failed" });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        let user = null;
        let role = null;
        let table = null;

        // Check admin
        const { rows: adminRows } = await db.query(
            "SELECT * FROM admin WHERE emailid = $1",
            [email]
        );

        if (adminRows.length > 0) {
            user = adminRows[0];
            role = "admin";
            table = "admin";
        }

        // Check faculty
        if (!user) {
            const { rows: facultyRows } = await db.query(
                "SELECT * FROM faculties WHERE emailid = $1",
                [email]
            );

            if (facultyRows.length > 0) {
                user = facultyRows[0];
                role = "faculty";
                table = "faculties";
            }
        }

        // Check students
        if (!user) {
            const { rows: studentRows } = await db.query(
                "SELECT * FROM students WHERE emailid = $1",
                [email]
            );

            if (studentRows.length > 0) {
                user = studentRows[0];
                role = "student";
                table = "students";
            }
        }

        if (!user) {
            return res.status(403).json({
                message: "Google account not registered in system"
            });
        }

        const token = jwt.sign(
            { email: user.emailid, role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        await db.query(
            `
UPDATE ${table}
SET activestatus = 1,
    lastlogin = $1
WHERE emailid = $2
    `,
            [new Date().toISOString(), email]
        );

        res.json({
            message: "Google login successful",
            token,
            role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Google login failed" });
    }
};

exports.googleRedirect = (req, res) => {

    const redirectUri = `${process.env.BASE_URL}/api/auth/google-callback`;
    const platform = req.query.platform || "web";
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "select_account");

    // optional security parameter
    authUrl.searchParams.set("state", platform);

    console.log("Redirecting to Google OAuth:", authUrl.toString());

    res.redirect(authUrl.toString());
};

exports.googleCallback = async (req, res) => {

    try {

        const { code, state } = req.query;
        const platform = state || "web";

        if (!code) {
            return res.status(400).send("Authorization code missing");
        }

        /* ===== Exchange authorization code for tokens ===== */

        const { tokens } = await client.getToken(code);

        /* ===== Verify Google ID token ===== */

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload.email_verified) {
            return res.status(401).send("Google email not verified");
        }

        const email = payload.email;

        let user = null;
        let role = null;
        let table = null;

        /* ===== Check Admin ===== */

        const { rows: adminRows } = await db.query(
            "SELECT * FROM admin WHERE emailid = $1",
            [email]
        );

        if (adminRows.length > 0) {
            user = adminRows[0];
            role = "admin";
            table = "admin";
        }

        /* ===== Check Faculty ===== */

        if (!user) {

            const { rows: facultyRows } = await db.query(
                "SELECT * FROM faculties WHERE emailid = $1",
                [email]
            );

            if (facultyRows.length > 0) {
                user = facultyRows[0];
                role = "faculty";
                table = "faculties";
            }

        }

        /* ===== Check Student ===== */

        if (!user) {

            const { rows: studentRows } = await db.query(
                "SELECT * FROM students WHERE emailid = $1",
                [email]
            );

            if (studentRows.length > 0) {
                user = studentRows[0];
                role = "student";
                table = "students";
            }

        }

        /* ===== Reject unknown Google users ===== */

        if (!user) {
            return res.status(403).send("Google account not registered in system");
        }

        /* ===== Generate JWT ===== */

        const token = jwt.sign(
            { email: user.emailid, role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        /* ===== Update login status ===== */

        await db.query(
            `
UPDATE ${table}
SET activestatus = 1,
    lastlogin = $1
WHERE emailid = $2
    `,
            [new Date().toISOString(), email]
        );

        /* ===== Redirect to frontend ===== */

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        if (platform === "android") {

            return res.redirect(`cms://oauth-success/?token=${token}&role=${role}`);

    }

if (platform === "electron") {
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}&role=${role}`);
}

return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}&role=${role}`);

} catch (error) {

    console.error("Google OAuth Error:", error);
    res.status(500).send("Google login failed");

}

};
