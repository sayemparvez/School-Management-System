const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const { uploadFileToCloudinary } = require("../config/cloudinary");

// Fetch all website CMS content
exports.getCMSContent = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT section, data, updated_at FROM website_cms");
        const cmsData = {};
        rows.forEach(r => {
            cmsData[r.section] = r.data;
        });
        res.json({ success: true, data: cmsData });
    } catch (err) {
        console.error("getCMSContent error:", err.message);
        res.status(500).json({ success: false, message: "Failed to load website content" });
    }
};

// Update a specific section in CMS
exports.updateCMSSection = async (req, res) => {
    try {
        const { section, data } = req.body;
        if (!section || !data) {
            return res.status(400).json({ success: false, message: "Section and data are required." });
        }

        await pool.query(`
            INSERT INTO website_cms (section, data, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (section) 
            DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
        `, [section, JSON.stringify(data)]);

        res.json({ success: true, message: `Section '${section}' updated successfully.` });
    } catch (err) {
        console.error("updateCMSSection error:", err.message);
        res.status(500).json({ success: false, message: "Failed to save changes" });
    }
};

// Upload media file for CMS directly to Cloudinary (with safe local fallback)
exports.uploadCMSMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided." });
        }
        
        // Upload directly to Cloudinary (optimized to ~1.3s due to client-side compression)
        const cloudUrl = await uploadFileToCloudinary(req.file.path, "cms", { keepLocal: true, timeoutMs: 12000 });
        const finalUrl = cloudUrl || `/uploads/cms/${req.file.filename}`;

        res.json({ success: true, url: finalUrl, isCloud: !!cloudUrl });
    } catch (err) {
        console.error("uploadCMSMedia error:", err.message);
        res.status(500).json({ success: false, message: "File upload failed" });
    }
};
