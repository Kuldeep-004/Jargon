import crypto from 'crypto';

export const generateOTP=(length=6)=>{
    const otp= crypto.randomInt(length);
    return otp;
}