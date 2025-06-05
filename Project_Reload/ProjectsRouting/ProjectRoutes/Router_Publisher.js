import express from 'express';
import { createProject, deleteProject, getProject, getProjectById, updateById } from './Publisher.js';
import { uploads } from '../uploadImage.js';
import { VerifyToken } from '../../Middlewares/LoginVerifyToken.js';

const projectRouter = express.Router();

projectRouter.get('/get', getProject);
projectRouter.post('/createProject', VerifyToken, uploads.single('image'), createProject);
projectRouter.delete('/deleteProject/:id', VerifyToken, deleteProject)
projectRouter.get('/getProjectById/:id', getProjectById)
projectRouter.put('/updateById/:id', VerifyToken, updateById)

export { projectRouter }