import pool from "../config/DBconfig.js";

export const getAllAssignmentsService = async () => {
    const result = await pool.query("SELECT * FROM assignments");
    return result.rows;
};  
export const getAssignmentByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM assignments WHERE id = $1", [id]);
    return result.rows[0];
}

export const createAssignmentService = async (assignmentData) => {
    const result = await pool.query(
        `INSERT INTO assignments (module_id, title, description, due_date, total_marks, assignment_type, submission_type, resources)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
            assignmentData.module_id,
            assignmentData.title,
            assignmentData.description,
            assignmentData.due_date,
            assignmentData.total_marks,
            assignmentData.assignment_type,
            assignmentData.submission_type,
            assignmentData.resources
        ]
    );
    return result.rows[0];
}
export const updateAssignmentService = async (id, assignmentData) => {
    const result = await pool.query(
        `UPDATE assignments     
        SET module_id = $1, title = $2, description = $3, due_date = $4, total_marks = $5, assignment_type = $6, submission_type = $7, resources = $8
        WHERE id = $9 RETURNING *`,
        [           
            assignmentData.module_id,
            assignmentData.title,
            assignmentData.description,     
            assignmentData.due_date,
            assignmentData.total_marks,
            assignmentData.assignment_type,
            assignmentData.submission_type,  
            assignmentData.resources,
            id
        ]
    );
    return result.rows[0];
}       
export const deleteAssignmentService = async (id) => {
    const result = await pool.query("DELETE FROM assignments WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};

export const getAssignmentsByModuleIdService = async (module_id) => {
    const result = await pool.query("SELECT * FROM assignments WHERE module_id = $1", [module_id]);
    return result.rows;
};  
export const getAssignmentCountByModuleIdService = async (module_id) => {
    const result = await pool.query("SELECT COUNT(*) FROM assignments WHERE module_id = $1", [module_id]);
    return parseInt(result.rows[0].count, 10);
};
export const getDueAssignmentsService = async (currentDate) => {
    const result = await pool.query("SELECT * FROM assignments WHERE due_date >= $1 ORDER BY due_date", [currentDate]);
    return result.rows;
};
export const getOverdueAssignmentsService = async (currentDate) => {
    const result = await pool.query("SELECT * FROM assignments WHERE due_date < $1 ORDER BY due_date", [currentDate]);
    return result.rows;
};

export const getAssignmentCountService = async () => {
    const result = await pool.query("SELECT COUNT(*) FROM assignments");
    return parseInt(result.rows[0].count, 10);
}       
export const getAssignmentsByTypeService = async (assignment_type) => {
    const result = await pool.query("SELECT * FROM assignments WHERE assignment_type = $1", [assignment_type]);
    return result.rows;
};
export const getAssignmentsBySubmissionTypeService = async (submission_type) => {
    const result = await pool.query("SELECT * FROM assignments WHERE submission_type = $1", [submission_type]);
    return result.rows;
}
export const getAssignmentsByDueDateRangeService = async (startDate, endDate) => {
    const result = await pool.query("SELECT * FROM assignments WHERE due_date BETWEEN $1 AND $2 ORDER BY due_date", [startDate, endDate]);
    return result.rows;
}   
export const getAssignmentsByResourceService = async (resource) => {
    const result = await pool.query("SELECT * FROM assignments WHERE $1 = ANY(resources)", [resource]);
    return result.rows;
}
export const getAssignmentsByTitleService = async (title) => {
    const result = await pool.query("SELECT * FROM assignments WHERE title ILIKE $1", [`%${title}%`]);
    return result.rows;
}


            
            


            