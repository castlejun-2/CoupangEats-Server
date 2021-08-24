module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest);

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users/sign-up', user.postUsers);

    // 2. 로그인 API (JWT 생성)
    app.post('/app/login', user.login);

    // 31. 로그아웃 API
    app.post('/app/:userId/logout', jwtMiddleware, user.logout);

    // 4. 주소지 추가 API (일반 주소)
    app.post('/app/users/:userId/add-address',jwtMiddleware, user.postAddress);

    // 5. 상세 주소 수정 API
    app.patch('/app/users/:userId/detail-address',jwtMiddleware, user.detailAddress);

    // 6. 기본 배송지 설정 API
    app.patch('/app/users/:userId/default-address',jwtMiddleware, user.defaultAddress);

    // 13. 매장 즐겨찾기 추가 및 삭제 API
    app.post('/app/users/:userId/bookmark',jwtMiddleware, user.updateBookMark);

    // 14. 즐겨찾기 조회 API (+정렬기능)
    app.get('/app/users/:userId/bookmark',jwtMiddleware, user.getBookMark);

    // 16. 사용자 등록 쿠폰 조회 API
    app.get('/app/users/:userId/coupon',jwtMiddleware, user.getCoupon);

    // 17. 사용자 쿠폰 등록 API
    app.post('/app/users/:userId/coupon',jwtMiddleware, user.postCoupon);

    // 25. 카드 조회 API
    app.get('/app/users/:userId/card',jwtMiddleware, user.getCard);

    // 26. 카드 삭제 API
    app.patch('/app/users/:userId/card',jwtMiddleware, user.deleteCard);

    // 27. 공지사항 조회 API
    app.get('/app/users/:userId/notice',jwtMiddleware, user.getNotice);

    // 40. 기본 배송지 조회 API
    app.get('/app/users/:userId/default-address',jwtMiddleware, user.getdefaultAddress);

    // 41. MyPage 유저 이름 및 핸드폰 번호 조회 API
    app.get('/app/users/:userId/name-number',jwtMiddleware, user.getMyPage);

    // 42. 배송지 목록 조회 API
    app.get('/app/users/:userId/address',jwtMiddleware, user.getAddressList);

    // 44. 작성한 리뷰 조회 API
    app.get('/app/users/:userId/review',jwtMiddleware, user.getReview);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API