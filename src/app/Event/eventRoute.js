module.exports = function(app){
    const event = require('./eventController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 8. 이벤트 진행중인 쿠폰 리스트 조회 API
    app.get('/app/events/:userId/coupon',jwtMiddleware,event.getCouponList);

    // 15. 이벤트 조회 API
    app.get('/app/events/:userId',event.getEvent); 

};