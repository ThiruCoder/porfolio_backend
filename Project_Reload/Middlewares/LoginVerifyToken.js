import jwt from 'jsonwebtoken'

const VerifyToken = (req, res, next) => {
    const getTokenAddress = req.headers['authorization']
    if (!getTokenAddress) {
        res.status(401).json({
            meessage: "Token is required",
            success: false
        })
    }

    try {
        const token = getTokenAddress && getTokenAddress.split(' ')[1]
        if (!token) {
            res.status(401).json({
                meessage: "Token is missed",
                success: false
            })
        }
        const scretToken = process.env.JWT_SECRET_KEY
        const jwtToken = jwt.verify(token, scretToken)
        console.log('jwtToken', jwtToken);
        req.logToken = jwtToken
        next();
    } catch (error) {
        res.status(500).json({
            loggedIn: false,
            message: 'Something went wrong, try again later!'
        })
    }

}

export { VerifyToken }