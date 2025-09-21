import type { NextFunction, Request, Response } from "express";
import { CreateRace } from "../types";
import prisma from "../utils/prisma.utility";


export const checkRaceValidity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const raceSlug = req.params.raceSlug;
        const userId = res.locals.user.uuid;
        const getRace = await prisma.race.findFirst({ where: { raceSlug: raceSlug } })

        if (!getRace) return res.status(403).send({
            message: "faild to find race",
            success: false,
            error: "invalid credentials",
            data: {}
        });

        const raceStartDate = getRace.startDate;
        const raceEndDate = getRace.endDate;
        
        // res.locals.

        const getParticipant = await prisma.participation.findFirst({ where: { raceId: getRace.id, userId: userId } })

        if (!getParticipant) return res.status(403).send({
            message: "faild to find participent",
            success: false,
            error: "invalid credentials",
            data: {}
        });

        next()
    } catch (error) {
        return res.status(403).send({
            message: "faild to checkin in race",
            success: false,
            error: "server error",
            data: error
        })
    }
}