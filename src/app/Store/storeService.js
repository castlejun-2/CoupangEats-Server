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
        const alreadyHelpCheck = await storeProvider.checkAlreadyHelpCheck(userId, reviewId);
        if(!alreadyHelpCheck[0].status){
            const postIsHelpReview = await storeDao.insertUserIsHelpReview(connection, userId, reviewId);
        }
        else if(alreadyHelpCheck[0].status === 'ACTIVE'){
            const updateIsHelpReview = await storeDao.changeUserIsHelpReview(connection, userId, reviewId);
            const minusReviewIsHelp = await storeDao.changeReviewIsHelp(connection, reviewId);
            connection.release();
            return response(baseResponse.SUCCESS);
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
        const alreadyNotHelpCheck = await storeProvider.checkAlreadyNotHelpCheck(userId, reviewId);
        
        if(!alreadyNotHelpCheck[0]){
            const postIsNotHelpReview = await storeDao.insertUserIsNotHelpReview(connection, userId, reviewId);
        }
        else if(alreadyNotHelpCheck[0].status === 'ACTIVE'){
            const updateIsNotHelpReview = await storeDao.changeUserIsNotHelpReview(connection, userId, reviewId);
            const minusReviewIsNotHelp = await storeDao.changeReviewIsNotHelp(connection, reviewId);
            connection.release();
            return response(baseResponse.SUCCESS);
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
exports.postUserReview = async function (userId, orderId, starValue, review) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction(); //transaction 시작
        const userOrderCheck = await orderProvider.userOrderIdEqualCheck(userId, orderId);
        const existReviewCheck = await storeProvider.reviewExistCheck(userId, orderId);
        if(userOrderCheck[0].exist === 0){
            connection.commit();
            return errResponse(baseResponse.ORDERID_AND_USERID_DO_NOT_MATCH);
        }
        if(existReviewCheck[0].exist === 1){
            connection.commit();
            return errResponse(baseResponse.REVIEW_EXIST);
        }
        const registerReview = await storeDao.insertReviewInfo(connection, userId, orderId, userOrderCheck[0].storeId, starValue, review);
        connection.commit();
        return registerReview;

    } catch (err) {
        await connection.rollback();
        logger.error(`App - Insert Review Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally{
        connection.release();
    }
};

//리뷰 수정
exports.updateUserReview = async function (userId, orderId, reviewId, starValue, review) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const userOrderCheck = await orderProvider.userOrderIdEqualCheck(userId, orderId);
        if(userOrderCheck[0].exist === 0){ //validation check
            connection.commit();
            return errResponse(baseResponse.ORDERID_AND_USERID_DO_NOT_MATCH);
        }
        if(!starValue && !review){ //둘 다 수정하지 않는 경우
            connection.commit();
            return response(baseResponse.SUCCESS);
        }
        else if(!starValue){ //텍스트 리뷰만 수정하는 경우
            const updateTextReview = await storeDao.updateOnlyTextReviewInfo(connection, reviewId, review);
            connection.commit();
            return response(baseResponse.SUCCESS);
        }
        else if(!review){ //평점만 수정하는 경우
            const updateStarRatingReview = await storeDao.updateOnlyStarValueReviewInfo(connection, reviewId, starValue);
            connection.commit();
            return response(baseResponse.SUCCESS);
        }
        else{
            const updateReview = await storeDao.updateReviewInfo(connection, reviewId, starValue, review);
            connection.commit();
            return response(baseResponse.SUCCESS);  
        }
    } catch (err) {
        await connection.rollback();
        logger.error(`App - Update Review Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally{
        connection.release();
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

//리뷰 이미지 삭제
exports.deleteUserReviewImage = async function (reviewId, reviewImageUrlIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
            const deleteReviewImage = await storeDao.deleteReviewImage(connection, reviewId, reviewImageUrlIdx);
            connection.release();
            return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Delete ReviewImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};