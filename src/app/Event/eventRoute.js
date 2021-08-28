module.exports = function(app){
    const event = require('./eventController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 이벤트 진행중인 쿠폰 리스트 조회 API
    app.get('/app/events/coupon',event.getCouponList);

    // 2. 이벤트 조회 API
    app.get('/app/events',event.getEvent); 
};