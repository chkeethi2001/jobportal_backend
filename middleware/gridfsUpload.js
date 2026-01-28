
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
console.log("MONGODB_URI =", process.env.MONGODB_URI);

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const match = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!match.includes(file.mimetype)) {
        return reject(new Error("Only PDF/DOC/DOCX allowed"));
      }
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        resolve({ filename, bucketName: "resumes", metadata: { originalName: file.originalname } });
      });
    });
  },
});

const uploadToGridFS = multer({ storage });
export default uploadToGridFS;
