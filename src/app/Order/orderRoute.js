module.exports = function(app){
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 32. 카트에 담기 API
    app.post('/app/orders/:userId/in-cart', jwtMiddleware, order.postCart); 

    // 33. 카트에 담긴 정보 조회 API
    app.get('/app/orders/:userId/in-cart', jwtMiddleware, order.getCart);

    // 37. 카트 비우기 API
    app.patch('/app/orders/:userId/in-cart', jwtMiddleware, order.deleteCart);
};