import { Broadcast, IBroadcast } from "../models/schema";
import redis from "../config/redis";
import { notificationQueue } from "../config/queue";

export class BroadcastService {
    
    private static readonly CACHE_KEY = "active_broadcasts";

    static async createBroadcast(data: Partial<IBroadcast>): Promise<IBroadcast> {
        const broadcast= await Broadcast.create(data);
        await redis.del(this.CACHE_KEY);

        await notificationQueue.add("sendNotification", {
            broadcastId:broadcast._id,
            message:`New Meetup : ${broadcast.title} at ${broadcast.description}`,
        });
        
        return broadcast;
    }

    static async getBroadcast(id: string): Promise<IBroadcast | null> {
        return await Broadcast.findById(id);
    }

    static async getActiveBroadcasts(): Promise<IBroadcast[]> {
        const cachedData = await redis.get(this.CACHE_KEY);
        if(cachedData){
            return JSON.parse(cachedData);
        }

        const broadcasts= await Broadcast.find({ expiresAt: { $gt: new Date() }}).sort({ createdAt: -1});

        await redis.setex(this.CACHE_KEY,300 ,JSON.stringify(broadcasts));
        return broadcasts;
    }


    static async joinBroadcast(broadcastId: string, userId: string): Promise<IBroadcast | null> {
        const updatedBroadcast= await Broadcast.findByIdAndUpdate(
            broadcastId,
            { $addToSet: { participants: userId }},
            { new: true }
        );
        await redis.del(this.CACHE_KEY);
        return updatedBroadcast;
    }
}