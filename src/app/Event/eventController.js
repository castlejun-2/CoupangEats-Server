const jwtMiddleware = require("../../../config/jwtMiddleware");
const eventProvider = require("../../app/Event/eventProvider");
const eventService = require("../../app/Event/eventService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 15
 * API Name : 이벤트 조회 API
 * [GET] /app/events/:userId
 * path variable : userId
 */
exports.getEvent = async function (req, res) {
  
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
  
    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const eventList = await eventProvider.retrieveEventList();
        return res.send(response(baseResponse.SUCCESS, eventList)); 
    }  
}

/**
 * API No. 16
 * API Name : 이벤트 진행중인 쿠폰 조회 API
 * [GET] /app/events/:userId/coupon
 * path variable : userId
 */
exports.getCouponList = async function (req, res) {
  
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
  
    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const couponList = await eventProvider.retrieveCouponList();
        return res.send(response(baseResponse.SUCCESS, couponList)); 
    }  
}
