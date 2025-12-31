import pool from "../config/DBconfig.js";
const cretateVideostable = async () => {
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS Videos (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    video_name VARCHAR(255) NOT NULL,
    video_bucket_name VARCHAR(255) NOT NULL,
    duration DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  try {
    await pool.query(createTableQuery);
    console.log("Videos table created successfully");
  } catch (error) {
    console.error("Error creating Videos table:", error);
  }
};

export default cretateVideostable;
