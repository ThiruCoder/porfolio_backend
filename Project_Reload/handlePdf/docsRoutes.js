
import express from 'express'
import getDocs from './getDocs.js'
import uploadFile from './docsUpload.js'
import deletePdf from './delete.js'
import upload from './middleware/docsConfig.js'
import ensureSinglePDF from './middleware/docsMiddleware.js'

const router = express.Router()

router.post('/upload', ensureSinglePDF, upload.single('pdf'), uploadFile)
router.post('/get', getDocs)
router.delete('/delete', deletePdf)

export default router

