import { verifyOTP,createOTP } from "../controllers/otpController.js";
import express from 'express';
import { authenticateToken } from "../controllers/tokenController.js";


const otp_router = express.Router();
otp_router.post("/create",createOTP);
otp_router.post("/verify",verifyOTP);
otp_router.post("/reset/:token",authenticateToken)

export default otp_router;