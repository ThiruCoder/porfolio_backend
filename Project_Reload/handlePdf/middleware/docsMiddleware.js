import { PDF } from "./DocsSchema.js";

import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url';

const ensureSinglePDF = async (req, res, next) => {
    try {
        const count = await PDF.countDocuments();
        if (count >= 1) {
            return res.status(400).json({ message: 'Only one PDF is allowed. Please delete the existing PDF first.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export default ensureSinglePDF

const uploadDir = 'pdf'
// Ensure upload directory exists
try {
    fs.ensureDirSync(uploadDir);
    console.log(`Upload directory created at: ${path.resolve(uploadDir)}`);
} catch (err) {
    console.error('Error creating upload directory:', err);
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, uploadDir))
    },
    filename: (req, file, cb) => {
        // Generate more secure filename using UUID
        const fileExt = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${fileExt}`;
        cb(null, uniqueName);
    }
});

// Enhanced file filter with better error messages
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only PDF files are allowed. Received: ${file.mimetype}`), false);
    }
};

// Configure multer with additional options
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1 // Limit to single file uploads
    },
    fileFilter,
    onError: (err, next) => {
        console.error('Multer error:', err);
        next(err);
    }
});

// Cleanup function to remove temporary files
const cleanupUploads = async (filePath) => {
    try {
        if (filePath) {
            await fs.unlink(filePath);
            console.log(`Temporary file cleaned up: ${filePath}`);
        }
    } catch (err) {
        console.error('Error cleaning up temporary file:', err);
    }
};

export { upload, cleanupUploads };