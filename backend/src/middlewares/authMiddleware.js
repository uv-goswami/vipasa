import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || header.split(' ')[0] !== "Bearer") {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        const token = header.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        console.error("Error in authMiddleware: ", error);
        res.status(403).json({
            error: "Forbidden"
        });
    }
};
