import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'

const Transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendUserRequest = async (from, subject, text, html) => {
    try {
        const sendMail = await Transporter.sendMail({
            from,
            to: process.env.EMAIL_USERNAME,
            subject,
            text,
            html
        })
        console.log('Transporter', sendMail)
        return sendMail;
    } catch (error) {
        console.error("Failed to send email:", error.message);
        throw new Error("Email sending failed");
    }
}

export { sendUserRequest }