import {
  CreateVideoModel,
  DeleteVideoModel,
  GetAllVideosModel,
  UpdateVideoModel,
} from "../models/videosModel.js";
import { bucketName, minioClient } from "../config/MinIoConfig.js";
import express from "express";
import multer from "multer";
import fs from "fs";
import ffmpeg from "../config/ffmpegconfig.js";
const video_router = express.Router();
const upload = multer({ dest: "uploads/" });
import pool from "../config/DBconfig.js";
import { UpdateDuration } from "../models/moduleModel.js";
import { getUserById } from "./userController.js";
import { getCourseByIdService } from "../models/courseModel.js";
import { getUserByEmailService } from "../models/userModel.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const UploadVdieos = async (req, res) => {
  const client = await pool.connect();
  const upload_names = [];

  try {
    const files = req.files;
    const video = req.video;
    const ppt = req.ppt;
    const { course_id, module_id } = req.params;

    if ((!files || files.length === 0) && !video && !ppt) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    await client.query("BEGIN");
    const video_file_path = video.path;
    const video_file_name = video.originalname;
    const video_minio_name = `${uuidv4()}_${video_file_name}`;
    await minioClient.fPutObject(bucketName, video_minio_name, video_file_path);
    upload_names.push({ bucketName: bucketName, fileName: video_minio_name });

    let duration = 0.0;
    try {
      const metadata = await new Promise((resolve) => {
        ffmpeg.ffprobe(video_file_path, (err, meta) => {
          if (err) return resolve(null);
          resolve(meta);
        });
      });

      if (metadata?.format?.duration) {
        duration = metadata.format.duration;
      }
    } catch {
      duration = 0;
    }
    const videoInsert = await client.query(
      `INSERT INTO Videos(course_id, module_id, video_name, video_bucket_name,duration)
         VALUES ($1, $2, $3, $4,$5)
         RETURNING id`,
      [course_id, module_id, video_file_name, video_minio_name, duration]
    );

    const video_id = videoInsert.rows[0].id;

    fs.unlinkSync(video_file_path);

    for (const file of files) {
      const file_path = file.path;
      const file_name = file.originalname;
      const file_minio_name = `${uuidv4()}_${file_name}`;
      await minioClient.fPutObject("files", file_minio_name, file_path);
      await client.query(
        `INSERT INTO Files_Table(video_id, file_name, file_bucket_name)
           VALUES ($1, $2, $3)`,
        [video_id, file_name, file_minio_name]
      );
      upload_names.push({ bucketName: "files", fileName: file_minio_name });
      fs.unlinkSync(file_path);
    }

    const ppt_name = ppt.originalname;
    const ppt_path = ppt.path;
    const ppt_minio_name = `${uuidv4()}_${ppt_name}`;
    await minioClient.fPutObject("ppt", ppt_minio_name, ppt_path);
    await client.query(
      `INSERT INTO PPT_Table(video_id, ppt_name, ppt_bucket_name)
           VALUES ($1, $2, $3)`,
      [video_id, ppt_name, ppt_minio_name]
    );

    upload_names.push({ bucketName: "ppt", fileName: ppt_minio_name });
    await client.query("COMMIT");
    res.status(200).json({
      message: "All files uploaded successfully",
    });
  } catch (err) {
    console.error("Transaction failed:", error);
    await client.query("ROLLBACK");

    if (upload_names.length > 0) {
      upload_names.map(async (upload) => {
        try {
          await minioClient.removeObject(upload.bucketName, upload.fileName);
        } catch (e) {
          console.warn(`Failed to remove ${upload.fileName} from MinIO:`, e.message);
        }
      });
    }
    res.status(500).json({
      message: "Batch upload failed, transaction rolled back",
      error: err.message,
    });
  }
  finally{
    client.release();
  }
};

