import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.schema";
import jwt from "jsonwebtoken";
import { config } from "dotenv"

config()

export class AuthController {
    static async register(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });
            const token = jwt.sign({userId:user._id},
                process.env.JWT_SECRET as string,
                { expiresIn : "1h"}
            )
            res.status(201).json({ message: "User registered successfully", userId: user._id ,token});
        } catch (error: any) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }


    static async login(req: Request, res: Response):Promise<any> {
        try {
            const { email, password } = req.body;

            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

          
            const token = jwt.sign({ userId: user._id }, "your_super_secret_key", { expiresIn: "1h" });

            res.status(200).json({ token, userId: user._id });
        } catch (error: any) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}
