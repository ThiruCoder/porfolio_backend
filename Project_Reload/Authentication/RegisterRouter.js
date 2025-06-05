import { authModel } from './AuthSchema.js'
import * as bcrypt from 'bcryptjs'

const Registration = async (req, res) => {
    console.log(req.body);

    try {
        const { username, email, password, role } = req.body && req.body.newFormItems;
        if (!username || !email || !password) {
            return res.status(401).json({
                success: false,
                message: 'Username, email or password are not specified!'
            })
        }
        const registerAuth = await authModel.findOne({ $or: [{ email }] })
        if (registerAuth) {
            return res.status(401).json({
                message: 'Username or Password is already existed, please try another crediantials',
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const createRegister = await authModel.create({ username: username, email: email, password: hashPassword, role: role || 'user' });

        if (!hashPassword) {
            return res.status(404).json({
                message: 'Password is invalid, please try again later',
                success: false
            })
        }

        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        if (!jwtSecretKey) {
            return res.status(404).json({
                message: 'Server error: TOKEN_ID is missing in .env',
                success: false
            })
        }

        const createToken = jwt.sign({
            username: username,
            role: role || 'user',
            loggedIn: true
        },
            jwtSecretKey,
            { expiresIn: '7d' },
        )
        res.cookie("token", createToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            sameSite: "Strict",
        });
        return res.status(201).json({
            data: createRegister,
            success: true,
            message: 'Successfully created an new register.'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong, please try again!',
            success: false
        })
    }
}

export { Registration }