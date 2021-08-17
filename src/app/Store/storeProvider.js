const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveStoreByKeywordList = async function (latitude, longitude, keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getDistanceParams = [latitude, longitude, latitude, keyword];
    const storeListByKeywordResult = await storeDao.selectStoreByKeyword(connection, getDistanceParams);
    connection.release();

    return storeListByKeywordResult;

};

exports.retrieveStoreByCategoryList = async function (latitude, longitude, category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getDistanceParams = [latitude, longitude, latitude, category];
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, getDistanceParams);
    connection.release();

    return storeListByCategoryResult;

};