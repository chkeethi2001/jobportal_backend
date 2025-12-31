import { send_OTP, send_Token } from "../config/Mailconfig.js";
import { createOTPService,checkOTP } from "../models/otpModel.js";
import { createToken } from "../models/tokenModel.js";
import { getUserByEmailService } from "../models/userModel.js";
import crypto from 'crypto'

function generateOTP(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}



export const createOTP = async(req,res)=>{
    const email = req.body.email;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }
    const user = await getUserByEmailService(email);
    if(!user){
        res.status(404).json({message:"User not found"});
    }
    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 10*60*1000);
    const created_at = new Date();
    try{
        await createOTPService(user.id,otp,created_at,expires_at);
        await send_OTP(email,otp)
        res.status(201).json({message:"OTP created successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to create OTP"});
    }
}

export const verifyOTP = async(req,res)=>{
    const {email,otp} = req.body;
    if(!email && !otp){
        return res.status(400).json({message:"Both Email and OTP are required"});
    }
    const user = await getUserByEmailService(email);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const isvalid = await checkOTP(user.id,otp,new Date());
    if(isvalid){
        const resetToken = crypto.randomBytes(32).toString('hex');
        await createToken(user.id,resetToken,new Date(),new Date(Date.now() + 30*60*1000));
        await send_Token(email,resetToken);
        return res.status(200).json({message:"OTP verified successfully"});
    }
    return res.status(404).json({message:"Invalid OTP"});

}