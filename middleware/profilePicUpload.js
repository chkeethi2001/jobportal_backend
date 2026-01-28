// middleware/profilePicUpload.js
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';

// connection string to your MongoDB
const mongoURI = process.env.MONGODB_URI;  

// Create storage engine for multer-gridfs-storage
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    // you can check mimetype etc.
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      // reject
      return null;
    }

    return {
      bucketName: "profilePics",  // bucket name in GridFS: profilePics.files & profilePics.chunks
      filename: `profilePic_${req.user.id}_${Date.now()}`, 
      metadata: { userId: req.user.id },
    };
  }
});

const uploadProfilePic = multer({ storage }).single("profilePic");

export default uploadProfilePic;
