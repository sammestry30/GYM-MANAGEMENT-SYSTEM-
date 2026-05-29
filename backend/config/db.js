const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: '127.0.0.1', // <-- THIS MUST MATCH THE BIND-ADDRESS
    user: 'root',
    password: '',
    database: 'gym_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) console.log("Database Connection Error:", err);
    if(conn) {
        console.log("MySQL Connected...");
        conn.release();
    }
});

module.exports = pool;