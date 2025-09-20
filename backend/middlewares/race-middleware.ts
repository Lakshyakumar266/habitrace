import type { NextFunction, Request, Response } from "express";
import { CreateRace } from "../types";


export const createRaceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { success, data } = CreateRace.safeParse(req.body)
        
        if (!success) return res.status(403).send({
            message: "faild to create race",
            success: false,
            error: "invalid credentials",
            data: data
        });
        next()
    } catch (error) {
        return res.status(403).send({
            message: "faild to create race",
            success: false,
            error: "server error",
            data: error
        })
    }
}