// data/createModuleTable.js

import pool from "../config/DBconfig.js";

const createModuleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      duration DOUBLE PRECISION,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Modules table created successfully");
  } catch (error) {
    console.error("Error creating modules table:", error);
  }
};

export default createModuleTable;
