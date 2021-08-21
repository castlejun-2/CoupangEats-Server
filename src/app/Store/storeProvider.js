const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

//키워드에 맞는로 매장 검색 API
exports.retrieveStoreByKeywordList = async function (userId, keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByKeywordResult = await storeDao.selectStoreByKeyword(connection, userId, keyword);
    connection.release();

    return storeListByKeywordResult;
};

//카테고리에 해당하는 매장 검색 API
exports.retrieveStoreByCategoryList = async function (userId, category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, userId, category);
    connection.release();

    return storeListByCategoryResult;
};

//메인화면 조회 API
exports.retrieveMainScreenList = async function (userId, type) {
    if(type){
        if(type === 'new'){
            const connection = await pool.getConnection(async (conn) => conn);
            const mainScreenByNewListResult = await storeDao.selectMainScreenByNew(connection,userId);

            connection.release();    
            return mainScreenByNewListResult;
        }    
        else if(type === 'popular'){
            const connection = await pool.getConnection(async (conn) => conn);
            const mainScreenByPopularListResult = await storeDao.selectMainScreenByPopular(connection,userId);
        
            connection.release();    
            return mainScreenByPopularListResult;
        }
    }
    else{
        const connection = await pool.getConnection(async (conn) => conn);

        const mainScreenOtherListResult = await storeDao.selectMainScreenByOther(connection,userId);
        connection.release();    
        return mainScreenOtherListResult;
    }
};

exports.retrieveStoreCategoryList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeCategoryListResult = await storeDao.selectStoreCategory(connection);
    connection.release();    
    return storeCategoryListResult;
    
};

exports.retrieveMainList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreListResult = await storeDao.selectMainScreen(connection, storeId);
    connection.release();    
    return mainStoreListResult;
};

exports.retrieveReviewList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreReviewListResult = await storeDao.selectMainReview(connection, storeId);
    connection.release();    
    return mainStoreReviewListResult;
};

exports.retrieveMenuCategoryList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreCategoryListResult = await storeDao.selectMainMenuCategory(connection, storeId);
    connection.release();    
    return mainStoreCategoryListResult;
};

exports.getMenu = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreDetailMenuListResult = await storeDao.selectDetailMenu(connection, categoryId);
    connection.release();    
    return mainStoreDetailMenuListResult;
};

exports.retrieveMenuList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreCategoryListResult = await storeDao.selectMainCategory(connection, storeId);
    connection.release();    
    return mainStoreCategoryListResult;
};

exports.getDetailMenu = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreDetailMenuListResult = await storeDao.selectCategoryDetailMenu(connection, categoryId);
    connection.release();    
    return mainStoreDetailMenuListResult;
};

exports.retrieveStoreDetail = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeDetailResult = await storeDao.selectStoreDetailInfo(connection, storeId);
    connection.release();    
    return storeDetailResult;
};

exports.retrieveStoreActive = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeActiveResult = await storeDao.selectStoreActiveInfo(connection, storeId);
    connection.release();    
    return storeActiveResult;
};