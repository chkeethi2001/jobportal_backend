import e from "express";
import { generate_cert } from "../controllers/certController.js";

const cert_router = e.Router();

cert_router.get("/",generate_cert);

export default cert_router;