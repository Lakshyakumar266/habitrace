import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import prisma from "../utils/prisma.utility";
import { createRaceMiddleware } from "../middlewares/race-middleware";
import { checkRaceValidity } from "../middlewares/raceCheckin-middleware";
import { getPosition, groupLeaderboard, persnalStreak } from "../utils/streakActions";

const router = Router()

router.route("/").post(authMiddleware, createRaceMiddleware, async (req, res) => {
    const { name: raceName, description: raceDescription, startDate: raceStartingDate, endDate: raceEndingDate, frequency: raceFrequency } = req.body;
    const raceSlug = String(raceName + `_${raceFrequency}`).replaceAll(' ', '_')

    try {
        const createRace = await prisma.race.create({
            data: {
                raceSlug: raceSlug,
                name: raceName,
                description: raceDescription,
                startDate: raceStartingDate,
                endDate: raceEndingDate,
                frequency: raceFrequency,
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
            select: {
                id: true,
                raceSlug: true,
                name: true,
                description: true,
                startDate: true,
                endDate: true,
                frequency: true,
                createdById: true,
                createdAt: true,
                createdBy: {
                    select: {
                        username: true
                    }
                }
            },
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
        return res.status(404).send({
            message: "Database Server Error",
            success: false,
            data: error
        })
    }
})  // List all races (global hub)



router.route("/leaderboard").get(async (req, res) => {
    
    const raceSlug: string = String(req.query.race);

    try {

        const race = await prisma.race.findFirst({ where: { raceSlug: raceSlug } });
        if (!race) {
            return res.status(404).send({
                message: "No Race Found",
                success: false,
                data: {}
            })
        }

        const participants = await prisma.participation.findMany({ where: { raceId: race.id, joined: true } });
        if (!participants) {
            return res.status(404).send({
                message: "Race is Empty.",
                success: false,
                data: {}
            })
        }

        const checkins = await prisma.checkin.findMany({ where: { participation: { raceId: race.id } } });

        const leaderboard = await groupLeaderboard(participants, checkins);

        let leaderboardArray: any[] = await Promise.all(leaderboard.map(async item => {
            const value = await Promise.resolve(item);
            return value;
        }));

        leaderboardArray = getPosition(leaderboardArray)

        return res.status(200).send({
            message: "found race",
            success: true,
            data: leaderboardArray
        })

    } catch (error) {
        return res.status(401).send({
            message: "No Race Found",
            success: false,
            data: error
        })
    }

}) // Get leaderboard for a race




router.route("/:raceSlug").get(async (req, res) => {
    const raceSlug = req.params.raceSlug;
    try {

        const race = await prisma.race.findFirst({
            where: {
                raceSlug: raceSlug
            }, select: {
                id: true,
                raceSlug: true,
                name: true,
                description: true,
                startDate: true,
                endDate: true,
                frequency: true,
                createdById: true,
                createdAt: true,
                createdBy: {
                    select: {
                        username: true
                    }
                },
                participants: true,
            }

        })


        if (!race) return res.status(404).send({
            message: "No Race Found",
            success: false, data: null
        })
        return res.status(200).send({
            message: "found race",
            success: true,
            data: race
        })
    } catch (error) {
        return res.status(404).send({
            message: "No Race Found",
            success: false,
            data: error
        })
    }

}) // Get race details


router.route("/:raceSlug/join").post(authMiddleware, async (req, res) => {
    const raceSlug = req.params.raceSlug;
    const userId = res.locals.user.uuid;

    try {
        const race = await prisma.race.findFirst({
            where: {
                raceSlug: raceSlug
            }
        })


        if (!race) return res.status(404).send({
            message: "Race dose'nt exist",
            success: false,
            data: {}
        })

        const userParticipate = await prisma.participation.create({
            data: {
                userId: userId,
                raceId: race.id
            }
        })

        return res.status(201).send({
            message: "Racer participated in race.",
            success: true,
            data: userParticipate
        })

    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).send({
                message: "User has already joined this race.",
                success: false,
                data: {}
            });
        }

        return res.status(500).send({
            message: "Can't join race server error",
            success: false,
            data: error
        });
    }


}) // Join a race


router.route("/:raceSlug/leave").post(authMiddleware, async (req, res) => {
    const raceSlug = req.params.raceSlug;
    const userId = res.locals.user.uuid;

    try {
        const checkRaceParticipation = await prisma.participation.findFirst({
            where: {
                userId: userId
            }
        })

        if (!checkRaceParticipation) return res.status(404).send({
            message: "User is not a member of this race",
            success: false,
            data: {}
        })

        const quitParticipation = await prisma.participation.update({
            where: { id: checkRaceParticipation.id, raceId: checkRaceParticipation.raceId, userId: userId },
            data: {
                joined: false
            }
        })

        return res.status(201).send({
            message: "Racer quit succesfully.",
            success: true,
            data: {}
        })

    } catch (error) {
        return res.status(404).send({
            message: "Can't leave race, server error",
            success: false,
            data: error
        })
    }
}) // Leave a race



router.route("/:raceSlug/checkin").post(authMiddleware, checkRaceValidity, async (req, res) => {

    try {
        const checkinList = res.locals.checkinList.data;
        const endDate = res.locals.checkinList.raceEndDate;
        const participant = res.locals.checkinList.participant;
        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const participantCheckins = await prisma.checkin.findFirst({
            where: {
                AND: {
                    participationId: participant.id,
                    checkinDate: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            }
        });


        if (today.getDate() > endDate.getDate()) {
            return res.status(202).send({
                message: "HabitRace has alredy ended.",
                success: false,
                data: {}
            })
        }

        if (checkinList.find((item: { getDate: () => any; }) => { return item.getDate() == today.getDate() })) {

            if (participantCheckins) return res.status(202).send({
                message: "Alredy checkdin to race.",
                success: false,
                data: participantCheckins
            })

            const checkin = await prisma.checkin.create({ data: { participationId: participant.id, checkinDate: today } });
            (checkin as any).complition = false;

            if (today.getDate() === endDate.getDate()) {

                //TODO: Give achivement to user as its the last day of race. 

                (checkin as any).complition = true;
                return res.status(200).send({
                    message: "congrats you have successfully completed the race.",
                    success: true,
                    data: checkin
                })
            }

            return res.status(200).send({
                message: "checkdin to race succesfully.",
                success: true,
                data: checkin
            })

        }
    } catch (error) {
        return res.status(402).send({
            message: "Unable checkin rightnow...",
            success: true,
            data: error
        })
    }
}) // Race Daily check-in



router.route('/:raceSlug/streak').get(authMiddleware, async (req, res) => {
    const raceSlug = req.params.raceSlug;
    const userUuid = res.locals.user.uuid;
    try {
        const race = await prisma.race.findFirst({ where: { raceSlug: raceSlug } });
        if (!race) {
            return res.status(404).send({
                message: "No Race Found",
                success: false,
                data: {}
            })
        }

        const participant = await prisma.participation.findFirst({ where: { raceId: race.id, joined: true, userId: userUuid } });
        if (!participant) {
            return res.status(404).send({
                message: "Race is Empty.",
                success: false,
                data: {}
            })
        }

        const checkins = await prisma.checkin.findMany({ where: { participation: { raceId: race.id, userId: userUuid } } });


        const leaderboard = await persnalStreak(participant, checkins);

        return res.status(200).send({
            message: "found race",
            success: true,
            data: leaderboard
        })

    } catch (error) {
        return res.status(401).send({
            message: "No Race Found",
            success: false,
            data: error
        })
    }

})

export default router;