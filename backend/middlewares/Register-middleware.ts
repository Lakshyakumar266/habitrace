import type { NextFunction, Request, Response } from "express";
import { CreateUser } from "../types";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const registerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email } = req.body

        const checkUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })


        if (checkUser?.username === username) {
            return res.status(409).send({
                message: "username alredy exist",
                data:{username:true},
                success: false,
                error: "username alredy taken"
            });
        }
        if (checkUser?.email === email) {
            return res.status(409).send({
                message: "email alredy exist",
                data:{email:true},
                success: false,
                error: "email alredy taken"
            });
        }

        // zod checking
        const { success, data } = CreateUser.safeParse(req.body)
        if (!success) return res.status(401).send({
            message: "Authentication invalid",
            success: false,
            error: "invalid fields"
        });
        next()

    } catch (error) {
        console.log(error);
        
        return res.status(401).send({
            message: "Server Error",
            success: false,
            error: error
        });
    }
}