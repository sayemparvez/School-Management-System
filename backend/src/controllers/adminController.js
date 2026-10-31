const db = require("../config/db");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

/*
  Get Admin Profile
*/
const adminUploadDir = path.resolve(__dirname, "../../uploads/admin");

const getAdminLogo = () => {
    if (!fs.existsSync(adminUploadDir)) return "default.png";

    const files = fs.readdirSync(adminUploadDir);

    const match = files.find(file => {
        const name = path.basename(file, path.extname(file));
        return name === "admin";
    });

    return match || "default.png";
};

exports.getAdminProfile = async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM admin LIMIT 1");

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const admin = rows[0];

        const logoFile = getAdminLogo();
        admin.logo = `/uploads/admin/${logoFile}?v=${Date.now()}`;

        res.json(admin);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching admin" });
    }
};


/*
  Update Admin Profile
*/

exports.updateAdminProfile = async (req, res) => {
    try {
        const {
            collagename,
            address,
            emailid,
            contactnumber,
            website,
            facebook,
            instagram,
            twitter,
            linkedin,
            password
        } = req.body;

        let hashedPassword = null;

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            if (!fs.existsSync(adminUploadDir)) {
                fs.mkdirSync(adminUploadDir, { recursive: true });
            }

            const ext = path.extname(req.file.originalname).toLowerCase();
            const allowedExt = [".png", ".jpg", ".jpeg"];

            if (!allowedExt.includes(ext)) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: "Only PNG, JPG, JPEG allowed" });
            }

            // Remove existing admin image
            const files = fs.readdirSync(adminUploadDir);
            files.forEach(file => {
                const name = path.basename(file, path.extname(file));
                if (name === "admin") {
                    fs.unlinkSync(path.join(adminUploadDir, file));
                }
            });

            const newFileName = `admin${ext}`;
            const newFilePath = path.join(adminUploadDir, newFileName);

            fs.renameSync(req.file.path, newFilePath);
        }

        await db.query(
            `
UPDATE admin
SET collagename = $1,
    address = $2,
    emailid = $3,
    contactnumber = $4,
    website = $5,
    facebook = $6,
    instagram = $7,
    twitter = $8,
    linkedin = $9,
    password = COALESCE($10, password)
        `,
            [
                collagename,
                address,
                emailid,
                contactnumber,
                website,
                facebook,
                instagram,
                twitter,
                linkedin,
                hashedPassword
            ]
        );

        res.json({ message: "Admin updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Update failed" });
    }
};

// =========================================================
// Super Admin Features: Manage Admins
// =========================================================

const checkIsSuperAdmin = async (reqUser) => {
    if (!reqUser) return false;
    if (reqUser.is_super_admin) return true;
    const email = reqUser.email;
    if (email === "psayem0@gmail.com") return true;
    const check = await db.query("SELECT is_super_admin, role FROM admin WHERE emailid = $1", [email]);
    if (check.rows.length > 0) {
        return Boolean(check.rows[0].is_super_admin || check.rows[0].role === "super_admin");
    }
    return false;
};

// GET /api/admin/all-admins (Super Admin only)
exports.getAllAdmins = async (req, res) => {
    try {
        const isSuper = await checkIsSuperAdmin(req.user);
        if (!isSuper) {
            return res.status(403).json({ message: "শুধুমাত্র সুপার অ্যাডমিন (Super Admin) সকল অ্যাডমিনদের তালিকা দেখতে পারেন।" });
        }

        const result = await db.query(`
            SELECT id, name, emailid, contactnumber, role, is_super_admin, lastlogin, activestatus
            FROM admin
            ORDER BY id ASC
        `);

        res.json({
            isSuperAdmin: true,
            admins: result.rows || []
        });
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ message: "অ্যাডমিন তালিকা আনতে সমস্যা হয়েছে।" });
    }
};

// POST /api/admin/create-admin (Super Admin only)
exports.createAdmin = async (req, res) => {
    try {
        const isSuper = await checkIsSuperAdmin(req.user);
        if (!isSuper) {
            return res.status(403).json({ message: "শুধুমাত্র সুপার অ্যাডমিন নতুন অ্যাডমিন তৈরি করতে পারেন।" });
        }

        const { name, emailid, contactnumber, password, role } = req.body;

        if (!name || !emailid || !password) {
            return res.status(400).json({ message: "অ্যাডমিনের নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক।" });
        }

        // Check if email already exists
        const exists = await db.query("SELECT emailid FROM admin WHERE emailid = $1", [emailid.trim().toLowerCase()]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ message: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাডমিন অ্যাকাউন্ট রয়েছে।" });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const assignedRole = role || "admin";

        await db.query(`
            INSERT INTO admin (name, emailid, contactnumber, password, role, is_super_admin, activestatus)
            VALUES ($1, $2, $3, $4, $5, FALSE, 1)
        `, [
            name.trim(),
            emailid.trim().toLowerCase(),
            contactnumber ? contactnumber.trim() : null,
            hashedPassword,
            assignedRole
        ]);

        res.status(201).json({ message: "নতুন অ্যাডমিন সফলভাবে তৈরি করা হয়েছে।" });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "অ্যাডমিন তৈরি করতে সমস্যা হয়েছে।" });
    }
};

// PUT /api/admin/update-admin-role/:id (Super Admin only)
exports.updateAdminRole = async (req, res) => {
    try {
        const isSuper = await checkIsSuperAdmin(req.user);
        if (!isSuper) {
            return res.status(403).json({ message: "শুধুমাত্র সুপার অ্যাডমিন অ্যাডমিনের রোল পরিবর্তন করতে পারেন।" });
        }

        const { id } = req.params;
        const { role, name, contactnumber } = req.body;

        // Check target admin
        const targetRes = await db.query("SELECT * FROM admin WHERE id = $1", [id]);
        if (!targetRes.rows.length) {
            return res.status(404).json({ message: "অ্যাডমিন পাওয়া যায়নি।" });
        }

        const target = targetRes.rows[0];

        // PROTECT SUPER ADMIN ACCOUNT
        if (target.is_super_admin || target.emailid === "psayem0@gmail.com") {
            if (role && role !== "super_admin") {
                return res.status(403).json({ message: "সুপার অ্যাডমিন অ্যাকাউন্ট কোনোভাবেই পরিবর্তন বা ডিমোট করা যাবে না। এটি আজীবন সংরক্ষিত।" });
            }
        }

        await db.query(`
            UPDATE admin
            SET role = COALESCE($1, role),
                name = COALESCE($2, name),
                contactnumber = COALESCE($3, contactnumber)
            WHERE id = $4
        `, [
            role || target.role,
            name ? name.trim() : target.name,
            contactnumber ? contactnumber.trim() : target.contactnumber,
            id
        ]);

        res.json({ message: "অ্যাডমিনের তথ্য ও রোল সফলভাবে আপডেট হয়েছে।" });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ message: "অ্যাডমিন রোল আপডেট করতে সমস্যা হয়েছে।" });
    }
};

// DELETE /api/admin/delete-admin/:id (Super Admin only)
exports.deleteAdmin = async (req, res) => {
    try {
        const isSuper = await checkIsSuperAdmin(req.user);
        if (!isSuper) {
            return res.status(403).json({ message: "শুধুমাত্র সুপার অ্যাডমিন অ্যাডমিন ডিলিট করতে পারেন।" });
        }

        const { id } = req.params;

        const targetRes = await db.query("SELECT * FROM admin WHERE id = $1", [id]);
        if (!targetRes.rows.length) {
            return res.status(404).json({ message: "অ্যাডমিন পাওয়া যায়নি।" });
        }

        const target = targetRes.rows[0];

        // STRICT PROTECTION FOR SUPER ADMIN
        if (target.is_super_admin || target.emailid === "psayem0@gmail.com") {
            return res.status(403).json({
                message: "নিষেধাজ্ঞা: এটি সুপার অ্যাডমিন (Md Sayem Parvez) এর অ্যাকাউন্ট! সুপার অ্যাডমিনকে কোনোভাবেই ডিলিট করা সম্ভব নয়।"
            });
        }

        await db.query("DELETE FROM admin WHERE id = $1", [id]);

        res.json({ message: "অ্যাডমিন সফলভাবে ডিলিট করা হয়েছে।" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "অ্যাডমিন ডিলিট করতে সমস্যা হয়েছে।" });
    }
};
