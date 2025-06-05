import express from 'express';
import { createResume, getResume, getResumeById, sendMail, updateById } from './publisher.js';
import { VerifyToken } from '../../Middlewares/LoginVerifyToken.js';
import { TokenVerify } from '../../Middlewares/Auth_middleware.js';

const resumeRouter = express.Router();

resumeRouter.get('/getResume', getResume);
resumeRouter.get('/getResumeById/:id', getResumeById);
resumeRouter.post('/createResume', createResume);
resumeRouter.put('/updateById/:id', updateById);
resumeRouter.post('/sendMail', sendMail);
// resumeRouter.delete('/deleteProject/:id', VerifyAdminOrUser, deleteProject)

export { resumeRouter }