import mongoose from "mongoose";

export const DBConnect=async ()=>{
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Jargon")
    .then((res)=>console.log("Mongodb Connected Successfully"))
    .catch((err)=>console.log(err));
}