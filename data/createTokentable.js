import pool from "../config/DBconfig.js";
const createTokenTable = async () => {
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  try {
    await pool.query(createTableQuery);
    console.log("token table created successfully");
  } catch (error) {
    console.error("Error creating token table:", error);
  }
};

export default createTokenTable;
