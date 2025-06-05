import jwt from 'jsonwebtoken';

const VerifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is missing",
            success: false
        });
    }

    // Remove Bearer and quotes
    let token = authHeader.split(' ')[1];
    token = token.replace(/^"|"$/g, '');

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({
            message: "Internal server error: Missing secret key",
            success: false
        });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("JWT verification failed:", err.name, err.message);
            return res.status(403).json({
                error: err.message,
                message: "Invalid or expired token",
                success: false
            });
        }

        req.userInfo = decoded;
        next();
    });
};

export { VerifyToken };
