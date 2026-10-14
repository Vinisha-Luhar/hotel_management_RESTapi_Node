
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access token is required"
        });
    }

    // Extract the token after "Bearer "
    const token = authHeader.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token is required"
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        console.log("Authenticated user ID:", payload.sub);

        // Ensure the token contains a user ID
        if (typeof payload.sub !== "string") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }

        // Make authenticated user's information available
        req.user = {
            id: payload.sub,
            role: payload.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};



module.exports = { authenticate };
