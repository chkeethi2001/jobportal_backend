import pool from "../config/DBconfig.js";
const cretateAssignmentTable = async () => {
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE
);`;

 try {
    await pool.query(createTableQuery);
    console.log("Assignments table created successfully");
  } catch (error) {
    console.error("Error creating assignments table:", error);
  }
};

export default cretateAssignmentTable;
