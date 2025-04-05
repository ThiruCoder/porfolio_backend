// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


export const uploadToCloudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw',
            folder: 'pdf_uploads',
            allowed_formats: ['pdf'],
            format: 'pdf',
            type: 'upload',  // Explicitly set to public upload
            use_filename: true, // Keep original filename
            unique_filename: false,
            content_disposition: 'attachment',
            pages: true, // Extracts pages for preview
            pdf: {
                flags: 'layer_apply' // Preserves document structure
            }
        })
        console.log('Cloudinary upload result:', result);
        await fs.promises.unlink(filePath);
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        await fs.promises.unlink(filePath).catch(unlinkError => {
            console.error('Error deleting local file:', unlinkError);
        });
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

// module.exports = { uploadToCloudinary, deleteFromCloudinary };