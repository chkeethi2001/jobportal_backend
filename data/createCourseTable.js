// data/createCourseTable.js

import pool from "../config/DBconfig.js";

const createCourseTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      instructor VARCHAR(100),
      duration INTEGER,
      level VARCHAR(50),
      language VARCHAR(50),
      category TEXT,         
      tags TEXT[],                                         
      price NUMERIC(10,2) DEFAULT 0.00,
      No_of_Videos INTEGER,
      is_published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Courses table created successfully");
  } catch (error) {
    console.error("Error creating courses table:", error);
  }
};

export default createCourseTable;
