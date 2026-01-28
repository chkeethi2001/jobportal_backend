// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin", "superadmin"],
      default: "jobseeker"
    },

    mustChangePassword: {
      type: Boolean,
      default: false
    },

    // Saved jobs (for jobseekers)
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // Profile picture (GridFS)
    profilePicture: { type: String, default: null },            // filename
    profilePicId: { type: mongoose.Schema.Types.ObjectId, default: null }, // GridFS file ID
    profilePicContentType: { type: String, default: null },     // e.g., image/jpeg

    // Resume (local or GridFS)
    resumeUrl: { type: String, default: null },                 // if stored in public/files
    resumeId: { type: mongoose.Schema.Types.ObjectId, default: null } // for future GridFS use
  },
  { timestamps: true }
);

// Optional: improve lookup speed
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User;
