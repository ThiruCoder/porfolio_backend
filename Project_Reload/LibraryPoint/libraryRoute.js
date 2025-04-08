import express from 'express'
import { LibModel } from './libSchema.js';

const libRoute = express.Router()

libRoute.post('/uploadLib', async (req, res) => {
    console.log('req.body', req.body);

    try {
        const { title, description, url } = req.body;
        if (!title || !description) {
            return res.status(401).json({
                message: 'Title and description is required!',
                success: false
            })
        }
        const checkItems = await LibModel.findOne({ title: title, description: description })
        if (checkItems) {
            return res.status(402).json({
                message: `Tile or description is already available!, ${title}`,
                success: false
            })
        }
        const createInDB = await LibModel.create({
            title: title,
            description: description,
            url: url
        })
        return res.status(201).json({
            data: createInDB,
            message: 'Successfully created the data.',
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something weent wrong! please try again.',
            success: false
        })
    }

})

libRoute.get('/getLib', async (req, res) => {
    try {
        const getData = await LibModel.find({})
        res.status(201).json({
            data: getData,
            message: 'Successfully got all library data.',
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something weent wrong! please try again.',
            success: false
        })
    }

})

export { libRoute }