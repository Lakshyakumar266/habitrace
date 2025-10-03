import { createClient } from "redis";

const redisClient = createClient();

async function joinRedis() {
    await redisClient.connect();
    console.log("Redis Client Connected");
    redisClient.on("error", (err) => {
        console.log("Redis Client Error", err);
    });
}

joinRedis();

export default redisClient;
