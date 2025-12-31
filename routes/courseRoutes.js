import express from 'express';
import { createCourse, getAllCourses, getCourseByUserId, updateCourse, deleteCourse,getCourseById } from '../controllers/courseController.js';
import { instructor } from '../middleware/authMiddleware.js';

const course_router = express.Router();
course_router.post("/courses",instructor ,createCourse);
course_router.get("/courses", getAllCourses);
course_router.get("/courses/:id",getCourseById);
course_router.get("/user",instructor,getCourseByUserId);
course_router.put("/courses/:id", instructor,updateCourse);
course_router.delete("/courses/:id", instructor,deleteCourse);

export default course_router;