module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 30. 회원가입 API
    app.post('/app/users/sign-up', user.postUsers);

    // 31. 로그인 및 jwt 생성 API
    app.post('/app/login', user.login);

    // 32. 로그아웃 API
    app.post('/app/:userId/logout', jwtMiddleware, user.logout);

    // 33. 주소지 추가 API (일반 주소)
    app.post('/app/users/:userId/address',jwtMiddleware, user.postAddress);
    
    // 33-1. 주소지 추가 API (클라이언트 요청 버전)
    app.post('/app/users/address',jwtMiddleware, user.registerAddress);

    // 34. 상세 주소 수정 API
    app.patch('/app/users/:userId/detail-address',jwtMiddleware, user.detailAddress);

    // 35. 기본 배송지 설정 API
    app.patch('/app/users/:userId/default-address',jwtMiddleware, user.defaultAddress);

    // 36. 기본 배송지 조회 API
    app.get('/app/users/:userId/default-address',jwtMiddleware, user.getdefaultAddress);

    // 37. 배송지 목록 조회 API
    app.get('/app/users/:userId/address',jwtMiddleware, user.getAddressList);

    // 38. 즐겨찾기 추가 및 삭제 API
    app.post('/app/users/:userId/bookmark',jwtMiddleware, user.updateBookMark);

    // 39. 즐겨찾기 조회 API (+정렬기능)
    app.get('/app/users/:userId/bookmark',jwtMiddleware, user.getBookMark);

    // 40. 사용자 등록 쿠폰 조회 API
    app.get('/app/users/:userId/coupon',jwtMiddleware, user.getCoupon);

    // 41. 사용자 쿠폰 등록 API
    app.post('/app/users/:userId/coupon',jwtMiddleware, user.postCoupon);

    // 42. 카드 조회 API
    app.get('/app/users/:userId/card',jwtMiddleware, user.getCard);

    // 43. 카드 삭제 API
    app.patch('/app/users/:userId/card',jwtMiddleware, user.deleteCard);

    // 44. 공지사항 조회 API
    app.get('/app/users/:userId/notice',jwtMiddleware, user.getNotice);

    // 45. 영수증 조회 API
    app.get('/app/users/:userId/receipt',jwtMiddleware, user.getReceipt);

    // 46. MyPage 유저 이름 및 핸드폰 번호 조회 API
    app.get('/app/users/:userId/name-number',jwtMiddleware, user.getMyPage);

    // 47. 작성한 리뷰 조회 API
    app.get('/app/users/:userId/review',jwtMiddleware, user.getReview);

    // 48. 문자인증(SENS를 통한) 전송 API
    app.post('/app/send', user.send);

    // 49. 문자인증(SENS를 통한) 검증 API
    app.post('/app/verify', user.verify);

    // 50. 푸쉬 알림 API
    app.post('/app/push', user.pushAlarm);

};