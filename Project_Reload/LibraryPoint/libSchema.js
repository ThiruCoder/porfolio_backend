import mongoose from 'mongoose'

const LibSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [5, 'Minimum length is 5'],
        maxLength: [100, 'Maximum length is 100'],
        trim: true,
    },
    description: {
        type: String,
        minLength: [5, 'Minimum length is 5'],
        maxLength: [600, 'Maximum length is 600'],
        trim: true,
    },
    url: String
}, { timestamps: true })

const LibModel = mongoose.model('lib', LibSchema)

export { LibModel }