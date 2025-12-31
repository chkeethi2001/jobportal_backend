import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
  getUserByEmailService,
  Update_Bio,
  Update_Image,
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { minioClient } from "../config/MinIoConfig.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

dotenv.config();

const handleResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({ message, data, statusCode });
};

export const createUser = async (req, res, next) => {
  let {firstName, lastName, email, password, role } = req.body;
  const name = `${firstName} ${lastName}`
  password = await bcrypt.hash(password, 10);
  const userData = { name, email, password, role };
  try {
    const newUser = await createUserService(userData);
    handleResponse(res, 201, "User created successfully", newUser);
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);
    if (!user) {
      return handleResponse(res, 404, "User not found");
    }
    handleResponse(res, 200, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await updateUserService(userId, userData);
    if (!updatedUser) {
      return handleResponse(res, 404, "User not found");
    }
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deleted = await deleteUserService(userId);
    if (!deleted) {
      return handleResponse(res, 404, "User not found");
    }
    handleResponse(res, 200, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res,next) => {
  const { email, password } = req.body;
  try {
    const result = await getUserByEmailService(email);
    if (!result) {
      next(err);
    }
    const user = result;
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      next(err);
    }
    const token = jwt.sign(
      { user_email: user.email, user_role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    handleResponse(res, 200, "Login successful", { token });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateBio = async (req, res) => {
  try {
    const email = req.user.user_email;
    const bio = req.body.bio;
    const user = await getUserByEmailService(email);
    const update = await Update_Bio(user.id, bio);
    if (!update) {
      return res.status(403).json({ message: "Update is unsuccessfully" });
    }
    return res.status(200).json({ message: "Update Sucessfull" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const UpdateImage = async (req, res) => {
  let image_name;
  try {
    const email = req.user.user_email;
    const image = req.file;
    if (!image) {
      return res.status(403).json({ message: "Image should be uploaded" });
    }

    const image_path = image.path;
    image_name = `${uuidv4()}_${image.originalname}`;
    const user = await getUserByEmailService(email);

    if (!user) {
      return res.status(403).json();
    }

    await minioClient.fPutObject("images", image_name, image_path);
    fs.unlinkSync(image_path);
    const update = await Update_Image(user.id, image_name);
    if (!update) {
      return res.status(403).json({ message: "Update is unsuccessfully" });
    }
    res.status(200).json({ message: "Succesfully added Image" });
  } catch (error) {
    if (!image_name) {
      await minioClient.removeObject("image", image_name);
    }
    res.status(404).json({ error });
  }
};
