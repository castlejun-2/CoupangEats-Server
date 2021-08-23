const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");

//카트정보 가져오기
exports.retrieveUserCartInfo = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartinfolistResult = await orderDao.selectCartInfo(connection,userId);
    connection.release();    
    return cartinfolistResult;
    
};

//카트정보 가져오기
exports.retrieveUserCartInfo = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartinfolistResult = await orderDao.selectCartInfo(connection,userId);
    connection.release();    
    return cartinfolistResult;
    
};

//동일 매장정보 가져오기
exports.retrieveSameStoreInCart = async function (userId, storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const sameStoreInCartResult = await orderDao.selectSameStoreInCartInfo(connection, userId, storeId);
    connection.release();    
    return sameStoreInCartResult;
    
};

//카트 주문IDX 가져오기
exports.retrieveSameOrderInCart = async function (userId, storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const sameOrderInCartResult = await orderDao.selectSameOrderInCartInfo(connection, userId, storeId);
    connection.release();    
    return sameOrderInCartResult;
    
};