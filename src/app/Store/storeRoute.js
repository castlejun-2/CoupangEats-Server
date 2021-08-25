module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 3. 키워드로 매장 검색 API
    app.get('/app/stores/:userId/keyword',jwtMiddleware,store.getStoresByKeyword); 

    // 7. 카테고리로 매장 조회 API
    app.get('/app/stores/:userId/category',jwtMiddleware,store.getStoresByCategory);

    // 9. 앱 메인화면 통합 조회 API
    app.get('/app/stores/:userId/main',jwtMiddleware,store.getMainScreen);

    // 18. 매장 메인화면 조회 API
    app.get('/app/stores/:userId/mainstore',jwtMiddleware,store.getStoreMain);

    // 19. 매장 세부정보 조회 API
    app.get('/app/stores/:userId/detail-store',jwtMiddleware,store.getStoreDetail);

    // 20. 매장 리뷰 조회 API
    app.get('/app/stores/:userId/review',jwtMiddleware,store.getReview);

    // 21. 리뷰 도움돼요 증가 API
    app.post('/app/stores/:userId/help-review',jwtMiddleware,store.postHelpReview);

    // 22. 리뷰 도움안돼요 증가 API
    app.post('/app/stores/:userId/nonhelp-review',jwtMiddleware,store.postNotHelpReview);

    // 23. 리뷰 작성 API
    app.post('/app/stores/:userId/review',jwtMiddleware,store.postReview);

    // 24. 리뷰 수정 API
    app.patch('/app/stores/:userId/review',jwtMiddleware,store.updateReview);

    // 29. 치타배달 매장 조회 API
    app.get('/app/stores/:userId/cheetah',jwtMiddleware,store.getStoresByCheetah);

    // 30. 매장 배달팁 상세 조회 API
    app.get('/app/stores/:userId/delivery-tip',jwtMiddleware,store.getDelieveryTip);

    // 34. 앱 메인화면 신규매장 조회 API
    app.get('/app/stores/:userId/main-new',jwtMiddleware,store.getMainScreenByNewStore);

    // 35. 앱 메인화면 인기매장 조회 API
    app.get('/app/stores/:userId/main-popular',jwtMiddleware,store.getMainScreenByPopularStore);

    // 36. 앱 메인화면 골라먹는 매장 조회 API
    app.get('/app/stores/:userId/main-pick',jwtMiddleware,store.getMainScreenByPickStore);

    // 43. 치타배달 미리보기 팜업 API
    app.get('/app/stores/:userId/preview-cheetah',jwtMiddleware,store.getStoresByPreviewCheetah);

    // 45. 앱 메인화면 신규매장 조회 API (비회원용)
    app.get('/app/stores/:userId/main-new',store.getMainScreenByNewStoreForAll);

    // 46. 앱 메인화면 인기매장 조회 API (비회원용)
    app.get('/app/stores/:userId/main-popular',store.getMainScreenByPopularStoreForAll);
    
    // 47. 앱 메인화면 골라먹는 매장 조회 API (비회원용)
     app.get('/app/stores/:userId/main-pick',store.getMainScreenByPickStoreForAll);
};