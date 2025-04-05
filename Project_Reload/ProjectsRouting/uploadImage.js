import multer from 'multer'
import ProjectModel from '../ProjectSchema.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },

})
const filterTheFile = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Not an image! Please upload only images.'))

    }
}

const uploads = multer({
    storage: storage,
    fileSize: 5 * 1024 * 1024,
    limits: {
        fileFilter: filterTheFile,
    }
})


export { uploads }