import User from "../models/User.js";
import mongoose from "mongoose";

// ========== GET PROFILE ==========
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== UPLOAD PROFILE PICTURE (GridFS) ==========
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old profile pic if exists
    if (req.user.profilePicId) {
      const bucketOld = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "profilePics",
      });
      await bucketOld.delete(new mongoose.Types.ObjectId(req.user.profilePicId));
    }

    // Update user with new file info
    req.user.profilePicId = req.file.id;
    req.user.profilePicContentType = req.file.contentType;
    // optional: you might want to store original filename or some metadata
    await req.user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicId: req.user.profilePicId,
    });
  } catch (err) {
    console.error("Upload Profile Pic Error:", err);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};

// ========== GET PROFILE PIC (GridFS Stream) ==========
export const getProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profilePicId) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "profilePics",
    });

    res.set("Content-Type", user.profilePicContentType || "application/octet-stream");

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(user.profilePicId));
    downloadStream.on("error", () => {
      res.status(404).json({ message: "Error reading profile picture" });
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Get Profile Pic Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== DELETE PROFILE PICTURE (GridFS) ==========
export const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.profilePicId) {
      return res.status(404).json({ message: "No profile picture to delete" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "profilePics",
    });

    await bucket.delete(new mongoose.Types.ObjectId(user.profilePicId));

    user.profilePicId = null;
    user.profilePicContentType = null;
    await user.save();

    res.status(200).json({ message: "Profile picture deleted" });
  } catch (err) {
    console.error("Delete Profile Pic Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
