import type { NextFunction, Request, Response } from "express";
import { CreateUser } from "../types";
import jwt, { type JwtPayload } from 'jsonwebtoken'

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, String(process.env.SECRET_KEY));
        (req as CustomRequest).token = decoded;

        res.locals.user = decoded;

        next()

    } catch (error) {
        return res.status(403).send({
            message: "Please authenticate'",
            success: false,
            error: error
        });
    }
}