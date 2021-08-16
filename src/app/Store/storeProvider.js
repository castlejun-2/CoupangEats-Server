const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveStoreList = async function (keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListResult = await storeDao.selectStore(connection, keyword);
    connection.release();

    return storeListResult;

};