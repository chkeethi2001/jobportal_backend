import pool from "../config/DBconfig.js";

export const createOTPService = async (
  user_id,
  otp_code,
  created_at,
  expires_at
) => {
  const result = await pool.query(
    `INSERT INTO OTPs (user_id, otp_code, created_at, expires_at) VALUES ($1, $2, $3, $4)`,
    [user_id, otp_code, created_at, expires_at]
  );
  return result.rows[0];
};

export const checkOTP = async (user_id, otp_code, current_time) => {
  const query = `
    SELECT id, user_id, otp_code, expires_at 
    FROM OTPs 
    WHERE user_id = $1 
      AND otp_code = $2 
      AND expires_at > $3;
  `;
  
  const values = [user_id, otp_code, current_time];
  const { rows } = await pool.query(query, values);

  return rows.length > 0 ? true : false;
};
