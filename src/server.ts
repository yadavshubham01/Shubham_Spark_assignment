import express from 'express'

import helmet from 'helmet'
import { config } from "dotenv"
import { logger } from './utils/logger'
import broadcastRoutes from "./routes/broadcast.routes";
import AuthRoutes from "./routes/auth.routes";
import mongoose from 'mongoose'
import { globalLimiter } from './middleware/rateLimiter'
import { setupSwagger } from './config/swagger'

 
config();
const app=express();


app.use(helmet());
app.use(globalLimiter);
app.use(express.json());

setupSwagger(app);



app.use("/api/broadcasts", broadcastRoutes);
app.use("/api/auth",AuthRoutes)

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => logger.info("MongoDB connected"))
    .catch((err) => logger.error("MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>{
    logger.info(`Server is running on port ${PORT}`);
})

export default app;