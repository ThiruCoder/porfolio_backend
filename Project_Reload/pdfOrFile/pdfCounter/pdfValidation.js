import { pdfModel } from "./storingPdf.js"


export const PDFValidation = async (req, res, next) => {
    const pdfData = await pdfModel.aggregate([
        { $count: "title" }
    ])


    try {
        if (pdfData < 1) {
            res.status(404).json({
                message: 'Only one PDF is accepted!',
                success: false
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong! please try again later.'
        })
        console.log("PDFValidation error : ", error);

    }

}