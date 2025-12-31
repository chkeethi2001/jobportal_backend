import { verifyToken } from "../models/tokenModel.js";
import { getUserByEmailService, UpdatePassword } from "../models/userModel.js";
import bcrypt from 'bcrypt';

export const authenticateToken = async (req, res, next) => {
    const{token} = req.params;
    let{email,password} = req.body;
    if(!token||!email||!password){
        return res.status(400).json({message:"Token, Email and Password are required"});    
    }
    try{
        const user = await getUserByEmailService(email);
        if(!user){
            return res.status(404).json({message:"User Not found"})
        }
        const isvalid = await verifyToken(user.id,token,new Date());
        if(isvalid){
            password = bcrypt.hash(password,10);
            await UpdatePassword(user.id,password);
            return res.status(200).json({message:"Password update successfully"});
        }
        return res.status(400).json({message:"Invalid or expired token"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"});
    }
}