import pool from "../config/DBconfig.js";

export const getAllModulesService = async () => {
  const result = await pool.query("SELECT * FROM modules");
  return result.rows;
};

export const getModuleByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM modules WHERE id = $1", [id]);
  return result.rows[0];
};

export const createModuleService = async (moduleData,course_id) => {
  const result = await pool.query(
    `INSERT INTO modules (course_id, title)
        VALUES ($1, $2) RETURNING *`,
    [course_id, moduleData.title]
  );
  return result.rows[0];
};

export const updateModuleService = async (id, moduleData) => {
  const result = await pool.query(
    `UPDATE modules 
        SET course_id = $1, title = $2, description = $3, sequence = $4, duration = $5, content_url = $6, content_type = $7, category = $8, tags = $9 
        WHERE id = $10 RETURNING *`,
    [
      moduleData.course_id,
      moduleData.title,
      moduleData.description,
      moduleData.sequence,
      moduleData.duration,
      moduleData.content_url,
      moduleData.content_type,
      moduleData.category,
      moduleData.tags,
      id,
    ]
  );
  return result.rows[0];
};

export const deleteModuleService = async (id) => {
  const result = await pool.query(
    "DELETE FROM modules WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const getModulesByCourseIdService = async (course_id) => {
  const result = await pool.query(
    "SELECT * FROM modules WHERE course_id = $1",
    [course_id]
  );
  return result.rows;
};

export const getModuleCountByCourseIdService = async (course_id) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM modules WHERE course_id = $1",
    [course_id]
  );
  return parseInt(result.rows[0].count, 10);
};

export const UpdateDuration = async (durationInSeconds,id) => {
  let hours = Math.floor(durationInSeconds / 3600);
  let minutes = Math.floor((durationInSeconds % 3600) / 60);

  let str_duration = `${hours}h${minutes}m`;
  const result = await pool.query("UPDATE modules SET duration = $1 WHERE id=$2",[durationInSeconds,id]);
  return result.rows[0];
};
