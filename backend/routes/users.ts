import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import prisma from "../utils/prisma.utility"
import type { ProfileRace, UserProfile } from "../types"
import ImageKit from "@imagekit/nodejs"
import ApiResponse from "../utils/apiResponse"

const router = Router()

router.route("/username/check").get(async (req, res) => {
    try {
        const username = req.query.username as string;
        const getUser = await prisma.user.findFirst({
            where: { username }
        })

        return res.status(200).send(new ApiResponse(200, {
            isAvailable: getUser ? false : true
        }))

    } catch (error) {
        return res.status(500).send(new ApiResponse(500, null, "faild to check username"))
    }
})

router.route("/:username").get(async (req, res) => {
    const username = req.params.username;

    const getUser = await prisma.user.findFirst({
        where: { username }, select: {
            id: true,
            username: true,
            fullName: true,
            pic: true,
            banner: true,
            email: true,
            joinedAt: true,
            streak: true,
            location: true,
            socialLinks: {
                select: {
                    id: true,
                    platform: true,
                    url: true,
                }
            },
            Badges: {
                select: {
                    id: true,
                    badgeName: true,
                    badgeDesc: true,
                    badgeIcon: true,
                    unlockedAt: true,
                }
            },
        }
    })

    if (!getUser) {
        return res.status(404).send({
            statusCode: 404,
            success: true,
            message: "user dose'nt exist"
        })
    }

    const getCompletedRaces = await prisma.participation.findMany({
        where: { userId: getUser?.id, joined: true, race: { completed: true } }, select: {
            race: {
                select: {
                    id: true,
                    name: true,
                    endDate: true,
                }
            }
        }
    })

    const getJoinedRaces = await prisma.participation.findMany({
        where: { userId: getUser?.id, joined: true, race: { completed: false } }, select: {
            race: {
                select: {
                    id: true,
                    name: true,
                    endDate: true,
                }
            }
        }
    })

    const completedRaces: ProfileRace[] = getCompletedRaces.map(participation => ({
        id: participation.race.id,
        name: participation.race.name,
        date: participation.race.endDate.toISOString(), // or format as needed
        position: 0
    }));

    const joinedRaces: ProfileRace[] = getJoinedRaces.map(participation => ({
        id: participation.race.id,
        name: participation.race.name,
        date: participation.race.endDate.toISOString(), // or format as needed
        position: 0
    }));


    const responseData: UserProfile = {
        username: getUser.username,
        fullName: getUser.fullName,
        profileImage: getUser.pic,
        bannerImage: (getUser.banner ? getUser.banner : ""),
        email: getUser.email,
        joinedDate: getUser.joinedAt,
        currentStreak: getUser.streak,
        joinedRaces: joinedRaces,
        completedRaces: completedRaces,
        badges: [],
        location: (getUser.location ? getUser.location : ""),
        socialLinks: [],
    }

    return res.send({
        statusCode: 200,
        data: responseData,
        success: true,
        message: 'succesfully got user'
    })
})

router.route("/upload-pic/signature").get(authMiddleware, async (req, res) => {
    try {
        const client = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        });
        const { token, expire, signature } = client.helper.getAuthenticationParameters();
        return res.status(200).send({
            statusCode: 200,
            data: { token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY },
            success: true,
            message: "successfully got upload signature"
        });
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            success: false,
            message: "faild to generate imagekit signature"
        });

    }

})

router.route("/:username/update").patch(authMiddleware, async (req, res) => {
    const updateData = req.body;
    console.log(updateData);
    
    const URLusername = req.params.username
    const UserUsername = res.locals.user.username;

    if (URLusername === UserUsername) {
        const UpdateUser = await prisma.user.update({
            where: { username: UserUsername },
            data: updateData
        })

        return res.send({
            statusCode: 200,
            data: {
                username: UpdateUser?.username,
                pic: UpdateUser?.pic,
                fullname: UpdateUser?.fullName,
                email: UpdateUser?.email
            },
            success: true,
            message: 'succesfully got user'
        })
    }

    res.status(401).send({
        statusCode: 401,
        data: {},
        success: false,
        message: 'access denied'
    }
    )
})




// TODO: Create Posts routes 
router.route("/:username/posts").post(async (req, res) => {
    return
})


export default router