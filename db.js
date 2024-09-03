require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_Host,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
    queueLimit: 0
})

pool.getConnection((err, connection) => {
    if (err) {
        console.log('Erroe connecting to database:', err.message);
    } else {
        console.log('Database connection is establish successfully.');
        connection.release();
    }
});

module.exports = { pool };