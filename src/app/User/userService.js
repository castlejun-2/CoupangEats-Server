const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.createUser = async function (email, password, username, phonenumber) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword, username, phonenumber];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1){
            return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
        }

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        ); 

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.logout = async function (userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const logoutResult = await userDao.userLogout(connection, userId);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Logout Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
}

exports.postAddAddress = async function (userId, address, detailAddress, infoAddress, latitude, longitude, category) {
    try {
        const insertUserAddressParams = [userId, address, detailAddress, infoAddress, latitude, longitude, category];

        const connection = await pool.getConnection(async (conn) => conn);

        const userAddressResult = await userDao.insertUserAddress(connection, insertUserAddressParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUserAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateDetailAddress = async function (userId, detailAddress, infoAddress, category) {
    try {
        const updateUserAddressParams = [detailAddress, infoAddress, userId, category];

        const connection = await pool.getConnection(async (conn) => conn);

        const userDetailAddressResult = await userDao.updateUserAddress(connection, updateUserAddressParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateUserDetailAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.setDefaultAddress = async function (userId, addressId) {
    try {
        const updateUserAddressParams = [userId, addressId];

        const connection = await pool.getConnection(async (conn) => conn);
        const settingDefaultResult = await userDao.setdefaultAddress(connection,userId);
        const setDefaultResult = await userDao.settingdefaultAddress(connection,updateUserAddressParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateUserDetailAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteUserBookMark = async function (userId, storeId) {
    try {
        const deleteUserBookMarkParams = [userId, storeId];

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteUserBookMarkResult = await userDao.deleteBookMark(connection, deleteUserBookMarkParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - delete User BookMark Address Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postUserBookMark = async function (userId, storeId) {
    try {
        const AddUserBookMarkParams = [userId, storeId];

        const connection = await pool.getConnection(async (conn) => conn);
        const postUserBookMarkResult = await userDao.postBookMark(connection,AddUserBookMarkParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - post User BookMark Address Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 쿠폰 등록
exports.postCoupon = async function (userId, couponId) {
    try {
        const AddUserCouponParams = [userId, couponId];
        const connection = await pool.getConnection(async (conn) => conn);
        const postUserCouponResult = await userDao.postCoupon(connection, AddUserCouponParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - post User Coupon Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 카드삭제
exports.deleteCard = async function (userId, cardId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteCardResult = await userDao.updateDeleteCard(connection, userId, cardId);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Delete Card Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);   
    }
};

