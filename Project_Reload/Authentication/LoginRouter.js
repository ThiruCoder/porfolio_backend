import { authModel } from "./AuthSchema.js";
import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Authentication = async (req, res) => {
    try {

        const { username, password } = req.body;
        console.log('LoginFormData', username, password);

        if (!username || !password) {
            return res.status(401).json({
                success: false,
                message: 'Username or password is not specified!'
            })
        }
        const user = await authModel.findOne({ username })

        const passwordReveal = await bcrypt.compare(password, user.password)
        if (!passwordReveal) {
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
            userId: user._id,
            username: username,
            role: user.role,
            loggedIn: true
        },
            jwtSecretKey,
            { expiresIn: '1d' },
        )
        res.cookie("token", createToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            path: '/'
        });
        console.log(createToken);

        return res.status(201).json({
            token: createToken,
            username: username,
            loggedIn: true,
            success: true,
            message: 'Successfully logged in'
        })

    } catch (error) {
        console.log('login Error', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again!'
        })
    }
}

export { Authentication }