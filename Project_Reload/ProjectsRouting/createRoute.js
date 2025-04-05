import express from 'express'
import ProjectModel from '../ProjectSchema.js';
import { uploads } from './uploadImage.js'
import { uploadFile } from './cloudinaryUpload.js';
import { router } from '../pdfOrFile/DocumentRoute.js'

const projectRoute = express.Router()

projectRoute.post('/detail', uploads.single('image'), async (req, res) => {
    const { title, description, url, status } = req.body;

    // console.log('req.file', req.file);
    // console.log('req.body', req.body);


    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.'
            })
        }
        // console.log('req.file', req.file.path);
        // console.log(req.file.path);

        // const { Image_url, publicId } = await uploadFile(req.body.image)
        const { result } = await uploadFile(req.file.path)
        const { display_name, secure_url, public_id } = result;

        const passtodb = await ProjectModel.create({
            title: title,
            description: description,
            url: url,
            status: status,
            image: {
                name: display_name,
                url: secure_url,
                public_id: public_id
            }
        })
        res.status(201).json({
            data: passtodb,
            message: 'success'
        })

        // ✅ Check if all required fields are present
        if (!title || !description || !url || !status) {
            return res.status(400).json({
                message: "Missing required fields: title, description, url, status.",
                success: false
            });
        }



        const projectDetails = await ProjectModel.create({ title: title, description: description, url: url, status: status, image: [Image_url, publicId] });
        res.status(201).json({
            data: projectDetails,
            message: 'Successfully submitted the data.',
            success: true
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Someething went wrong! Please try again later.' });
    }

})

projectRoute.get('/get', async (req, res) => {
    const projectData = await ProjectModel.find({})
    res.status(201).json({
        data: projectData,
        message: 'Data is successfully parsed.'
    })
})

export { projectRoute }