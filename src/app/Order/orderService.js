const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const orderProvider = require("./orderProvider");
const orderDao = require("./orderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.postUserOrder = async function (userId, storeId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postOrderResult = await orderDao.postOrderInfo(connection, userId, storeId);
        connection.release();
        return postOrderResult;
    } catch (err) {
        logger.error(`App - Post OrderInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
}

//주문 세부사항 등록
exports.postOrderDetail = async function (orderId, orderDetail) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postOrderDetailParams = [orderId, orderDetail.menuId, orderDetail.menuCategoryId, orderDetail.menuDetailId];
        const postOrderDetailResult = await orderDao.postUserOrderInfoInCart(connection, postOrderDetailParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Post OrderInfo In Cart error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
};
