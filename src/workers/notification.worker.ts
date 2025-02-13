import { Job, Worker } from "bullmq";
import { config } from "dotenv";
import { logger } from "../utils/logger";
import { log } from "console";


config();

const worker =new Worker(
    "notificationQueue",
    async (job) => {
        logger.info(`Processing job: ${job.id}`);

        const { broadcastId , message} =job.data;

        logger.info(`Sending notification for Broadcast ${broadcastId}: ${message}`);
    },
    {
        connection:{
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6380,
        }
    }
);

worker.on("completed",(job) => {
    logger.info(`Job ${job.id} completed`)
});

worker.on("failed", (job, err) => {
    logger.error(` Job ${job?.id} failed:`, err);
});