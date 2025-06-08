import { v2 as cloudinary } from 'cloudinary'
import dot from 'dotenv';
dot.config();


// Configure Cloudinary for PDF uploads
export const uploadPDFToCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const options = {
        resource_type: 'auto',
        format: 'pdf',
        pages: true, // Extracts pages for preview
        pdf: {
            flags: 'layer_apply' // Preserves document structure
        }
    };

    return await cloudinary.uploader.upload(filePath, options);
};

