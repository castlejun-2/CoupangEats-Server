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
    const userIdFromJWT = req.verifiedToken.userIdx;

    // Request body
    const {userId} = req.body;

    // Validation Check (Request Error)
    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT !== userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); 

    const checkUserIdx = await userProvider.userCheck(userId);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    // Result
    await userService.logout(userId);

    return res.send(response(baseResponse.SUCCESS));

};

/**
 * API No. 4
 * API Name : 주소지 추가 API
 * [POST] /app/users/:userId/add-address
 * path variable : userId
 * body : address, detailAddress, infoAddress, category
 */
 exports.postAddress = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userIdx;
    const userId = req.params.userId;
    const {address, detailAddress, infoAddress, category} = req.body;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!address)
            return res.send(errResponse(baseResponse.SIGNUP_ADDRESS_EMPTY));            
        if(!category)
            res.send(errResponse(baseResponse.ADDRESS_CATEGORY_EMPTY));

        const postAddressInfo = await userService.postAddAddress(userId, address, detailAddress, infoAddress, category)
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

    const userIdFromJWT = req.verifiedToken.userIdx
    const userId = req.params.userId;
    const {detailAddress, infoAddress, category} = req.body;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
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

    const userIdFromJWT = req.verifiedToken.userIdx
    const userId = req.params.userId;
    const addressId = req.query.addressId;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!addressId)
            res.send(errResponse(baseResponse.ADDRESS_DEFAULT_EMPTY));

        const setDefaultAddressInfo = await userService.setDefaultAddress(userId, addressId)
        return res.send(response(baseResponse.ADDRESS_DEFAULT_SETTING_SUCCESS));
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

    const userIdFromJWT = req.verifiedToken.userIdx

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
    const userIdResult = req.verifiedToken.userIdx;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
