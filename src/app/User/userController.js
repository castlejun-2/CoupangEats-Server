const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
 exports.getTest = async function (req, res) {
     return res.send(response(baseResponse.SUCCESS))
 }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users/sign-up
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, username, phonenumber
     */
    const {email, password, username, phonenumber} = req.body;

    // 이메일 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 비밀번호 빈 값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));        

    // 이름 빈 값 체크
    if (!username)
        return res.send(response(baseResponse.SIGNUP_USERNAME_EMPTY));

    // 핸드폰 번호 빈 값 체크
    if (!phonenumber)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    const signUpResponse = await userService.createUser(
        email,
        password,
        username,
        phonenumber
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
/* exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    /**
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
}; */

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 * */
 /* exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    /**
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
}; */


/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // 이메일 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    if (!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));    

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 8
 * API Name : 로그아웃 API
 * [POST] /users/:userId/logout
 */
 exports.logout = async function (req, res) {

    // Request JWT Token
    const userIdFromJWT = req.verifiedToken.userId;

    // Request body
    const userId = req.params.userId;

    // Validation Check (Request Error)
    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); 

    const checkUserIdx = await userProvider.userCheck(userId);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    // Result
    const logoutResult = await userService.logout(userId);

    return res.send(logoutResult);

};

/**
 * API No. 4
 * API Name : 주소지 추가 API
 * [POST] /app/users/:userId/add-address
 * path variable : userId
 * body : address, detailAddress, infoAddress, category
 */
 exports.postAddress = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {address, detailAddress, infoAddress, latitude, longitude, category} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!address)
            return res.send(errResponse(baseResponse.SIGNUP_ADDRESS_EMPTY));
        if(!latitude)
            return res.send(errResponse(baseResponse.SIGNIN_LATITUDE_EMPTY));
        if(!longitude)
            return res.send(errResponse(baseResponse.SIGNIN_LONGITUDE_EMPTY));                
        if(!category)
            res.send(errResponse(baseResponse.ADDRESS_CATEGORY_EMPTY));

        const postAddressInfo = await userService.postAddAddress(userId, address, detailAddress, infoAddress, latitude, longitude, category)
        return res.send(postAddressInfo);
    }
};

/**
 * API No. 5
 * API Name : 상세 주소 변경 API
 * [PATCH] /app/users/:userId/detail-address
 * path variable : userId
 * body : detailAddress, infoAddress, category
 */
 exports.detailAddress = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {detailAddress, infoAddress, category} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!category)
            res.send(errResponse(baseResponse.ADDRESS_CATEGORY_EMPTY));

        const updateAddressInfo = await userService.updateDetailAddress(userId, detailAddress, infoAddress, category)
        return res.send(updateAddressInfo);
    }
};

/**
 * API No. 6
 * API Name : 기분 주소시 설정 API
 * [PATCH] /app/users/:userId/detail-address
 * path variable : userId
 * body : detailAddress, infoAddress, category
 */
 exports.defaultAddress = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const addressId = req.query.addressId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!addressId)
            res.send(errResponse(baseResponse.ADDRESS_DEFAULT_EMPTY));

        const setDefaultAddressInfo = await userService.setDefaultAddress(userId, addressId)
        return res.send(response(baseResponse.ADDRESS_DEFAULT_SETTING_SUCCESS));
    }
};

/**
 * API No. 13
 * API Name : 매장 즐겨찾기 추가 및 취소 API
 * [POST] /app/users/:userId/bookmark
 * path variable : userId
 * body : storeId
 */
 exports.updateBookMark = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {storeId} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!storeId)
            return res.send(errResponse(baseResponse.SIGNIN_BOOKMARK_STORE_EMPTY));
        
        const checkUserBookMark = await userProvider.bookMarkCheck(userId, storeId);
        
        if (checkUserBookMark[0].exist === 1){ //이미 즐겨찾기에 추가된 매장인지 확인
            const deleteBookMarkInfo = await userService.deleteUserBookMark(userId, storeId)
            return res.send(deleteBookMarkInfo);
        }            
        else {
            const postBookMarkInfo = await userService.postUserBookMark(userId, storeId)
            return res.send(postBookMarkInfo);
        }
    }
};

/**
 * API No. 14
 * API Name : 즐겨찾기 조회 API
 * [GET] /app/users/:userId/bookmark
 * path variable : userId
 */
 exports.getBookMark = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const filter = req.query.filter;

    let result = [];
    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {    
        const countBookMarkResult = await userProvider.getBookMarkCount(userId); //즐겨찾기 갯수 count
        result.push({'BookMark Store Count': countBookMarkResult}); 

        const getBookMarkResult = await userProvider.getBookMark(userId, filter) //즐겨찾기 스토어 리스트
        result.push({'BookMark Store': getBookMarkResult});

        return res.send(response(baseResponse.SUCCESS, getBookMarkResult));
    }
};

/**
 * API No. 16
 * API Name : 사용자 등록 쿠폰 조회 API
 * [GET] /app/users/:userId/getCoupon
 * path variable : userId
 */
 exports.getCoupon = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const getCouponResult = await userProvider.getCoupon(userId);
        return res.send(response(baseResponse.SUCCESS, getCouponResult));
    }
};

/**
 * API No. 17
 * API Name : 사용자 쿠폰 등록 API
 * [post] /app/users/:userId/getCoupon
 * path variable : userId
 */
 exports.postCoupon = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {couponId} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        if(!couponId)
            return res.send(errResponse(baseResponse.SIGNIN_COUPONID_EMPTY));

        const checkCoupon = await userProvider.checkCoupon(userId, couponId);   
        if (checkCoupon[0].exist === 1) //이미 등록된 쿠폰인지 확인
            return res.send(errResponse(baseResponse.SIGNIN_COUPON_EXIST));
        else {
            const postCouponResult = await userService.postCoupon(userId, couponId);
            return res.send(postCouponResult);
        }
    }
};

/**
 * API No. 25
 * API Name : 카드 조회 API
 * [GET] /app/users/:userId/card
 * path variable : userId
 */
 exports.getCard = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const getCardResult = await userProvider.getUserCard(userId);
        return res.send(response(baseResponse.SUCCESS, getCardResult));
    }
};

/**
 * API No. 26
 * API Name : 카드 삭제 API
 * [patch] /app/users/:userId/card
 * path variable : userId
 */
 exports.deleteCard = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {cardId} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        if(!cardId)
            return res.send(errResponse(baseResponse.SIGNIN_CARDID_EMPTY));

        const deleteCardResult = await userService.deleteCard(userId, cardId);
        return res.send(deleteCardResult);
        
    }
};

/**
 * API No. 27
 * API Name : 공지사항 조회 API
 * [GET] /app/users/:userId/notice
 * path variable : userId
 */
 exports.getNotice = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const getNoticeResult = await userProvider.getUserNotice();
        return res.send(response(baseResponse.SUCCESS, getNoticeResult));
    }
};

/**
 * API No. 28
 * API Name : 영수증 조회 API
 * [GET] /app/users/:userId/receipt
 * path variable : userId
 */
 exports.getReceipt = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const orderId = req.query.orderId;
    const result = [];

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        if(!orderId)
            return res.send(errResponse(baseResponse.SIGNIN_ORDERID_EMPTY));

        const getReceiptTopInfo = await userProvider.getUserReceiptTopInfo(userId, orderId); //영수증 상단 정보 가져오기
        result.push(getReceiptTopInfo);

        const getReceiptDetailMenuInfo = await userProvider.getUserReceiptMenuInfo(userId, orderId);
        for(let i=0;i<getReceiptDetailMenuInfo.length;i++){
            let detailMenuResult = await userProvider.getUserDetailMenuInRecipt(getReceiptDetailInfo[i].MenuIdx);
            result.push({"Menu Name": getReceiptDetailMenuInfo[i].menuName},
                        {"Menu Price": getReceiptDetailMenuInfo[i].menuName},
                        detailMenuResult);
        }
        let orderPrice = pasrseInt(getReceiptDetailMenuInfo[0].sumCost)-parseInt(getReceiptDetailMenuInfo[0].deliveryTip)
        result.push({"Order Price": orderPrice})
        result.push({"Delivery Tip": getReceiptDetailMenuInfo[0].deliveryTip})
        result.push({"Order Price": getReceiptDetailMenuInfo[0].sumCost})
        return res.send(response(baseResponse.SUCCESS, result));
    }
};


/**
 * API No. 40
 * API Name : 사용자 기본 배송지 조회 API
 * [GET] /app/users/:userId/default-address
 * path variable : userId
 */
 exports.getdefaultAddress = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const getDefaultAddressResult = await userProvider.getUserDefaultAddress(userId);
        return res.send(response(baseResponse.SUCCESS, getDefaultAddressResult));
    }
};

/**
 * API No. 41
 * API Name : MyPage 유저 이름 및 핸드폰 번호 조회 API
 * [GET] /app/users/:userId/name-number
 * path variable : userId
 */
 exports.getMyPage = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const getMyPageResult = await userProvider.getUserMyPage(userId);
        return res.send(response(baseResponse.SUCCESS, getMyPageResult));
    }
};

/**
 * API No. 42
 * API Name : 배송지 목록 조회 API
 * [GET] /app/users/:userId/address
 * path variable : userId
 */
 exports.getAddressList = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        const getMyAddressResultResult = await userProvider.getUserAddressList(userId);
        return res.send(response(baseResponse.SUCCESS, getMyAddressResultResult));
    }
};

/**
 * API No. 44
 * API Name : 작성한 리뷰 조회 API
 * [GET] /app/users/:userId/review
 * path variable : userId
 */
 exports.getReview = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const orderId = req.query.orderId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        if(!orderId)
            return res.send(errResponse(baseResponse.SIGNIN_ORDERID_FOR_GET_REVIEW_EMPTY));
        const getMyReviewResult = await userProvider.getMyReviewInfo(userId, orderId);
        return res.send(response(baseResponse.SUCCESS, getMyReviewResult));
    }
};
/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
