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
