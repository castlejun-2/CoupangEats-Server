module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 9. 키워드로 매장 검색 API
    app.get('/app/stores/:userId/keyword',jwtMiddleware,store.getStoresByKeyword); 

    // 10. 카테고리로 매장 조회 API
    app.get('/app/stores/:userId/category',jwtMiddleware,store.getStoresByCategory);

    // 11. 앱 메인화면 통합 조회 API
    app.get('/app/stores/:userId/main',jwtMiddleware,store.getMainScreen);
    
    // 12. 메뉴 정보 조회 API
    app.get('/app/stores/:userId/menu',jwtMiddleware,store.getMenu); 

    // 13. 매장 메인화면 조회 API
    app.get('/app/stores/:userId/mainstore',jwtMiddleware,store.getStoreMain);

    // 14. 매장 세부정보 조회 API
    app.get('/app/stores/:userId/detail-store',jwtMiddleware,store.getStoreDetail);

    // 15. 매장 리뷰 조회 API
    app.get('/app/stores/:userId/review',jwtMiddleware,store.getReview);

    // 16. 리뷰 도움돼요 증가 API
    app.post('/app/stores/:userId/help-review',jwtMiddleware,store.postHelpReview);

    // 17. 리뷰 도움안돼요 증가 API
    app.post('/app/stores/:userId/nonhelp-review',jwtMiddleware,store.postNotHelpReview);

    // 18. 리뷰 작성 API
    app.post('/app/stores/:userId/review',jwtMiddleware,store.postReview);

    // 19. 리뷰 수정 API
    app.patch('/app/stores/:userId/review',jwtMiddleware,store.updateReview);

    // 20. 치타배달 매장 조회 API
    app.get('/app/stores/:userId/cheetah',jwtMiddleware,store.getStoresByCheetah);

    // 21. 치타배달 미리보기 팜업 API
    app.get('/app/stores/:userId/preview-cheetah',jwtMiddleware,store.getStoresByPreviewCheetah);
    
    // 22. 매장 배달팁 상세 조회 API
    app.get('/app/stores/:userId/delivery-tip',jwtMiddleware,store.getDelieveryTip);

    // 23. 앱 메인화면 신규매장 조회 API
    app.get('/app/stores/:userId/main-new',jwtMiddleware,store.getMainScreenByNewStore);

    // 24. 앱 메인화면 인기매장 조회 API
    app.get('/app/stores/:userId/main-popular',jwtMiddleware,store.getMainScreenByPopularStore);

    // 25. 앱 메인화면 골라먹는 매장 조회 API
    app.get('/app/stores/:userId/main-pick',jwtMiddleware,store.getMainScreenByPickStore);

    // 26. 앱 메인화면 신규매장 조회 API (비회원용)
    app.get('/app/stores/main-new',store.getMainScreenByNewStoreForAll);

    // 27. 앱 메인화면 인기매장 조회 API (비회원용)
    app.get('/app/stores/main-popular',store.getMainScreenByPopularStoreForAll);
    
    // 28. 앱 메인화면 골라먹는 매장 조회 API (비회원용)
     app.get('/app/stores/main-pick',store.getMainScreenByPickStoreForAll);
};