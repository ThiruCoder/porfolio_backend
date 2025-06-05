// import express from 'express'
// import ProjectModel from '../ProjectSchema.js';
// import { uploads } from './uploadImage.js'
// import { uploadFile } from './cloudinaryUpload.js';
// import { router } from '../pdfOrFile/DocumentRoute.js'

// const projectRoute = express.Router()

// projectRoute.post('/detail', uploads.single('image'), async (req, res) => {
//     const { title, description, url, status, tags } = req.body;

//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'File is required. Please upload an image.'
//             })
//         }

//         // ✅ Check if all required fields are present
//         if (!title || !description || !url || !status) {
//             return res.status(400).json({
//                 message: "Missing required fields: title, description, url, status.",
//                 success: false
//             });
//         }
//         // console.log('req.file', req.file.path);
//         // console.log(req.file.path);

//         // const { Image_url, publicId } = await uploadFile(req.body.image)
//         const { result } = await uploadFile(req.file.path)
//         const { display_name, secure_url, public_id } = result;

//         if (!Array.isArray(tags)) {
//             return res.status(400).json({ error: "Tags must be an array" });
//         }

//         // Process tags (optional)
//         const cleanTags = [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];

//         const projectDetails = await ProjectModel.create({
//             title: title,
//             description: description,
//             url: url,
//             status: status,
//             tags: cleanTags,
//             image: {
//                 name: display_name,
//                 url: secure_url,
//                 public_id: public_id
//             }
//         })
//         return res.status(201).json({
//             data: projectDetails,
//             message: 'Successfully submitted the data.',
//             success: true
//         })
//     } catch (error) {
//         console.log('Error with 500', error);
//         new Error(`New error found is project creation : ${error}`);
//         return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
//     }

// })

// projectRoute.get('/get', async (req, res) => {
//     try {
//         const projectData = await ProjectModel.find({});
//         console.log('projectData', projectData);

//         if (!projectData || projectData.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No projects found.'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: projectData,
//             message: 'Projects retrieved successfully.'
//         });
//     } catch (error) {
//         console.error('Error while fetching projects:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error. Could not fetch projects.'
//         });
//     }
// });



// projectRoute.get('/getById/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const projectData = await ProjectModel.find({ _id: id })
//         return res.status(200).json({
//             data: projectData,
//             message: 'Data is successfully parsed.'
//         })
//     } catch (error) {
//         console.log('Error with 500', error);
//         new Error(`New error found on project parsing : ${error}`);
//         return res.status(500).json({ success: false, message: 'Something went wrong, the data is not fetching' });
//     }
// })



// export { projectRoute }