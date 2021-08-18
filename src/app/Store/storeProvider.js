const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

//키워드에 맞는로 매장 검색 API
exports.retrieveStoreByKeywordList = async function (latitude, longitude, keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getDistanceParams = [latitude, longitude, latitude, keyword];
    const storeListByKeywordResult = await storeDao.selectStoreByKeyword(connection, getDistanceParams);
    connection.release();

    return storeListByKeywordResult;
};

//카테고리에 해당하는 매장 검색 API
exports.retrieveStoreByCategoryList = async function (latitude, longitude, category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getDistanceParams = [latitude, longitude, latitude, category];
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, getDistanceParams);
    connection.release();

    return storeListByCategoryResult;
};

//카테고리에 해당하는 매장 검색 API
exports.retrieveStoreByCategoryList = async function (latitude, longitude, category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getDistanceParams = [latitude, longitude, latitude, category];
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, getDistanceParams);
    connection.release();

    return storeListByCategoryResult;
};

//카테고리에 해당하는 매장 검색 API
exports.retrieveStoreByCategoryList = async function (latitude, longitude, category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getDistanceParams = [latitude, longitude, latitude, category];
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, getDistanceParams);
    connection.release();

    return storeListByCategoryResult;
};

//메인화면 조회 API
exports.retrieveMainScreenList = async function (type) {
    if(type){
        if(type === 'new'){
            const connection = await pool.getConnection(async (conn) => conn);
            const mainScreenByNewListResult = await storeDao.selectMainScreenByNew(connection);

            connection.release();    
            return mainScreenByNewListResult;
        }    
        else if(type === 'popular'){
            const connection = await pool.getConnection(async (conn) => conn);
            const mainScreenByPopularListResult = await storeDao.selectMainScreenByPopular(connection);
        
            connection.release();    
            return mainScreenByPopularListResult;
        }
    }
    else{
        const connection = await pool.getConnection(async (conn) => conn);

        const mainScreenOtherListResult = await storeDao.selectMainScreenByOther(connection);
        connection.release();    
        return mainScreenOtherListResult;
    }
};
