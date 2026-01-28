// routes/adminRoutes.js
import express from "express";
import {
  protect,
  adminOnly,
  superAdminOnly,
} from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  createAdmin,
  createRecruiter,
} from "../controllers/adminController.js";

const adminrouter = express.Router();

/* ----------------------------- Admin - Users ----------------------------- */
adminrouter.get("/users", protect, adminOnly, getAllUsers);              // List all recruiters
adminrouter.get("/users/:userId", protect, adminOnly, getUserById);      // Get recruiter by ID
adminrouter.patch("/users/:userId", protect, adminOnly, updateUser);     // Update recruiter (details + password)
adminrouter.delete("/users/:userId", protect, adminOnly, deleteUser);    // Delete recruiter

/* ----------------------------- Admin - Jobs ----------------------------- */
adminrouter.get("/jobs", protect, adminOnly, getAllJobs);                // List all jobs
adminrouter.delete("/jobs/:jobId", protect, adminOnly, deleteJob);       // Delete job

/* ------------------------- Admin - Applications ------------------------- */
adminrouter.get("/applications", protect, adminOnly, getAllApplications);

/* ------------------------ Admin - Create Users -------------------------- */
adminrouter.post("/create-recruiter", protect, adminOnly, createRecruiter);      // Admin creates recruiter
adminrouter.post("/create-admin", protect, superAdminOnly, createAdmin);         // Super admin creates admin

export default adminrouter;
