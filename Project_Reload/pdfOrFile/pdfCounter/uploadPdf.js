import multer from "multer";
import { pdfModel } from "./storingPdf.js";
import express from 'express';
import { fileURLToPath } from 'url'
import path from "path";
import { PDFValidation } from "./pdfValidation.js";
import fs from "fs";

const pdfRouter = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './pdfs'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

pdfRouter.post('/uploadfpdf', PDFValidation, upload.single('file'), async (req, res) => {

    try {

        const { title } = req.body
        const filename = req.file.filename
        if (!filename || !title) {
            return res.status(404).json({
                message: 'Title and pdf is required!',
                success: false
            })
        }

        const formData = await pdfModel.create({
            title: title,
            pdf: filename,
        })

        return res.status(201).json({
            data: formData,
            message: 'Successfully created pdf data',
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong, Please try again later.',
            success: false
        })
    }
})


pdfRouter.get('/getPdf', async (req, res) => {
    try {
        const pdfData = await pdfModel.find({})
        return res.status(200).json({
            data: pdfData,
            message: 'Successfully found all data.',
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something weent wrong! please try again later.',
            success: false
        })
    }
})

pdfRouter.delete('/deletePdf/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        if (!id) {
            return res.status(404).json({
                message: 'Id is not found, please try with id',
                success: false
            })
        }
        const findById = await pdfModel.findById(id);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);


        if (!findById) {
            throw new Error('PDF record not found in database');
        }


        const pdfPath = path.join(
            __dirname,
            'pdfs',
            findById.pdf
        );


        try {
            await fs.promises.access(pdfPath, fs.constants.F_OK);
        } catch (err) {
            console.error('PDF file not found at:', pdfPath);
            throw new Error('PDF file not found on server');
        }

        try {
            // Delete file first
            await fs.promises.unlink(pdfPath);
            console.log('Successfully deleted PDF file:', pdfPath);

            // Then delete database record
            const deletedItem = await pdfModel.findByIdAndDelete(id);
            return res.status(201).json({
                data: deletedItem,
                message: 'Successfully deleted the data.',
                success: true
            })
        } catch (err) {
            console.error('Error during deletion:', err);
            throw err;
        }


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Something went wrong please try again.',
            success: false
        })
    }
})

export { pdfRouter }
