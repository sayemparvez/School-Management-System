const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const cmsController = require("../controllers/cmsController");

/* Multer Setup */

const uploadDir = "uploads/admin";
const cmsUploadDir = "uploads/cms";

// Ensure upload directories exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(cmsUploadDir)) {
    fs.mkdirSync(cmsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Temporary filename — controller will rename to admin.<ext>
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
});

const cmsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, cmsUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "cms-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const cmsUpload = multer({
    storage: cmsStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* Routes */

router.get(
    "/profile",
    authMiddleware,
    adminController.getAdminProfile
);

router.put(
    "/profile",
    authMiddleware,
    upload.single("logo"),
    adminController.updateAdminProfile
);

/* Website CMS Routes */
router.get("/cms", authMiddleware, cmsController.getCMSContent);
router.post("/cms/update", authMiddleware, cmsController.updateCMSSection);
router.post("/cms/upload", authMiddleware, cmsUpload.any(), (req, res) => {
    req.file = req.files && req.files.length > 0 ? req.files[0] : req.file;
    cmsController.uploadCMSMedia(req, res);
});

/* Super Admin Routes */
router.get("/all-admins", authMiddleware, adminController.getAllAdmins);
router.post("/create-admin", authMiddleware, adminController.createAdmin);
router.put("/update-admin-role/:id", authMiddleware, adminController.updateAdminRole);
router.delete("/delete-admin/:id", authMiddleware, adminController.deleteAdmin);

module.exports = router;