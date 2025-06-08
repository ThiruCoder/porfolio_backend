import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary, uploadFile } from '../cloudinaryUpload.js';
import ProjectModel from '../../ProjectSchema.js';

const createProject = async (req, res) => {
    let { name, description, url, status, tags, priority } = req.body;
    const { role } = req.userInfo;
    console.log('req.body', req.body, req.file)
    try {
        if (role !== 'admin') {
            return res.status(401).json({
                message: 'Unauthorized - Only admin can access.',
                success: false
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.'
            })
        }

        // ✅ Check if all required fields are present
        if (!name || !description || !url || !status || !tags) {
            return res.status(400).json({
                message: "Missing required fields: name, description, url, status, tag.",
                success: false
            });
        }

        const { result } = await uploadFile(req.file.path);

        const { secure_url, public_id, original_filename } = result;

        try {
            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            }
        } catch (err) {
            return res.status(400).json({ error: 'Invalid tags format' });
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({ error: "Tags must be an array" });
        }

        // Process tags (optional)
        const cleanTags = [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];

        const projectDetails = await ProjectModel.create({
            title: name,
            description: description,
            status: status || 'In Progress',
            url: url,
            image: {
                name: original_filename,
                url: secure_url,
                public_id: public_id
            },
            tags: cleanTags || [],
            priority: priority || 'Medium'
        })
        if (!projectDetails) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const filePath = path.join(__dirname, 'uploads', original_filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Failed to deleted the file ', err);
                } else {
                    console.log('Successfully deleted the file')
                }
            });
            console.log('The data is not submitted')
            return res.status(403).json({
                success: false,
                message: 'The data is not submitted'
            })
        }

        return res.status(201).json({
            data: projectDetails,
            message: 'Successfully submitted the data.',
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });

    }

};

const getProject = async (req, res) => {
    try {
        const projectData = await ProjectModel.find({});
        return res.status(200).json({
            data: projectData,
            message: 'Data is successfully parsed.'
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    const { role } = req.userInfo

    try {
        if (role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Admin only can acess'
            })
        }
        if (!id) {
            console.log('Id must be required')
            return res.status(404).json({
                success: false,
                message: 'Id must be required'
            })
        }
        const deletedById = await ProjectModel.findByIdAndDelete(id);
        if (!deletedById) {
            console.log('Failed to deleted the file.')
            return res.status(404).json({
                success: false,
                message: 'Failed to deleted the file.'
            })
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const { fileName, url, public_id } = deletedById.image;
        const extension = url.split('.').pop();

        const filePath = path.join(__dirname, 'uploads', `${fileName}.${extension}`);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('Failed to deleted the file.', err)
            } else {
                console.log('Successfully deleted the file.')
            }
        });

        cloudinary.uploader.destroy(public_id, (err, result) => {
            if (err) {
                console.log('Cloudinary deletion error', err)
            } else {
                console.log('Cloudinary deletion success', result)
            }
        })

        return res.status(200).json({
            data: deletedById,
            success: true,
            message: 'Successfully deleted the project data.'
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
    }
}

const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'ID is required.'
            })
        }
        const project = await ProjectModel.findById(id);
        if (!project) {
            return res.status(403).json({
                success: false,
                message: 'Data is not fetched.'
            })
        }
        return res.status(200).json({
            data: project,
            success: true,
            message: 'Successfully fetched the data.'
        })
    } catch (error) {
        console.log('Error with 500', error);
        return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
    }
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const { name, description, status, priority, tags } = req.body;

    const newData = await ProjectModel.findByIdAndUpdate(id, {
        title: name,
        description,
        status,
        priority,
        tags
    }, { new: true })
    if (!newData) {
        return res.status(400).json({
            message: 'Not updated the data.',
            success: false
        })
    }
    return res.status(201).json({
        data: newData,
        message: 'Successfully updated the data.',
        success: true
    })

}

export { getProject, createProject, deleteProject, getProjectById, updateById }