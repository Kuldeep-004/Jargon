import type { Request,Response } from "express";
import jwt  from "jsonwebtoken";

export const authMiddleware=(req:any,res:Response,next:any)=>{
    const auth=req.headers.authorization;
    if(!auth) return res.status(401).json({success:false,msg:"User not authorized"});
    const token=auth.split(" ")[1];

    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET as string);
        req.user=payload.sub;
        next();
    }catch(err){
        return res.status(500).json({success:false,msg:"User auth internal error"});
    }
}