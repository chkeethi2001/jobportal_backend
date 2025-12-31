import pool from "../config/DBconfig.js";

const createUserTable = async () => {
  const queryText = `
   CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'learner',
    bio TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
  try {
    await pool.query(queryText);
    console.log("User table created successfully");
  } catch (error) {
    console.error("Error creating user table:", error);
  }
};

export default createUserTable;
