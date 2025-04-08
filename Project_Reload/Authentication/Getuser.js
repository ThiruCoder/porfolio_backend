import { authModel } from "./AuthSchema.js"


const GetUsers = async (req, res) => {
    const users = await authModel.find({});
    try {
        if (users) {
            return res.status(200).json({
                data: users,
                message: 'Successfully get all users.',
                success: true
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong please try again later!',
            success: false
        })
    }
}

export { GetUsers }