module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 3. 키워드로 매장 검색 API
    app.get('/app/stores/:userId/keyword',jwtMiddleware,store.getStoresByKeyword); 

    // 7. 카테고리로 매장 조회 API
    app.get('/app/stores/:userId/category',jwtMiddleware,store.getStoresByCategory);

    // 9. 메인화면 신규 입점 및 인기 매장 조회 API
    app.get('/app/stores/:userId/main',jwtMiddleware,store.getMainScreen);

    // 18. 매장 메인화면 조회 API
    app.get('/app/stores/:userId/mainstore',jwtMiddleware,store.getStoreMain);

    // 19. 매장 세부정보 조회 API
    app.get('/app/stores/:userId/detail-store',jwtMiddleware,store.getStoreDetail);
 
};