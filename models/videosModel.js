import pool from "../config/DBconfig.js";

export const CreateVideoModel = async (
  course_id,
  module_id,
  video_name,
  video_bucket_name
) => {
  const result = await pool.query(
    "INSERT INTO Videos(course_id,module_id,video_name,video_bucket_name) VALUES($1,$2,$3,$4)",
    [course_id, module_id, video_name, video_bucket_name]
  );
  return result.rows[0];
};

export const GetAllVideosModel = async (course_id, module_id) => {
  const result = await pool.query(
    "SELECT video_name,video_bucket_name FROM Videos WHERE course_id = $1 AND module_id = $2",
    [course_id, module_id]
  );
  return result.rows;
};

export const UpdateVideoModel = async (id, course_id, module_id, title) => {
  const result = await pool.query(
    "UPDATE Videos SET video_name = $1 WHERE id=$4 AND course_id = $2 AND module_id = $3 RETURING * ",
    [title, course_id, module_id, id]
  );
  return result.rows[0];
};

export const DeleteVideoModel = async (id, course_id, module_id) => {
  const result = await pool.query(
    "DELETE FROM Videos WHERE id=$1 AND course_id = $2 AND module_id = $3",
    [id, course_id, module_id]
  );
  return result.rows[0];
};
