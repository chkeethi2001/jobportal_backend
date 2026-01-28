import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import bcrypt from "bcrypt";

/* ---------------------------------- USERS ---------------------------------- */

// Get all recruiters
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "recruiter" })
      .select("-password -__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update user (with optional password)
export const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, email, role, password } = req.body;
    const { userId } = req.params;

    if (!firstname || !lastname || !email || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Firstname, lastname, email, and role are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Optional: Prevent duplicate email
    const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email is already taken" });
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.role = role;

    if (password && password.trim()) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ success: false, message: "Password must be at least 6 characters" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const { password: _, __v, ...safeUser } = user.toObject();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete user and related jobs/applications
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Job.deleteMany({ recruiter: user._id });
    await Application.deleteMany({ applicant: user._id });
    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Error deleting user" });
  }
};

/* ----------------------------------- JOBS ---------------------------------- */

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res.status(500).json({ message: "Error fetching jobs" });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    return res.status(500).json({ message: "Error deleting job" });
  }
};

/* ------------------------------ APPLICATIONS ------------------------------- */

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title location type")
      .populate("applicant", "firstName lastName email role");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: "Server error fetching applications" });
  }
};

/* ------------------------------ CREATE USERS ------------------------------- */

// Create Admin (Super Admin only)
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: newAdmin,
    });
  } catch (error) {
    console.error("Create Admin error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create Recruiter (Admin only)
export const createRecruiter = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRecruiter = await User.create({
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      role: "recruiter",
    });

    const { password: _, __v, ...safeUser } = newRecruiter.toObject();

    res.status(201).json({
      success: true,
      message: "Recruiter created successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Create Recruiter error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
