import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

export interface IParticipant {
    userId: string;
    status: "pending" | "approved" | "rejected";
}

export interface IBroadcast extends Document {
    title: string;
    description: string;
    hostId: string;
    location: string;
    participants: IParticipant[];
    expiresAt: Date;
    createdAt: Date;
}

const BroadcastSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        location: { type: String, required: true },
        participants: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
            }
        ],
        expiresAt: { type: Date, required: true }
    },
    {
        timestamps: true
    }
);

const JoinRequestSchema = new mongoose.Schema(
    {
        broadcastId: { type: mongoose.Schema.Types.ObjectId, ref: "Broadcast", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
    },
    { timestamps: true }
);

BroadcastSchema.index({ title: "text", description: "text", location: "text" });

export const Broadcast = mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);
export const JoinRequest = mongoose.model("JoinRequest", JoinRequestSchema);
