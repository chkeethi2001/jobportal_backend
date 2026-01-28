import express from "express";
import {
  getProfile,
  uploadResume,
  uploadProfilePic,
} from "../controllers/userController.js";
import { getProfilePic } from "../controllers/fileController.js"; // if using option 1
// or import { getProfilePic } from "../controllers/userController.js"; if using option 2
import { protect, jobseekerOnly } from "../middleware/authMiddleware.js";
import uploadToGridFS from "../utils/gridfsStorage.js";

const router = express.Router();

// ✅ Get profile (all logged-in users)
router.get("/profile", protect, getProfile);

// ✅ Upload resume (jobseeker only)
router.post(
  "/resume",
  protect,
  jobseekerOnly,
  uploadToGridFS.single("resume"),
  uploadResume
);

// ✅ Upload profile picture (any user)
router.post(
  "/profile-pic",
  protect,
  uploadToGridFS.single("profilePic"),
  uploadProfilePic
);

// ✅ Get profile picture
router.get("/profile-pic/:id", getProfilePic);

router.delete("/profile-pic", protect, deleteProfilePic);

export default router;
