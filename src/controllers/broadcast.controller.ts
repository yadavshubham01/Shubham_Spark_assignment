import { title } from "process";
import { Broadcast, IBroadcast } from "../models/schema";
import { BroadcastService } from "../services/broadcast.service";
import { logger } from "../utils/logger";
import { Request, Response } from "express";
import RedisClient from "../config/redis";
import { error } from "console";


export class BroadcastController {
    static async create(req: Request, res: Response): Promise<any>{
        try{
            const { title ,description, location,expiresAt } =req.body;
            
            const hostId = req.user?.userId; 
            if (!hostId) {
              return res.status(401).json({ message: "Unauthorized: No user ID found" });
            }
            const expiryDate = expiresAt ? new Date(expiresAt) : undefined;
            const broadcast= await BroadcastService.createBroadcast({ title, description,hostId,location, expiresAt});
            res.status(201).json(broadcast);
        }catch (error: any){
            logger.error("Error creating broadcast:" , error.message);
            res.status(500).json({ message:" Internal Server Error",error: error.message})
        }
    }

    static async get(req: Request, res: Response): Promise<any>{
        try {
            const broadcast =await BroadcastService.getBroadcast(req.params.id);
            if(!broadcast) return res.status(400).json({ message: "Broadcast not found"});
            res.json(broadcast);
        }catch (error){
            logger.error("Error Fetching broadcast:" , error);
            res.status(500).json({ message: "Interval server error"});
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
          const broadcasts = await BroadcastService.getActiveBroadcasts();
          res.json(broadcasts);
        } catch (error: any) {
          console.error("Error fetching broadcasts:", error);
          res.status(500).json({ message: "Internal server error" ,error: error.message});
        }
    }
    
    static async getAllBySearch(req: Request, res: Response): Promise<any> {
        try {
          const { search ,sortBy="createdAt", order = "desc",location , hostId, page=1,limit=100}=req.query;

          const query:any ={};

          if(search){
            query.$or = [
                { title : {$regex: search , $options: "i"}},
                { description : {$regex: search , $options: "i"}},
                { location : {$regex: search , $options: "i"}}
            ];
          }

          if(location) query.location = location;
          
          if(hostId) query.hosdId =hostId;
          const skip = (Number(page)-1)* Number(limit);

          const cachedkey = `broadcasts:${JSON.stringify(query)}:${sortBy}:${order}:${page}:${limit}`;
          const cachedData = await RedisClient.get(cachedkey);
          if(cachedData) return res.json(JSON.parse(cachedData));

          const broadcasts = await Broadcast.find(query)
           .sort({ [sortBy as string]: order === "asc" ? 1: -1})
           .skip(skip)
           .limit(Number(limit));

           await RedisClient.set(cachedkey,JSON.stringify(broadcasts), "EX" ,60);

           res.json(broadcasts);
        }catch(error){
          logger.info("Error while searching...",error);
          res.status(500).json({ error : "Internal Server Error"})
        }
    }

    static async update(req:Request ,res:Response) :Promise<any>{
      try{
        const {id} =req.params;
        const updatedBroadcast=await BroadcastService.getUpdateBroadcast(id,req.body);
        
        if(!updatedBroadcast) return res.status(404).json({error: "Broadcast is not found"});

        res.json(updatedBroadcast);
      }catch(error){
        res.status(500).json({error:"Internal Server Error"});
      }
    }
    
    static async delete(req: Request, res: Response):Promise<any> {
      try {
        const { id } = req.params;
        const deletedBroadcast = await BroadcastService.getdeleteBroadcast(id);
        if (!deletedBroadcast) return res.status(404).json({ error: "Broadcast not found" });
        res.json({ message: "Broadcast deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
}