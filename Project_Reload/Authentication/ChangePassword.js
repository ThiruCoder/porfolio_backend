import { authModel } from "./AuthSchema.js";
import * as bcrypt from 'bcryptjs'

const ChangePassword = async (req, res) => {
    const { username, role } = req.userInfo;
    const { oldPassword, newPassword } = req.body;
    const userDatails = await authModel.findOne({ username });
    try {
        if (!userDatails) {
            res.status(401).json({
                message: 'Username is not a valid.',
                success: false
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, userDatails.password)
        if (!isMatch) {
            res.status(404).json({
                message: 'The password is invalid, pleas try again!',
                success: false
            })
        }
        const genSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, genSalt)
        const updatePassword = await authModel.findByIdAndUpdate(userDatails._id, { password: hashPassword })
        res.status(200).json({
            password: updatePassword,
            message: 'Password is successfully changed.'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong, please try again',
            success: false
        })
    }
}

export { ChangePassword }