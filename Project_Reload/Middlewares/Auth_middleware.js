import jwt from 'jsonwebtoken'

const AuthMiddleware = (req, res, next) => {
    const getTokenAddress = req.headers['authorization']
    if (!getTokenAddress) {
        return res.status(401).json({
            meessage: "Token is required",
            success: false
        })
    }

    try {
        const token = getTokenAddress && getTokenAddress.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                meessage: "Token is missed",
                success: false
            })
        }
        // console.log('getTokenAdd', token);
        const secretKey = process.env.JWT_SECRET_KEY
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token",
                    success: false
                });
            }
            if (decoded) {
                res.cookie("token", token, {
                    httpOnly: true,  // Prevents JavaScript access (XSS protection)
                    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
                    sameSite: "Strict", // Prevents CSRF attacks
                });

                req.userInfo = decoded;
                next(); // Must be inside the callback
            }
        });
        // console.log('tokens', tokens);

    } catch (e) {
        console.log(new Error(`Error from AuthMiddleware ${e}`));
        return res.status(500).json({
            meessage: 'Something went wrong please try again later!',
            success: false
        })
    }
}

export { AuthMiddleware }