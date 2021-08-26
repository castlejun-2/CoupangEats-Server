module.exports = function(app){
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 3. 과거 주문 내역 조회 API
    app.get('/app/orders/:userId/history', jwtMiddleware, order.getOrderHistory);

    // 4. 카트에 담기 API (transaction 적용)
    app.post('/app/orders/:userId/in-cart', jwtMiddleware, order.postCart);

    // 4-1. 카트에 담기 API (클라이언트 요청버전)
    app.post('/app/orders/in-cart', jwtMiddleware, order.registerCart);

    // 5. 카트에 담긴 정보 미리보기 조회 API
    app.get('/app/orders/:userId/preview-cart', jwtMiddleware, order.getCart);

    // 6. 카트 비우기 API
    app.patch('/app/orders/:userId/in-cart', jwtMiddleware, order.deleteCart);

    // 7. 새로 카트에 담기 API
    app.post('/app/orders/:userId/new-cart', jwtMiddleware, order.newCart);

    // 8. 카트에 담긴 정보 상세 조회 API
    app.get('/app/orders/:userId/in-cart', jwtMiddleware, order.getDetailCart);

    // 9. 결제하기 API
    app.post('/app/orders/:userId/payment', jwtMiddleware, order.postOrder);

    // 9-1. 결제하기 API (클라이언트 요청버전)
    app.post('/app/orders/payment', jwtMiddleware, order.registerOrder);
};