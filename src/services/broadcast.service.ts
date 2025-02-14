import { Broadcast, IBroadcast, JoinRequest } from "../models/schema";
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
    
    static async getUpdateBroadcast(id: string, updateData: Partial<IBroadcast>) : Promise<IBroadcast | null>{
        const updatedBroadcast = await Broadcast.findByIdAndUpdate(id,updateData,{new:true});
        await redis.del(this.CACHE_KEY)
        return updatedBroadcast;
    }

    static async getdeleteBroadcast(id: string) : Promise<IBroadcast | null>{
        const updatedBroadcast = await Broadcast.findByIdAndDelete(id);
       
        return updatedBroadcast;
    }

    static async joinBroadcast(broadcastId: string, userId: string): Promise<IBroadcast| any> {
        const existingRequest = await JoinRequest.findOne({ broadcastId, userId });
        if (existingRequest) {
            return existingRequest; 
        }

         const request = await JoinRequest.create({ broadcastId, userId, status: "pending" });

         await notificationQueue.add("sendNotification", {
            broadcastId,
            message: `New join request received.`,
        });

        
        return request;
    }

    static async updateJoinRequest(broadcastId:string,userId:string ,status:"approved" | "rejected"){
        const updatedBroadcast = await JoinRequest.findOneAndUpdate(
            {broadcastId,"participants.userdId":userId},
            {$set: {"participants.$.status":status}},
            {new: true}
        );

        if (!updatedBroadcast) return null;

        if (status === "approved") {
            await Broadcast.findByIdAndUpdate(
                broadcastId,
                { $addToSet: { participants: userId } }, 
                { new: true }
            );
        }
        await notificationQueue.add("sendNotification",{
             broadcastId,
             message:`Your request to join has been ${status}`,
        });
        return updatedBroadcast;
    }
}