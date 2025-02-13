import { config } from "dotenv";
import Redis from "ioredis";
import { logger } from "../utils/logger";


config();

const redis=new Redis(process.env.REDIS_URL || "redis://localhost:6380");

redis.on("connect", ()=> logger.info("Connected to Redis"));
redis.on("error",(err)=> logger.error("Redis Error:",err));

export default redis;