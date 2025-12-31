import pool from "../config/DBconfig.js";

const createFileTable = async () => {
  const query = `
   CREATE TABLE IF NOT EXISTS Files_Table(
    id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL REFERENCES Videos(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_bucket_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
  `;

  try {
    await pool.query(query);
    console.log("Files table created successfully");
  } catch (error) {
    console.error("Error creating Files table:", error);
  }
};

export default createFileTable;
