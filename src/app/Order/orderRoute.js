module.exports = function(app){
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 32. 카트에 담기 API
    app.post('/app/orders/:userId/in-cart', jwtMiddleware, order.postCart); 

    // 33. 카트에 담긴 정보 미리보기 조회 API
    app.get('/app/orders/:userId/preview-cart', jwtMiddleware, order.getCart);

    // 37. 카트 비우기 API
    app.patch('/app/orders/:userId/in-cart', jwtMiddleware, order.deleteCart);

    // 38. 새로 카트에 담기 API
    app.post('/app/orders/:userId/new-cart', jwtMiddleware, order.newCart);

    // 39. 카트에 담긴 정보 상세 조회 API
    app.get('/app/orders/:userId/in-cart', jwtMiddleware, order.getDetailCart);
};