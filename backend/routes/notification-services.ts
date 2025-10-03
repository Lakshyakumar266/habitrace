import { Router } from "express";

import { authMiddleware } from "../middlewares/auth-middleware";
import prisma from "../utils/prisma.utility";
import redisClient from "../utils/redis.utility";
const router = Router()


router.route("/").get(authMiddleware, async (req, res) => {
    const username = res.locals.user.username;
    const notifications = await redisClient.lRange(`notifications:${username}`, 0, -1);
    const notificationsLength = await redisClient.lLen(`notifications:${username}`);
    for (let i = 0; i < notifications.length; i++) {
        await redisClient.lPop(`notifications:${username}`);
    }
    res.status(200).json({ length: notificationsLength, notifications: notifications })
})


export const notificationHandler = async (data: any, client: any,) => {

    if (data === "subscribe") {
        redisClient.SUBSCRIBE(`notifications:${client.username}`, async (message, channel) => {
            if (message) {
                if (channel === `notifications:${client.username}`) {
                    client.send(message)
                }
            }
        });
        client.send("OK")
    } else if (data === "unsubscribe") {
        redisClient.UNSUBSCRIBE(`notifications:${client.username}`);
        client.send("OK")
    }
}


export default router;