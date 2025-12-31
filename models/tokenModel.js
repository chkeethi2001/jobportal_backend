import pool from "../config/DBconfig.js";

export const createToken = async (user_id, token, created_at, expires_at) => {
  const result = await pool.query(
    `INSERT INTO tokens (user_id, token, created_at, expires_at) VALUES ($1, $2, $3, $4)`,
    [user_id, token, created_at, expires_at]
  );
  return result.rows[0];
};

export const verifyToken = async (user_id, token, current_time) => {
  const result = await pool.query(
    "SELECT * FROM tokens WHERE user_id = $1 AND token=$2 AND expires_at > $3 LIMIT 1",
    [user_id, token, current_time]
  );
  return result.rows.length > 0 ? true : false;
};
