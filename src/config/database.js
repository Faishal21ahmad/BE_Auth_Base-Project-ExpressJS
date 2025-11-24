require('dotenv').config({ quiet: true });
const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

dbPool.getConnection((err, connection) => {
    if (err) {
        console.error(`    Connection Database Failed : ${err.message}`);
    } else {
        console.log(`    Connection Database Success : ${process.env.DB_NAME}`);
        connection.release();
    }
});

module.exports = dbPool.promise();