import express from 'express'
import { uploadPDFToCloudinary } from './middleware/docsConfig.js';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from './middleware/docsMiddleware.js';
import { PDF } from './middleware/DocsSchema.js';
// Get basic preview (first page thumbnail)
import dot from 'dotenv';
dot.config();
const router = express.Router()

router.post('/upload-with-preview', upload.single('pdf'), async (req, res) => {
    console.log(req.file);

    try {
        // 1. Upload original PDF
        const pdfResult = await uploadPDFToCloudinary(req.file.path);

        // 2. Generate preview thumbnails
        const previewOptions = {
            transformation: [
                { width: 300, height: 400, crop: 'fit', format: 'jpg', page: '1' }
            ]
        };

        const previewUrl = cloudinary.url(pdfResult.public_id, previewOptions);

        // 3. Extract all pages for multi-page preview
        const pageUrls = [];
        for (let i = 1; i <= pdfResult.pages; i++) {
            pageUrls.push({
                pageNumber: i,
                pageUrl: cloudinary.url(pdfResult.public_id, {
                    format: 'jpg',
                    page: i,
                    flags: 'splits'
                }),
                thumbnailUrl: cloudinary.url(pdfResult.public_id, {
                    width: 150,
                    height: 200,
                    crop: 'fit',
                    format: 'jpg',
                    page: i
                })
            });
        }

        // 4. Save to MongoDB
        const pdfDoc = new PDF({
            title: req.file.originalname,
            cloudinaryId: pdfResult.public_id,
            url: pdfResult.secure_url,
            thumbnailUrl: previewUrl,
            pageCount: pdfResult.pages,
            pages: pageUrls
        });

        await pdfDoc.save();

        res.status(201).json({
            message: 'PDF uploaded with preview',
            document: {
                id: pdfDoc._id,
                mainUrl: pdfResult.secure_url,
                preview: previewUrl,
                pages: pageUrls.map(p => ({
                    number: p.pageNumber,
                    thumbnail: p.thumbnailUrl,
                    fullPage: p.pageUrl
                }))
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'PDF processing failed' });
    }
});

router.get('/preview/:id', async (req, res) => {
    console.log(req.params.id);

    try {
        const pdf = await PDF.findById(req.params.id);
        if (!pdf) return res.status(404).json({ error: 'PDF not found' });

        res.json({
            title: pdf.title,
            thumbnail: pdf.thumbnailUrl,
            fullDocument: pdf.url
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get multi-page preview
router.get('/full-preview/:id', async (req, res) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        if (!pdf) return res.status(404).json({ error: 'PDF not found' });

        res.json({
            title: pdf.title,
            pageCount: pdf.pageCount,
            pages: pdf.pages.map(page => ({
                number: page.pageNumber,
                thumbnail: page.thumbnailUrl,
                fullPage: page.pageUrl
            })),
            downloadUrl: pdf.url
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export { router }