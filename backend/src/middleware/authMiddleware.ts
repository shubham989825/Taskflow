import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JWTpayload {
    id: String;
}

export interface AuthRequest extends Request {
    userId?: String;
}

export const protect = (req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Auth header received:", authHeader);

        if(!authHeader) {
            return res.status(401).json({message: "Not authorized , no token"});
        }

        // Extract token from "Bearer token" format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        console.log("Extracted token:", token);

        const JWT_SECRET = process.env.JWT_SECRET as string;

        if (!JWT_SECRET) {
            throw new Error("JWT secret not defined");

        }
        const decoded = jwt.verify(token, JWT_SECRET) as JWTpayload;

        console.log("Decoded token:", decoded);

        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({message: "Not authorized, invalid token"});
    }
};