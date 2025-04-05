// routes/documentRoutes.js
import express from 'express'
import multer from 'multer';
// import { upload } from './ResumeCloudinary.js';
import { pdfScheme } from './PdfSchema.js';
import { AuthMiddleware } from '../Middlewares/Auth_middleware.js';
import { AdminMiddleware } from '../Middlewares/Admin_middleare.js';
import fs from 'fs-extra'
import { deleteFromCloudinary, uploadToCloudinary } from './CloudinaryConfig.js'
import { upload, cleanupUploads } from './ResumeCloudinary.js'
import { fileURLToPath } from 'url'
import path from 'path'
const router = express.Router();



// @route   POST api/documents
// @desc    Upload a PDF document
// @access  Private
router.post('/upload', AuthMiddleware, upload.single('file'), async (req, res) => {
    console.log('req.file', req.file);
    console.log('req.body', req.body);
    // console.log('req.userInfo', req.userInfo);


    const { title, description, category } = req.body;
    const { username } = req.userInfo

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            });
        }
        // console.log(title, description);

        if (!title || !description) {
            await fs.unlink(req.file.path).catch(console.error);
            res.status(400).json({
                message: 'title or description is required',
                success: false
            })
        }
        if (req.file.mimetype !== 'application/pdf') {
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed'
            });
        }
        // Upload to Cloudinary
        const { public_id, secure_url, resource_type, format, bytes, type, original_filename } = await uploadToCloudinary(req.file.path);
        console.log('public_id,url,format,bytes', public_id, secure_url, resource_type, type && format);


        // Create document in database
        const pdfDocument = await pdfScheme.create({
            title: title,
            description: description,
            category: category || 'other',
            file: {
                public_id: public_id,
                url: secure_url,
                format: type,
                size: bytes,
                pages: await getPdfPageCount(req.file.path)  // Optional: add page count
            },
            uploadedBy: username,

        });
        res.status(201).json({
            data: pdfDocument,
            message: 'Succeessfully submitted the data.',
            success: true
        })
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, 'pdf', `${original_filename}.pdf`);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error("Delete failed:", err);
                else console.log("Deleted:", `${original_filename}.pdf`);
            });
        } else {
            console.log("File not found, skip delete:", filePath);
        }

    } catch (err) {
        console.error('Upload error:', err);

        // Clean up temp file if it exists
        // if (req.file?.path) {
        //     await fs.unlink(req.file.path).catch(console.error);
        // }

        // Delete from Cloudinary if upload succeeded but DB failed
        // if (err?.document?.file?.public_id) {
        //     await cloudinary.uploader.destroy(err.document.file.public_id, {
        //         resource_type: 'raw'
        //     }).catch(console.error);
        // }

        res.status(500).json({
            success: false,
            message: 'Error processing PDF upload',
        });
    }
});

async function getPdfPageCount(filePath) {
    try {
        const pdf = await PDFDocument.load(await fs.readFile(filePath));
        return pdf.getPageCount();
    } catch {
        return null;  // Silently fail if we can't get page count
    }
}

// @route   GET api/documents
// @desc    Get all documents
// @access  Private
router.get('/getfile', async (req, res) => {
    try {
        // const documents = await pdfScheme.find({ user: req.user.id }).sort('-uploadedAt');
        const documents = await pdfScheme.find({})
        res.status(201).json({
            data: documents,
            message: 'Successfully get data',
            success: true
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: 'Some thing went wrong!',
            success: false
        })
    }
});

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private

// router.delete('deletefile/:id', AuthMiddleware, AdminMiddleware, async (req, res) => {
//     try {
//         const document = await pdfScheme.findOne({
//             _id: req.params.id,
//             user: req.user.id
//         });

//         if (!document) {
//             return res.status(404).json({ msg: 'Document not found' });
//         }

//         // Delete from Cloudinary first
//         await cloudinary.uploader.destroy(document.file.public_id, { resource_type: 'raw' });

//         // Then delete from MongoDB
//         await document.remove();

//         res.json({ msg: 'Document removed' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

export { router };