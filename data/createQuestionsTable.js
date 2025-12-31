import pool from "../config/DBconfig.js";
const cretateQuestionsTable = async () => {
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    video_id INTEGER REFERENCES Videos(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT NOT NULL,
    option4 TEXT NOT NULL,
    right_answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
;
    
  try {
    await pool.query(createTableQuery);
    console.log("Questions table created successfully");
  } catch (error) {
console.error("Error creating Questions table:", error);
  }
};

export default cretateQuestionsTable;
