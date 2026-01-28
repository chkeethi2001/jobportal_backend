import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import { getUserApplications } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
// authorizeRoles is optional here depending who is allowed to upload / delete profile pic
import {
  getProfile,
  uploadProfilePic,
  getProfilePic,
  deleteProfilePic,
} from "../controllers/userController.js";

const userrouter = express.Router();

// Setup GridFS storage for profilePics bucket
const storage = new GridFsStorage({
  db: mongoose.connection,  // Make sure this connection is open when this runs
  file: (req, file) => {
    return {
      bucketName: "profilePics",
      filename: `profilePic_${req.user._id}_${Date.now()}`,
      metadata: { userId: req.user._id },
    };
  },
});
const upload = multer({ storage });

// Route to get logged-in user's profile
userrouter.get("/profile", protect, getProfile);

// Upload profile pic
userrouter.post("/profile/pic", protect, upload.single("profilePic"), uploadProfilePic);
userrouter.get("/test-upload", (req, res) => {
  res.json({ message: "✅ Upload route is working!" });
});

// Stream profile pic via user ID
userrouter.get("/:id/profile-pic", getProfilePic);

// Delete profile pic
userrouter.delete("/profile/pic", protect, deleteProfilePic);

// Your applications route remains
userrouter.get(
  "/:id/applications",
  protect,
  getUserApplications
);

export default userrouter;
