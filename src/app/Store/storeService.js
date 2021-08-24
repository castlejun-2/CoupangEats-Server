const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const storeProvider = require("./storeProvider");
const storeDao = require("./storeDao");
const orderProvider = require("../../app/Order/orderProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

//리뷰 도움돼요 증가
exports.postReviewIsHelp = async function (userId, reviewId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const alreadyHelpCheck = await storeProvider.checkAlreadyHelpCheck(connection, userId, reviewId);
        
        if(alreadyHelpCheck[0].status === 'ACTIVE'){
            const updateIsHelpReview = await storeDao.changeUserIsHelpReview(connection, userId, reviewId);
            const minusReviewIsHelp = await storeDao.changeReviewIsHelp(connection, reviewId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
        else if(!alreadyHelpCheck[0].status){
            const postIsHelpReview = await storeDao.insertUserIsHelpReview(connection, userId, reviewId);
        }
        else if(alreadyHelpCheck[0].status === 'DELETE'){
            const updateIsHelpReview = await storeDao.updateUserIsHelpReview(connection, userId, reviewId);
        }
        const plusReviewIsHelp = await storeDao.updateReviewIsHelp(connection, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - Update Review Is Help Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//리뷰 도움안돼요 증가
exports.postReviewIsNotHelp = async function (userId, reviewId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const alreadyNotHelpCheck = await storeProvider.checkAlreadyNotHelpCheck(connection, userId, reviewId);
        
        if(alreadyNotHelpCheck[0].status === 'ACTIVE'){
            const updateIsNotHelpReview = await storeDao.changeUserIsNotHelpReview(connection, userId, reviewId);
            const minusReviewIsNotHelp = await storeDao.changeReviewIsNotHelp(connection, reviewId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
        else if(!alreadyNotHelpCheck[0].status){
            const postIsNotHelpReview = await storeDao.insertUserIsNotHelpReview(connection, userId, reviewId);
        }
        else if(alreadyNotHelpCheck[0].status === 'DELETE'){
            const updateIsNotHelpReview = await storeDao.updateUserIsNotHelpReview(connection, userId, reviewId);
        }
        const plusReviewIsNotHelp = await storeDao.updateReviewIsNotHelp(connection, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - Update Review Is Not Help Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//리뷰 작성
exports.postUserReview = async function (userId, orderId, starValue, review, reviewImageUrl) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const userOrderCheck = await orderProvider.userOrderIdEqualCheck(connection, userId, orderId);
        
        if(userOrderCheck[0].exist === 0){
            connection.release();
            return errResponse(baseResponse.ORDERID_AND_USERID_DO_NOT_MATCH);
        }
        else{
            const registerReview = await storeDao.insertReviewInfo(connection, userId, orderId, userOrderCheck[0].storeId, starValue, review);
            connection.release();
            return registerReview;
        }
    } catch (err) {
        logger.error(`App - Insert Review Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//리뷰 이미지 작성
exports.postUserReviewImage = async function (reviewId, reviewImageUrl) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
            const registerReviewImage = await storeDao.insertReviewImage(connection, reviewId, reviewImageUrl);
            connection.release();
            return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Insert ReviewImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};