import mongoose from 'mongoose'

const pdfSchema = new mongoose.Schema({
    title: String,
    pdf: {
        type: String,

    }
})

const pdfModel = mongoose.model('pdfDetails', pdfSchema)

export { pdfModel }