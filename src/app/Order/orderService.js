const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const orderProvider = require("./orderProvider");
const userProvider = require("../../app/User/userProvider");
const orderDao = require("./orderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.postUserOrder = async function (userId, storeId, menuId, menuCount, orderId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        if(!orderId){
            const getUserCardResult = await userProvider.getUserDefaultCard(userId);
            const postOrderResult = await orderDao.postOrderInfo(connection, userId, storeId, getUserCardResult[0].cardId);          
            const postOrderTotalResult = await orderDao.postOrderTotalInfo(connection, postOrderResult[0].orderIdx, menuId, menuCount);
            connection.commit();
            return postOrderTotalResult;
        }
        else{
            const connection = await pool.getConnection(async (conn) => conn);
            const postOrderWithIdTotalResult = await orderDao.postOrderTotalInfo(connection, orderId, menuId, menuCount);
            connection.commit();
            return postOrderWithIdTotalResult;
        }
    } catch (err) {
        connection.rollback();
        logger.error(`App - Post OrderInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    } finally {
        connection.release();
    }
}

//주문 세부사항 등록
exports.postOrderDetail = async function (orderId, orderDetail) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postOrderDetailParams = [orderId, orderDetail.menuCategoryId, orderDetail.menuDetailId];
        const postOrderDetailResult = await orderDao.postUserOrderInfoInCart(connection, postOrderDetailParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Post Order Detail Info In Cart error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
};

//카트 비우기
exports.deleteInCart = async function (userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteCartResult = await orderDao.deleteUserInCart(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Delete In Cart error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
};

//주문 총 비용 등록
exports.postTotalCost = async function (orderId, deliveryTip, sumPrice) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postTotalCostResult = await orderDao.posttotalCostInOrderInfo(connection, orderId, deliveryTip, sumPrice);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Post TotalCost In OrderInfo error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
};

//결제하기
exports.postOrderStatus = async function (userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const checkOrderInCart = await orderProvider.checkUserOrder(userId);
        const postOrderResult = await orderDao.postUserOrder(connection, userId);

        
        if(!checkOrderInCart[0]){
            connection.release();
            return errResponse(baseResponse.CART_IN_EMPTY);
        }
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Post Order error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
};