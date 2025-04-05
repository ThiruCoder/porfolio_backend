import mongoose from "mongoose";


const pdfSchema = new mongoose.Schema({
    title: String,
    cloudinaryId: String,
    url: String,
    thumbnailUrl: String, // For preview
    pageCount: Number,
    pages: [{
        pageNumber: Number,
        pageUrl: String,
        thumbnailUrl: String
    }],
    createdAt: { type: Date, default: Date.now }
});

const PDF = mongoose.model('pdf', pdfSchema)

export { PDF }