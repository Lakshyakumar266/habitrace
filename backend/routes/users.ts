import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { PrismaClient } from '../generated/prisma'
import type { UserSchema } from "../types"
import prisma from "../utils/prisma.utility"

const router = Router()

router.route("/:username").get(authMiddleware, async (req, res) => {
    const username = req.params.username;

    const getUser = await prisma.user.findFirst({ where: { username } })
    if (!getUser) {
        return res.status(404).send({
            statusCode: 404,
            success: true,
            message: "user dose'nt exist"
        })
    }


    return res.send({
        statusCode: 200,
        data: {
            username: getUser?.username,
            fullname: getUser?.fullName,
            pic: getUser?.pic,
            email: getUser?.email
        },
        success: true,
        message: 'succesfully got user'
    })
})

router.route("/:username/update").post(authMiddleware, async (req, res) => {
    const updateData = req.body;

    const URLusername = req.params.username
    const UserUsername = res.locals.user.username;

    if (URLusername === UserUsername) {
        const UpdateUser = await prisma.user.update({
            where: { username: UserUsername },
            data: updateData})

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