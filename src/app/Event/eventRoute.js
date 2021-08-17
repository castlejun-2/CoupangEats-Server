module.exports = function(app){
    const event = require('./eventController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 15. 이벤트 조회 API
    app.get('/app/events/:userId',jwtMiddleware,event.getEvent); 

};