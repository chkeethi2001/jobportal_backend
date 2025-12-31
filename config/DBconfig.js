import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
});

pool.on("connect",()=>{
    console.log("It's connected")
})

export default pool;