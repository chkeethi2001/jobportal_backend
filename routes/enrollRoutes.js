import { createEnrollService } from "../controllers/entrollController.js";
import e from "express";

const EntrollRouter = e.Router();


EntrollRouter.post("/create/:course_id",createEnrollService);

export default EntrollRouter;