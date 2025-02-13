import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

export interface IBroadcast extends Document {
    title :string;
    description: string;
    hostId: string;
    location: string;
    participants: string[];
    expiresAt: Date;
    createdAt: Date;
}


const BroadcastSchema: Schema = new Schema(
    {
        title :{type:String ,required: true, trim: true},
        description : {type: String, required: true , trim: true},
        hostId : { type: String, required: true},
        location : { type: String, required: true},
        participants : { type: [String], default: []},
        expiresAt : { type: Date, required: true},
    },
    {
        timestamps: true,
    }
);

BroadcastSchema.index({ title: "text", description: "text", location: "text" });

export const Broadcast =mongoose.model<IBroadcast>("Broadcast",BroadcastSchema);