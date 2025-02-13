import { Queue } from "bullmq";
import { config } from "dotenv";


config();

export const notificationQueue =new Queue("notificationQueue", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6380,
    },
})