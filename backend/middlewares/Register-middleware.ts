import type { NextFunction, Request, Response } from "express";
import { CreateUser } from "../types";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const registerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email } = req.body
        const checkUsername = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })


        if (checkUsername === username) {
            return res.status(403).send({
                message: "user alredy exist",
                success: false,
                error: "username alredy taken"
            });
        }

        // zod checking
        const { success, data } = CreateUser.safeParse(req.body)
        if (!success) return res.status(403).send({
            message: "Authentication invalid",
            success: false,
            error: "invalid fields"
        });
        next()
        
    } catch (error) {
        return res.status(403).send({
            message: "Server Error",
            success: false,
            error: error
        });
    }
}