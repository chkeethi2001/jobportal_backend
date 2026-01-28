
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import fs from 'fs'

// Create application with GridFS resume (uploaded via multer-gridfs-storage)
export const createApplication = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    const { jobId, coverLetter } = req.body;
    let resume = req.file;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!jobId) return res.status(400).json({ success: false, message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Build application payload
    const payload = {
      job: job._id,
      user: new mongoose.Types.ObjectId(userId),  
      coverLetter: coverLetter || "",
    };

    if (req.file) {
      payload.resumeFilename = req.file.filename;
      payload.resumeContentType = req.file.mimetype;
      // Multer-gridfs-storage exposes file id at req.file.id
      payload.resumeFileId = req.file.id || req.file.fileId || req.file._id;
      payload.resume={data:resume.buffer};
    } else {
      return res.status(400).json({ success: false, message: "Resume file (field 'resume') is required" });
    }

    const application = await Application.create(payload);
    return res.status(201).json({ success: true, application });
  } catch (err) {
    console.error("createApplication error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get applications for current user
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const apps = await Application.find({ user: userId }).populate("job");
    return res.json({ success: true, applications: apps });
  } catch (err) {
    console.error("getMyApplications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Stream resume from GridFS
export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const app = await Application.findById(id);
    if (!app || !app.resumeFileId) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "resumes" });
    res.set("Content-Type", app.resumeContentType || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename=\"${app.resumeFilename || 'resume'}\"`);

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(app.resumeFileId));
    downloadStream.on("error", () => res.status(500).json({ success: false, message: "Error reading file" }));
    downloadStream.pipe(res);
  } catch (err) {
    console.error("downloadResume error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// Update application status (for recruiter or admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ success: true, message: "Application status updated", application });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
