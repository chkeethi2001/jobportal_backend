import pool from '../config/DBconfig.js'

const createOrganizationtable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS Organization (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    image_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;


  try {
    await pool.query(query);
    console.log("Organization table created successfully");
  } catch (error) {
    console.error("Error creating Organization table:", error);
  }
};
                     
export default createOrganizationtable;