import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import prisma from "../utils/prisma.utility";
import { createRaceMiddleware } from "../middlewares/race-middleware";

const router = Router()

router.route("/").post(authMiddleware, createRaceMiddleware, async (req, res) => {
    const { name: raceName, description: raceDescription, startDate: raceStartingDate, endDate: raceEndingDate } = req.body;
    const raceSlug = String(raceName + '_racer').replace(' ', '_')

    try {
        const createRace = await prisma.race.create({
            data: {
                raceSlug: raceSlug,
                name: raceName,
                description: raceDescription,
                startDate: raceStartingDate,
                endDate: raceEndingDate,
                createdById: res.locals.user.uuid
            }
        })


        return res.status(200).send({
            message: "Race created succesfully.",
            success: true,
            data: createRace//createRace
        })

    } catch (error) {
        return res.status(200).send({
            message: "server error",
            success: false,
            data: error
        })
    }
}) // Create a new race


router.route("/").get(async (req, res) => {
    try {

        const races = await prisma.race.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return res.status(200).send({
            message: "found races",
            success: true,
            data: races
        })


    } catch (error) {
        return res.status(401).send({
            message: "Database Server Error",
            success: false,
            data: error
        })
    }
})  // List all races (global hub)



router.route("/:username/:raceSlug").get(authMiddleware, async (req, res) => {
    const raceSlug = req.params.raceSlug;
    const raceCreator = req.params.username;
    try {

        const race = await prisma.race.findFirst({
            where: {
                raceSlug: raceSlug,
                createdBy: {
                    username: raceCreator
                }
            }
        })


        return res.status(200).send({
            message: "found race",
            success: true,
            data: race
        })
    } catch (error) {
        return res.status(401).send({
            message: "No Race Found",
            success: false,
            data: error
        })
    }

}) // Get race details


router.route("/:id/join").get(authMiddleware, async (req, res) => { }) // Join a race
router.route("/:id/leave").get(authMiddleware, async (req, res) => { }) // Leave a race
router.route("/:id/checkin").get(authMiddleware, async (req, res) => { }) // Race Daily check-in
router.route("/:id/leaderboard").get(authMiddleware, async (req, res) => { }) // Get leaderboard for a race


export default router;