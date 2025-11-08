import crypto from 'crypto';
import type { Document } from 'mongoose';

export const generateOTP=(length=6)=>{
    const otp= crypto.randomInt(Math.pow(10,length-1),Math.pow(10,length));
    return otp;
}

interface userDoc extends Document{
    otp:{
        otp:number,
        expiresAt:Date,
    }
}

export const setOtpUser=async (user:userDoc,otp:number,ttlSeconds:number)=>{
    user.otp= {otp,expiresAt:new Date(Date.now()+ttlSeconds*1000)};
    await user.save();
    return user;
}

export const verifyOtp= (user:userDoc,otp:number)=>{
    if(!user.otp) return false;
    if(new Date() > user.otp.expiresAt) return false;
    if(user.otp.otp===otp) return true;
}