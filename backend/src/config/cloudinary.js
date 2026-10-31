const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "b6ybjiaf",
    api_key: process.env.CLOUDINARY_API_KEY || "893996549676673",
    api_secret: process.env.CLOUDINARY_API_SECRET || "Hat4KL5oUNXrni8hCdL9S8DcSxc",
    secure: true
});

/**
 * Upload a local file to Cloudinary with automatic optimization.
 * Cleans up the local temporary file after upload.
 * 
 * @param {string} localFilePath - Absolute or relative path to the local uploaded file.
 * @param {string} folder - Folder name in Cloudinary (e.g. 'students', 'teachers', 'cms', 'admin').
 * @param {object} customOptions - Extra options for cloudinary uploader.
 * @returns {Promise<string>} - Resolves with the secure HTTPS Cloudinary URL.
 */
const uploadFileToCloudinary = async (localFilePath, folder = "general", customOptions = {}) => {
    if (!localFilePath) return null;

    const { keepLocal = true, timeoutMs = 12000, ...restOptions } = customOptions;

    try {
        const uploadPromise = cloudinary.uploader.upload(localFilePath, {
            folder: `dimla_school/${folder}`,
            use_filename: true,
            unique_filename: true,
            resource_type: "auto",
            transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1200, crop: "limit" }
            ],
            ...restOptions
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Cloudinary upload timed out")), timeoutMs)
        );

        const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);

        // Safely remove the local temporary file only if keepLocal is false
        if (!keepLocal) {
            try {
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } catch (cleanupErr) {
                console.warn("Temporary file cleanup warning:", cleanupErr.message);
            }
        }

        return uploadResult.secure_url;
    } catch (err) {
        console.warn("Cloudinary upload notice (safe local fallback):", err.message);
        return null;
    }
};

/**
 * Upload a buffer directly to Cloudinary (e.g. from memoryStorage).
 */
const uploadBufferToCloudinary = (buffer, folder = "general", customOptions = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `dimla_school/${folder}`,
                resource_type: "auto",
                transformation: [
                    { quality: "auto", fetch_format: "auto" },
                    { width: 1200, crop: "limit" }
                ],
                ...customOptions
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary stream upload error:", error);
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

module.exports = {
    cloudinary,
    uploadFileToCloudinary,
    uploadBufferToCloudinary
};
