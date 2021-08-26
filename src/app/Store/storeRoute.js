module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 10. 키워드로 매장 검색 API
    app.get('/app/stores/:userId/keyword',jwtMiddleware,store.getStoresByKeyword); 

    // 11. 카테고리로 매장 조회 API
    app.get('/app/stores/:userId/category',jwtMiddleware,store.getStoresByCategory);

    // 12. 앱 메인화면 통합 조회 API
    app.get('/app/stores/:userId/main',jwtMiddleware,store.getMainScreen);
    
    // 13. 메뉴 정보 조회 API
    app.get('/app/stores/:userId/menu',jwtMiddleware,store.getMenu); 

    // 14. 매장 메인화면 조회 API
    app.get('/app/stores/:userId/mainstore',jwtMiddleware,store.getStoreMain);

    // 15. 매장 세부정보 조회 API
    app.get('/app/stores/:userId/detail-store',jwtMiddleware,store.getStoreDetail);

    // 16. 매장 리뷰 조회 API
    app.get('/app/stores/:userId/review',jwtMiddleware,store.getReview);

    // 17. 리뷰 도움돼요 증가 API (transaction 적용)
    app.post('/app/stores/:userId/help-review',jwtMiddleware,store.postHelpReview);

    // 18. 리뷰 도움안돼요 증가 API (transaction 적용)
    app.post('/app/stores/:userId/nonhelp-review',jwtMiddleware,store.postNotHelpReview);

    // 19. 리뷰 작성 API (transaction 적용)
    app.post('/app/stores/:userId/review',jwtMiddleware,store.postReview);

    // 20. 리뷰 수정 API (transaction 적용)
    app.patch('/app/stores/:userId/review',jwtMiddleware,store.updateReview);

    // 21. 치타배달 매장 조회 API
    app.get('/app/stores/:userId/cheetah',jwtMiddleware,store.getStoresByCheetah);

    // 22. 치타배달 미리보기 팜업 API
    app.get('/app/stores/:userId/preview-cheetah',jwtMiddleware,store.getStoresByPreviewCheetah);
    
    // 23. 매장 배달팁 조회 API
    app.get('/app/stores/:userId/delivery-tip',jwtMiddleware,store.getDelieveryTip);

    // 24. 앱 메인화면 신규매장 조회 API
    app.get('/app/stores/:userId/main-new',jwtMiddleware,store.getMainScreenByNewStore);

    // 25. 앱 메인화면 인기매장 조회 API
    app.get('/app/stores/:userId/main-popular',jwtMiddleware,store.getMainScreenByPopularStore);

    // 26. 앱 메인화면 골라먹는 매장 조회 API
    app.get('/app/stores/:userId/main-pick',jwtMiddleware,store.getMainScreenByPickStore);

    // 27. 앱 메인화면 신규매장 조회 API (비회원용)
    app.get('/app/stores/main-new',store.getMainScreenByNewStoreForAll);

    // 28. 앱 메인화면 인기매장 조회 API (비회원용)
    app.get('/app/stores/main-popular',store.getMainScreenByPopularStoreForAll);
    
    // 29. 앱 메인화면 골라먹는 매장 조회 API (비회원용)
     app.get('/app/stores/main-pick',store.getMainScreenByPickStoreForAll);
};