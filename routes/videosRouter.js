import express from "express";
import multer from "multer";
import {
  DeleteVideoService,
  GetAllVideosService,
  StreamVideo,
  UpdateVideoService,
  UploadVdieos,
} from "../controllers/videosController.js";
import { instructor } from "../middleware/authMiddleware.js";

const video_router = express.Router();
const upload = multer({ dest: "uploads/" });

video_router.post(
  "/upload-batch/:course_id/:module_id",
 upload.fields([
    { name: "files", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "ppt", maxCount: 1 },
    { name: "questions", maxCount: 1 }
  ]),
  UploadVdieos
);
video_router.get("/stream/:filename",StreamVideo);
video_router.get("/all_videos/:course_id/:module_id", GetAllVideosService);
video_router.put("/update_video/:id/:course_id/:module_id", instructor,UpdateVideoService);
video_router.delete(
  "/delete_video/:id/:course_id/:module_id",instructor,
  DeleteVideoService
);

export default video_router;
