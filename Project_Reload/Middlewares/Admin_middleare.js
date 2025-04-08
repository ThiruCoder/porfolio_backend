

const AdminMiddleware = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {
        try {
            const getVerifyToken = req.userInfo
            return res.status(201).json({
                data: getVerifyToken,
                message: 'Wellcome to home page',
                logIn: true,
                success: true
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Something went wrong please! try again later.',
                success: false
            })
        }
    }
    console.log('req.userInfo', req.userInfo);
    next()
}

export { AdminMiddleware }