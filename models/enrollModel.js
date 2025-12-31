import pool from "../config/DBconfig.js";

export const createEnrollModel = async (course_id,user_id)=>{
    const result = await pool.query("INSERT INTO Enroll_Table (course_id,user_id) VALUES($1,$2) RETURNING *",[course_id,user_id]);
    return result.rows;
}

export const Does_Pair_exist = async(course_id,user_id)=>{
    const result = await pool.query("SELECT COUNT(*) FROM Enroll_Table WHERE course_id = $1 AND user_id = $2",[course_id,user_id]);
    const count = parseInt(result.rows[0].count, 10);
    return count>0;
}

export const getCompletedVideos = async(course_id,user_id)=>{
    const result = await pool.query("SELECT completed FROM Enroll_Table WHERE course_id = $1 AND user_id=$2",[course_id,user_id]);
    return result.rows;
}