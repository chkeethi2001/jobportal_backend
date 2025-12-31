import pool from '../config/DBconfig.js'


export const does_name_exist = async(name)=>{
    const result = await pool.query("SELECT COUNT(*) FROM Organization WHERE name = $1",[name]);
    return result.rows; 
}

export const createOrganModel = async(name,address,contact_info,status)=>{
    const result = await pool.query("INSERT INTO Organization(name,address,contact_info,status) VALUES ($1,$2,$3,$4)",[name,address,contact_info,status]);
    return result.rows;
}

export const Update_Image_Model  = async(image_name,id)=>{
    const result = await pool.query("UPDATE Organization SET image_name = $1 WHERE id = $2",[image_name,id]);
    return result.rows;
}

export const Update_Status_Model = async(status,id)=>{
    const result = await pool.query("UPDATE Organization SET status = $1 WHERE id = $2",[status,id])
    return result.rows;
}

export const updateRecord = async (data, id) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

  const query = `UPDATE Organization SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0]; 
};