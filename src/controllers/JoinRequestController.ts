import { Request, Response } from "express";
import { BroadcastService } from "../services/broadcast.service";
import { IBroadcast, JoinRequest } from "../models/schema"; 
import { logger } from "../utils/logger"; 

export class JoinRequestController {
  static async requestJoin(req: Request, res: Response):Promise<any> {
    try {
      const { id:broadcastId } = req.params; 
      const  userId  = req.user?.userId;

      if (!userId) return res.status(400).json({ error: "User ID is required" });

    
      const request = await BroadcastService.joinBroadcast( broadcastId, userId );
      res.status(201).json(request);
    } catch (error: any) {
      logger.error("Error requesting to join broadcast:", error.message);
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  }

  static async handleRequest(req: Request, res: Response): Promise<any> {
     try {
        const { requestId ,userId} = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status. Allowed values: approved, rejected" });
        }

      
        

        const updatedRequest = await BroadcastService.updateJoinRequest(requestId, userId, status);

        if (!updatedRequest) return res.status(404).json({ error: "Join request not found" });

        res.json(updatedRequest);
     } catch (error: any) {
        logger.error("Error handling join request:", error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
     }
    }
}
