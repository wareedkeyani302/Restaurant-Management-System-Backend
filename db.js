const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'restaurant_management_system',
    waitForConnections: true,
    connectionLimit: 10,
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