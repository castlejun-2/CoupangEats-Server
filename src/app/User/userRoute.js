module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 29. 회원가입 API
    app.post('/app/users/sign-up', user.postUsers);

    // 30. 로그인 및 jwt 생성 API
    app.post('/app/login', user.login);

    // 31. 로그아웃 API
    app.post('/app/:userId/logout', jwtMiddleware, user.logout);

    // 32. 주소지 추가 API (일반 주소)
    app.post('/app/users/:userId/add-address',jwtMiddleware, user.postAddress);

    // 33. 상세 주소 수정 API
    app.patch('/app/users/:userId/detail-address',jwtMiddleware, user.detailAddress);

    // 34. 기본 배송지 설정 API
    app.patch('/app/users/:userId/default-address',jwtMiddleware, user.defaultAddress);

    // 35. 기본 배송지 조회 API
    app.get('/app/users/:userId/default-address',jwtMiddleware, user.getdefaultAddress);

    // 36. 배송지 목록 조회 API
    app.get('/app/users/:userId/address',jwtMiddleware, user.getAddressList);

    // 37. 즐겨찾기 추가 및 삭제 API
    app.post('/app/users/:userId/bookmark',jwtMiddleware, user.updateBookMark);

    // 38. 즐겨찾기 조회 API (+정렬기능)
    app.get('/app/users/:userId/bookmark',jwtMiddleware, user.getBookMark);

    // 39. 사용자 등록 쿠폰 조회 API
    app.get('/app/users/:userId/coupon',jwtMiddleware, user.getCoupon);

    // 40. 사용자 쿠폰 등록 API
    app.post('/app/users/:userId/coupon',jwtMiddleware, user.postCoupon);

    // 41. 카드 조회 API
    app.get('/app/users/:userId/card',jwtMiddleware, user.getCard);

    // 42. 카드 삭제 API
    app.patch('/app/users/:userId/card',jwtMiddleware, user.deleteCard);

    // 43. 공지사항 조회 API
    app.get('/app/users/:userId/notice',jwtMiddleware, user.getNotice);

    // 44. 영수증 조회 API
    app.get('/app/users/:userId/receipt',jwtMiddleware, user.getReceipt);

    // 45. MyPage 유저 이름 및 핸드폰 번호 조회 API
    app.get('/app/users/:userId/name-number',jwtMiddleware, user.getMyPage);

    // 46. 작성한 리뷰 조회 API
    app.get('/app/users/:userId/review',jwtMiddleware, user.getReview);

    // 47. 문자인증(SENS를 통한) API
    app.post('/send', user.send);
    app.post('/verify', user.verify);
};