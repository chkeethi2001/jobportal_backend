// backend/routes/authRoutes.js
import express from 'express';
import { changePassword, registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginSchema } from '../utils/validationSchema.js';
import { registerSchema } from '../schemas/validationSchema.js';
import multer from 'multer';
import { getProfile } from '../controllers/userController.js';

const router = express.Router();

// Register route with validation
router.post('/register', validateRequest(registerSchema), registerUser);

// Login route with validation
router.post('/login', validateRequest(loginSchema), loginUser);

// Protected profile route
router.get('/profile', protect, getProfile);

// Logout route (optional)
router.post('/logout', protect, logoutUser);
router.post('/change-password', protect, changePassword);


export default router;
