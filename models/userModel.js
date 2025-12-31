import pool from '../config/DBconfig.js';

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
};

export const getUserByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

export const createUserService = async (userData) => {
    const result = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *", [userData.name, userData.email, userData.password, userData.role]);
    return result.rows[0];
};
export const updateUserService = async (id, userData) => {
    const result = await pool.query("UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING name,email", [userData.name, userData.email, userData.password, userData.role, id]);
    return result.rows[0];
};

export const deleteUserService = async (id) => {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};

export const getUserByEmailService = async (email) => {
    console.log(email)
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

export const UpdatePassword = async (id,password)=>{
    const result = await pool.query("UPDATE users SET password = $1 WHERE id = $2",[password,id]);
    return result.rows[0];
}

export const Update_Bio= async(id,Bio)=>{
    const result = await pool.query("UPDATE users SET bio = $1  WHERE id=$2 RETURNING *",[Bio,id])
    return result.rows[0];
}

export const Update_Image= async(id,image_url)=>{
    const result = await pool.query("UPDATE users SET image_url = $1  WHERE id=$2 RETURNING email,name",[image_url,id])
    return result.rows;
}
