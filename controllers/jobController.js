// controllers/jobController.js
import Application from '../models/Application.js';
import Job from '../models/Job.js';



export const createJob = async (req, res) => {
  console.log('User:', req.user);
  try {
    const { title, description, location, type, experience } = req.body;

    console.log(req.body)

    if (!title || !description || !location || !type || !experience) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }



    const job = await Job.create({
      title,
      description,
      location,
      type,
      experience,
      postedBy: req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ success: false, message: 'Server error creating job' });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
};


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Job fetched successfully',
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ success: false, message: 'Server error fetching job' });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ success: false, message: 'Server error updating job' });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();
    return res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ success: false, message: 'Server error deleting job' });
  }
};


export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ job: job._id, applicant: req.user.userId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Applied to job successfully',
      data: application,
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    return res.status(500).json({ success: false, message: 'Server error applying to job' });
  }
};


export const getJobApplicants = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check authorization: recruiter who posted this job or admin

    if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: "Not authorized to view applications" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email")  
      .populate("job", "title company");     

    return res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ success: false, message: "Server error fetching applicants" });
  }
};

// backend/controllers/jobController.js

export const getUserApplications = async (req, res) => {
  try {
  
    res.json({
      message: "Fetched user applications successfully",
      userId: req.user ? req.user._id : null,
      applications: [], 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  Saved Jobs 
import User from "../models/User.js";

export const saveJob = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    const { id } = req.params; // job id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const job = await (await import("../models/Job.js")).default.findById(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.savedJobs) user.savedJobs = [];
    if (user.savedJobs.find(j => j.toString() === id)) {
      return res.json({ success: true, message: "Already saved" });
    }
    user.savedJobs.push(job._id);
    await user.save();
    return res.json({ success: true, savedJobs: user.savedJobs });
  } catch (err) {
    console.error("saveJob error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await User.findById(userId).populate("savedJobs");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, jobs: user.savedJobs || [] });
  } catch (err) {
    console.error("getSavedJobs error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
