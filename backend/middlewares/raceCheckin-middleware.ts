import type { NextFunction, Request, Response } from "express";
import { CreateRace } from "../types";
import prisma from "../utils/prisma.utility";
import { Racefrequency } from "../generated/prisma";
import ApiResponse from "../utils/apiResponse";


const getDatesList = function (from: any, to: any, gap: number) {
    const dateList = [];
    let loop = new Date(from); // Create a copy to avoid modifying the original

    while (loop <= to) {
        dateList.push(new Date(loop));
        loop.setDate(loop.getDate() + gap);
    }
    return dateList;
}

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

        const getParticipant = await prisma.participation.findFirst({ where: { raceId: getRace.id, userId: userId } })

        
        if (!getParticipant || !getParticipant.joined) return res.status(403).send({
            message: "You are not participating in this race.",
            success: false,
            error: "invalid credentials",
            data: {}
        });

        const raceFrequencyType = getRace.frequency;
        const raceStartDate = getRace.startDate;
        const raceEndDate = getRace.endDate;

        if (raceFrequencyType === Racefrequency.DAILY) {
            const checkinList: object = getDatesList(raceStartDate, raceEndDate, 1)
            res.locals.checkinList = {
                raceStartDate: raceStartDate,
                raceEndDate: raceEndDate,
                participant: getParticipant,
                race:getRace,
                data: checkinList
            };
            next()
        }

        else if (raceFrequencyType === Racefrequency.WEEKLY) {
            const checkinList: object = getDatesList(raceStartDate, raceEndDate, 7)
            res.locals.checkinList = {
                raceStartDate: raceStartDate,
                raceEndDate: raceEndDate,
                participant: getParticipant,
                race:getRace,
                data: checkinList
            };
            next()
        }

        else if (raceFrequencyType === Racefrequency.MONTHLY) {
            const checkinList: object = getDatesList(raceStartDate, raceEndDate, 30)
            res.locals.checkinList = {
                raceStartDate: raceStartDate,
                raceEndDate: raceEndDate,
                participant: getParticipant,
                race:getRace,
                data: checkinList
            };
            next()
        }

        else return res.send(403).send({
            message: "faild to get race details",
            success: false,
            error: "server error",
            data: {}
        })

    } catch (error) {
        return res.status(403).send({
            message: "faild to checkin in race",
            success: false,
            error: "server error",
            data: error
        })
    }
}