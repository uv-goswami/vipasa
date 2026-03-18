import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const authMiddleware = (req:Request, res: Response, next: NextFunction) => {
    try{
    const header = req.headers.authorization;
    
    if(!header || header.split(' ')[0] !== "Bearer"){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const token = header.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    
    (req as any).user = payload;

    next();
    }catch (error){
        console.error("Error in authMiddleware: ", error)
        res.status(403).json({
            error: "Forbidden"
        })
    }
}