// controllers/userController.js
import User from "../models/User.js";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs;

const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("profilePics");
});

// Upload Profile Pic
export const uploadProfilePicController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Store file id in user document
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicId: req.file.id },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error uploading profile picture" });
  }
};

// Get Profile Pic by ID
export const getProfilePic = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (!file) return res.status(404).json({ message: "File not found" });

    const readstream = gfs.createReadStream(file.filename);
    res.set("Content-Type", file.contentType);
    readstream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile picture" });
  }
};
