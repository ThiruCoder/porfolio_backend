import express from 'express';
import { sendMail } from './publisher.js';

const sendMailRouter = express.Router();

sendMailRouter.post('/mail', sendMail);

export { sendMailRouter }