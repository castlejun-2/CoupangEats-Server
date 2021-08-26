const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const secret_key = require("../../../config/secret_sms");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const axios = require('axios');
const Cache = require('memory-cache');
const CryptoJS = require('crypto-js');

const date = Date.now().toString();
const uri = secret_key.NCP_serviceID;
const secretKey = secret_key.NCP_secretKey;
const accessKey = secret_key.NCP_accessKey;
const method = 'POST';
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const  hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);

//regix
// const admin = require('firebase-admin');
// const regPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/; // 비밀번호 정규표현식, 8~16 자 이내 숫자 + 영문
// const regUserName = /^[a-zA-Z]{2,8}$/; // 사용자 닉네임, 2~8 자 이내 영문

/**
 * API No. 30
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
 * API No. 31
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
 * API No. 32
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
 * API No. 33
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
 * API No. 34
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
 * API No. 35
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
 * API No. 36
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
 * API No. 37
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
 * API No. 38
 * API Name : 즐겨찾기 추가 및 취소 API
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
 * API No. 39
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
        const getBookMarkResult = await userProvider.getBookMark(userId, filter) //즐겨찾기 스토어 리스트
        result.push({'BookMark Store Count': countBookMarkResult[0].bookmarkStoreCount, 'BookMark Store': getBookMarkResult}); 

        return res.send(response(baseResponse.SUCCESS, getBookMarkResult));
    }
};

/**
 * API No. 40
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
 * API No. 41
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
 * API No. 42
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
 * API No. 43
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
 * API No. 44
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
 * API No. 45
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
        result.push({'Store Name': getReceiptTopInfo[0].storeName, "Order Date": getReceiptTopInfo[0].orderDate});

        const getReceiptDetailMenuInfo = await userProvider.getUserReceiptMenuInfo(userId, orderId);
        for(let i=0;i<getReceiptDetailMenuInfo.length;i++){
            let detailMenuResult = await userProvider.getUserDetailMenuInRecipt(getReceiptDetailMenuInfo[i].MenuIdx);
            result.push({"Menu Name": getReceiptDetailMenuInfo[i].menuName,
                         "Menu Price": getReceiptDetailMenuInfo[i].menuPrice,
                         detailMenuResult})
        }
        var orderPrice = (parseInt(getReceiptTopInfo[0].sumCost)-parseInt(getReceiptTopInfo[0].deliveryTip));
        result.push({"Order Price": orderPrice,
                    "Delivery Tip": getReceiptTopInfo[0].deliveryTip,
                    "Total Price": getReceiptTopInfo[0].sumCost,
                    "Payment Info": getReceiptTopInfo[0].paymentInfo})
        return res.send(response(baseResponse.SUCCESS, result));
    }
};

/**
 * API No. 46
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
 * API No. 47
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
 * API No. 48
 * API Name : 문자인증(SENS를 통한) 전송 API
 * [POST] /app/send
 */

exports.send = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;
  
    Cache.del(phoneNumber);
  
    //인증번호 생성
    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  
    Cache.put(phoneNumber, verifyCode.toString());
  
    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: '01055300651',
        content: `[쿠팡이츠] 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      }, 
      })
    .then(function (res) {
      res.send(response(baseResponse.SMS_SEND_SUCCESS));
    })
    .catch((err) => {
      if(err.res == undefined){
        res.send(response(baseResponse.SMS_SEND_SUCCESS));
      }
      else res.sned(errResponse(baseResponse.SMS_SEND_FAILURE));
    });
};

/**
 * API No. 49
 * API Name : 문자인증(SENS를 통한) 검증 API
 * [POST] /app/verify
 */
exports.verify = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;
    const verifyCode = req.body.verifyCode;

    const CacheData = Cache.get(phoneNumber);

    if (!CacheData) {
      return res.send(errResponse(baseResponse.FAILURE_SMS_AUTHENTICATION));
    } else if (CacheData !== verifyCode) {
        return res.send(errResponse(baseResponse.FAILURE_SMS_AUTHENTICATION));
    } else {
      Cache.del(phoneNumber);
      return res.send(response(baseResponse.SMS_VERIFY_SUCCESS));     
    }
};

/**
 * API No. 50
 * API Name : 푸시 알림 API
 * [POST] /app/pushAlarms
 */
exports.pushAlarm = async function(req, res){
    let deviceToken=`원하는 유저의 token 입력`
    let message = {
        notification:{
             title: '[Coupang-Eats] PushAlarm',
             body:'A New Alarm From Coupang-Eats !',
         },
         token:deviceToken,
    }

    admin
        .messaging()
        .send(message)
        .then(function(response){
            console.log('Successfully sent message:', response)
            return res.send(response(baseResponse.SUCCESS));
        })
        .catch(function(err) {
            console.log('Error Sending message: ', err)
            return res.send(errResponse(baseResponse.PUSH_ALARM_FAILURE));
        });
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
