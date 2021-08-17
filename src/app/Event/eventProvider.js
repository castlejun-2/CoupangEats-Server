const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const eventDao = require("./eventDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveEventList = async function () {

    const connection = await pool.getConnection(async (conn) => conn);
    const eventListResult = await eventDao.selectEvent(connection);
    connection.release();

    return eventListResult;

};