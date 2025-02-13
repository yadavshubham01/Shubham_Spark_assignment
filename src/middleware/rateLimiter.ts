import rateLimit from "express-rate-limit";


export const broadcastLimiter = rateLimit({
    windowMs: 60*60*1000,
    max: 5,
    message: "Too many broadcasts created. Please try again later",
    headers: true,
});

export const globalLimiter =rateLimit({
    windowMs: 15*60*1000,
    max:100,
    message:"Too many requests from this IP. Please try again later.",
    headers: true,
});