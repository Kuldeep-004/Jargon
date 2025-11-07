import type {Request,Response} from 'express';
import User from "../models/User";
import { z } from "zod";
import {generateOTP} from '../utils/otp'

const signUpSchema = z.object({ 
  email: z.email(),
  password: z.string().min(8),
  otp: z.number().optional(),
});

export const signUp = async (req: Request, res: Response) => {
  const parsed = signUpSchema.safeParse(req.body);

  if (!parsed.success)
    return res.status(400).json({ success: false, msg: "Enter proper data" });

  const { email, password } = parsed.data;

  const existingUser=await User.findOne({email:email});

  if(existingUser) return res.status(400).json({success:false,msg:"User already exists"});

  const newUser=await User.create({email,password});
  await newUser.save();

  const otp=generateOTP();

  return res.status(201).json({success:true,msg:"User Login"})

};
