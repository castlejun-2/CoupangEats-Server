const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'RDS Endpoint',
    user: 'mysql database name',
    port: 'Port Number',
    password: 'PAssword',
    database: 'Database schema'
});

module.exports = {
    pool: pool
};