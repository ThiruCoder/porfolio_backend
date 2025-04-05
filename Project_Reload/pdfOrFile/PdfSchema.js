// models/Document.js
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    file: {
        public_id: String,
        url: String,
        format: String,
        size: Number
    },
    category: {
        type: String,
        enum: ['contract', 'report', 'invoice', 'other'],
        default: 'other'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });
const pdfScheme = mongoose.model('Document', DocumentSchema);

export { pdfScheme } 