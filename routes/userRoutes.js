import express from 'express';
import { createUser,getAllUsers,getUserById,updateUser,deleteUser, loginUser, updateBio, UpdateImage } from '../controllers/userController.js';
import {validateUser,validatelogin} from "../middleware/inputValidator.js"
import multer from 'multer';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/user",validateUser, createUser);
router.post("/login",validatelogin, loginUser)
router.get("/users",getAllUsers);
router.get("/users/:id",getUserById);
router.put("/users/:id",verifyToken, updateUser);
router.put("/bio",verifyToken,updateBio);
router.put("/image",verifyToken,upload.single("image"),UpdateImage)
router.delete("/users/:id",verifyToken,deleteUser);

export default router;