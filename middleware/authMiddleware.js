import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect Middleware - Verify Token & Attach User (any role)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Token failed or expired" });
  }
};
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied: Admins only" });
};
export const superAdminOnly = (req, res, next) => {
  if (req.user?.role === "superadmin") {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: "Access denied: Super Admins only" });
};




// Usage: authorizeRoles('admin', 'recruiter')
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

// Specific middleware to authenticate ONLY recruiters (like your example)
export const authenticateRecruiter = async (req, res, next) => {
  let token;

  if (req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
