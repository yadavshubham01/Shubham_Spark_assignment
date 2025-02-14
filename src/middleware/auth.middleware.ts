import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const  SECRET_KEY = "your_super_secret_key"

declare module "express-serve-static-core" {
    interface Request {
        user?: { userId: string };
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
        req.user = { userId: decoded.userId }; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware;
