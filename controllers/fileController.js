// controllers/fileController.js
import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // collection where multer-gridfs-storage saves files
});

//  Get profile picture by ID
export const getProfilePic = async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const readStream = gfs.createReadStream({ _id: file._id });
    readStream.pipe(res);
  } catch (err) {
    console.error("Error fetching file:", err.message);
    res.status(500).json({ message: "Error fetching file" });
  }
};
