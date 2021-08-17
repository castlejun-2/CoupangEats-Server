const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveStoreByKeywordList = async function (keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByKeywordResult = await storeDao.selectStoreByKeyword(connection, keyword);
    connection.release();

    return storeListByKeywordResult;

};

exports.retrieveStoreByCategoryList = async function (category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, category);
    connection.release();

    return storeListByCategoryResult;

};