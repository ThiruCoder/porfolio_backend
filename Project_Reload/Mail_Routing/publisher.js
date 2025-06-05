import { sendUserRequest } from "../utils/mailConfig.js";


const sendMail = async (req, res) => {
    const { email, name, message } = req.body;
    const mail = 'charipallithirumalesh@gmail.com'
    console.log('req.body', req.body)
    try {
        if (!email) {
            return res.status(403).json({
                message: "Message is required.",
                success: 'false'
            })
        }
        const sendMail = await sendUserRequest(
            email,
            `The User send you a message.`,
            `<h1>Mail from ${mail}</h1>`,
            `<h2>Mail from ${mail}</h2>
            <h2>Name: ${name}: </h2>
            <h4>${message}</h4>
            `
        );
        return res.status(200).json({
            data: sendMail,
            message: 'Message is successfully send.',
            success: true
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: err,
            message: 'Failed to send message.',
            success: false
        });
    }

}

export { sendMail }