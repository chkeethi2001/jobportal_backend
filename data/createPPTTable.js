import pool from "../config/DBconfig.js";

const createPPTTable = async () => {
  const query = `
   CREATE TABLE IF NOT EXISTS PPT_Table (
    id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL REFERENCES Videos(id) ON DELETE CASCADE,
    ppt_name VARCHAR(255) NOT NULL,
    ppt_bucket_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

  `;

  try {
    await pool.query(query);
    console.log("PPT table created successfully");
  } catch (error) {
    console.error("Error creating PPT table:", error);
  }
};

export default createPPTTable;
