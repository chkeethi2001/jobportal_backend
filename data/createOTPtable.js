import pool from "../config/DBconfig.js";
const cretateOTPtable = async () => {
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS OTPs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  try {
    await pool.query(createTableQuery);
    console.log("OTPs table created successfully");
  } catch (error) {
    console.error("Error creating OTPs table:", error);
  }
};

export default cretateOTPtable;
