import path from "path";
import { PDF } from "./middleware/DocsSchema.js";
import fs from 'fs'

const deletePdf = async (req, res) => {
    try {
        const pdf = await PDF.findOne();
        if (!pdf) {
            return res.status(404).json({ message: 'No PDF found to delete' });
        }

        // Delete file from filesystem
        fs.unlink(pdf.path, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }

            // Delete from database
            await PDF.deleteOne({ _id: pdf._id });
            res.json({ message: 'PDF deleted successfully' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting PDF', error: err.message });
    }
};

export default deletePdf