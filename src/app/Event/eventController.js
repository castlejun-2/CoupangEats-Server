const jwtMiddleware = require("../../../config/jwtMiddleware");
const eventProvider = require("../../app/Event/eventProvider");
const eventService = require("../../app/Event/eventService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 이벤트 진행중인 쿠폰 조회 API
 * [GET] /app/events/coupon
 */
 exports.getCouponList = async function (req, res) {
  
    const couponList = await eventProvider.retrieveCouponList();
    return res.send(response(baseResponse.SUCCESS, couponList)); 
}

/**
 * API No. 2
 * API Name : 이벤트 조회 API
 * [GET] /app/events/:userId
 * path variable : userId
 */
exports.getEvent = async function (req, res) {
  
    const eventList = await eventProvider.retrieveEventList();
    return res.send(response(baseResponse.SUCCESS, eventList));   
}

