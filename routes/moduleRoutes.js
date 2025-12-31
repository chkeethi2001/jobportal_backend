 import express from 'express';
import { createModule, getAllModules, getModuleById, updateModule, deleteModule, getModulesByCourseId } from '../controllers/moduleController.js';    
import { instructor } from '../middleware/authMiddleware.js';

const module_router = express.Router();
module_router.post("/modules/:course_id", instructor,createModule);
module_router.get("/modules", instructor,getAllModules);
module_router.get("/module_course/:course_id",getModulesByCourseId);
module_router.get("/modules/:id", getModuleById);
module_router.put("/modules/:id", instructor,updateModule);
module_router.delete("/modules/:id", instructor,deleteModule);

export default module_router;