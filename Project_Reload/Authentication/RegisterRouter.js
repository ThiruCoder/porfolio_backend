import { authModel } from './AuthSchema.js'
import * as bcrypt from 'bcryptjs'

const Registration = async (req, res) => {
    console.log(req.body);

    try {
        const { username, email, password, role } = req.body && req.body.newFormItems;
        if (!username || !email || !password) {
            res.status(401).json({
                success: false,
                message: 'Username, email or password are not specified!'
            })
        }
        const registerAuth = await authModel.findOne({ $or: [{ username }, { email }] })
        if (registerAuth) {
            res.status(401).json({
                message: 'Username or Password is already existed, please try another crediantials',
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const createRegister = await authModel.create({ username: username, email: email, password: hashPassword, role: role || 'user' });
        res.status(201).json({
            data: createRegister,
            success: true,
            message: 'Successfully created an new register.'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong, please try again!',
            success: false
        })
    }
}

export { Registration }