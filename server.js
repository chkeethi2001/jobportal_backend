// server.js
import express from "express";
import dotenv from "dotenv";
import pool from "./config/DBconfig.js";
import Redis from "ioredis";
import userRoutes from './routes/userRoutes.js'
import { errorHandling } from "./middleware/errorHandler.js";
import createUserTable from "./data/createUserTable.js";
import createCourseTable from "./data/createCourseTable.js";
import createModuleTable from "./data/createModuleTable.js";
import course_router from "./routes/courseRoutes.js";
import { instructor, verifyToken } from "./middleware/authMiddleware.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import cretateAssignmentTable from "./data/createAssignmenttable.js";
import cretateOTPtable from "./data/createOTPtable.js";
import otp_router from "./routes/otpRoutes.js";
import createTokenTable from "./data/createTokentable.js";
import module_router from "./routes/moduleRoutes.js";
import cretateVideostable from "./data/createVideostable.js";
import video_router from "./routes/videosRouter.js";
import createFileTable from "./data/createFileTable.js";
import createPPTTable from "./data/createPPTTable.js";
import cretateQuestionsTable from "./data/createQuestionsTable.js";
import createEnrollTable from "./data/createEnrolltable.js";
import EntrollRouter from "./routes/enrollRoutes.js";
import createOrganizationtable from "./data/createOrganizationtable.js";
import cert_router from "./routes/certRoute.js";
import cors from 'cors';

dotenv.config();
const app = express();
const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsConfig = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsConfig))
//routes
app.use("/auth",userRoutes);
app.use("/otp",otp_router);
//error handling middleware
app.use(errorHandling);

// Create user, course, and module tables before starting the server
createUserTable();
createCourseTable();
createModuleTable();
cretateAssignmentTable();
cretateOTPtable();
createTokenTable();
cretateVideostable();
createFileTable();
createPPTTable();
cretateQuestionsTable();
createEnrollTable();
createOrganizationtable();
//course routes
app.use("/courses",verifyToken,course_router)
app.use("/assignments",verifyToken,assignmentRoutes);
app.use("/module",verifyToken,module_router);
app.use("/videos",verifyToken,video_router);
app.use("/enroll",verifyToken,EntrollRouter);
app.use("/cert",verifyToken,cert_router);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
app.get('/cache', async (req, res) => {
    const datatoChache = {message:"It's working"};
    await redis.set('key1',JSON.stringify(datatoChache));
    res.send("Data cached");
})

app.get('/getCache',async(req,res)=>{
    const getData = await redis.get("key1");
    res.send(getData);
})
app.get("/",async(req,res)=>{
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is : ${result.rows[0].current_database}`)
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));