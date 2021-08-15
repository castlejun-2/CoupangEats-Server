const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'database-1.cndywyl1g5hh.ap-northeast-2.rds.amazonaws.com',
    user: 'millidb',
    port: '3306',
    password: 'vibccku2!',
    database: 'CoupangEats'
});

module.exports = {
    pool: pool
};