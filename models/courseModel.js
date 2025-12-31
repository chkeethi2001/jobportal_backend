import pool from "../config/DBconfig.js";

export const getAllCoursesService = async () => {
    const result = await pool.query("SELECT * FROM courses");
    return result.rows;
};

export const getCourseByUserIdService = async (id) => {
    const result = await pool.query("SELECT * FROM courses WHERE user_id = $1", [parseInt(id,10)]);
    return result.rows;
}
export const getCourseByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    return result.rows[0];
}

export const createCourseService = async (courseData,user_id) => {
    const result = await pool.query(
        `INSERT INTO courses (title, user_id,description, instructor, duration, level, language, category, tags, price, is_published)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING *`,
        [courseData.title, user_id, courseData.description, courseData.instructor, courseData.duration, courseData.level, courseData.language, courseData.category, courseData.tags, courseData.price, courseData.is_published]
    );
    return result.rows[0];
};
export const updateCourseService = async (id, courseData) => {
    const result = await pool.query(
        `UPDATE courses             

        SET title = $1, description = $2, instructor = $3, duration = $4, level = $5, language = $6, category = $7, tags = $8, price = $9, is_published = $10
        WHERE id = $11 RETURNING *`,
        [courseData.title, courseData.description, courseData.instructor, courseData.duration, courseData.level, courseData.language, courseData.category, courseData.tags, courseData.price, courseData.is_published, id]
    );
    return result.rows[0];
};
export const deleteCourseService = async (id,user_id) => {
    const result = await pool.query("DELETE FROM courses WHERE id = $1 AND user_id = $2 RETURNING *", [id,user_id]);
    return result.rows[0];
};
export const getCoursesByCategoryService = async (category) => {
    const result = await pool.query("SELECT * FROM courses WHERE category = $1", [category]);
    return result.rows;
};

export const getCoursesByInstructorService = async (instructor) => {
    const result = await pool.query("SELECT * FROM courses WHERE instructor = $1", [instructor]);
    return result.rows;
};
export const getPublishedCoursesService = async () => {
    const result = await pool.query("SELECT * FROM courses WHERE is_published = TRUE");
    return result.rows;
};
export const getCoursesByLevelService = async (level) => {
    const result = await pool.query("SELECT * FROM courses WHERE level = $1", [level]);
    return result.rows;
}
export const getCoursesByTagService = async (tag) => {

    const result = await pool.query("SELECT * FROM courses WHERE $1 = ANY(tags)", [tag]);
    return result.rows;
};
export const getCourseCountService = async () => {
    const result = await pool.query("SELECT COUNT(*) FROM courses");
    return parseInt(result.rows[0].count, 10);
};
export const getPublishedCourseCountService = async () => {
    const result = await pool.query("SELECT COUNT(*) FROM courses WHERE is_published = TRUE");
    return parseInt(result.rows[0].count, 10);
};
export const getUnpublishedCourseCountService = async () => {
    const result = await pool.query("SELECT COUNT(*) FROM courses WHERE is_published = FALSE");
    return parseInt(result.rows[0].count, 10);
};
export const getCoursesByLanguageService = async (language) => {
    const result = await pool.query("SELECT * FROM courses WHERE language = $1", [language]);
    return result.rows;
}
export const getCoursesByPriceRangeService = async (minPrice, maxPrice) => {
    const result = await pool.query("SELECT * FROM courses WHERE price BETWEEN $1 AND $2", [minPrice, maxPrice]);
    return result.rows;
}
export const getCoursesByDurationService = async (minDuration, maxDuration) => {
    const result = await pool.query("SELECT * FROM courses WHERE duration BETWEEN $1 AND $2", [minDuration, maxDuration]);
    return result.rows;
}       
export const getCoursesWithPaginationService = async (limit, offset) => {
    const result = await pool.query("SELECT * FROM courses ORDER BY id LIMIT $1 OFFSET $2", [limit, offset]);
    return result.rows;
}   
export const searchCoursesService = async (searchTerm) => {
    const result = await pool.query("SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1", [`%${searchTerm}%`]);
    return result.rows;
}       
export const getRecentCoursesService = async (limit) => {
    const result = await pool.query("SELECT * FROM courses ORDER BY created_at DESC LIMIT $1", [limit]);
    return result.rows;
}   

export const getNo_of_VideosModel = async(id)=>{
    const result = await pool.query("SELECT no_of_videos FROM courses WHERE id = $1",[id]);
    return result.rows;
}

