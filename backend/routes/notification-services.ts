import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import prisma from "../utils/prisma.utility";
import redisClient from "../utils/redis.utility";

const router = Router()


router.route("/").get(authMiddleware, async (req, res) => {
    const uuid = res.locals.user.uuid;
    const notifications = await redisClient.lRange(`notifications:${uuid}`, 0, -1);
    const notificationsLength = await redisClient.lLen(`notifications:${uuid}`);
    for (let i = 0; i < notifications.length; i++) {
        await redisClient.lPop(`notifications:${uuid}`);
    }
    res.status(200).json({ length: notificationsLength, notifications: notifications })
})


export default router;