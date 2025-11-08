import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const OtpSchema=new mongoose.Schema({
    code:String,
    expiresAt:Date,
})

const UserSchemaDefinitions=({
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    failedLoginAttempts:{
        type:Number,
        default:0,
    },
    lockUntil:{
        type:Date,
    },
    token:{
        type:String,
    },
    tokenExpiresIn:{
        type:Date,
    },
    otp:OtpSchema,
});

const UserSchema=new mongoose.Schema(UserSchemaDefinitions as any,{timestamps:true});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    const salt=await bcrypt.genSalt(12);
    this.password=await bcrypt.hash(this.password as string,salt);
    next();
})


UserSchema.methods.comparePassword=async function(pass:string){
    return await bcrypt.compare(pass,this.password);
}   

export default mongoose.model<any>("User",UserSchema);