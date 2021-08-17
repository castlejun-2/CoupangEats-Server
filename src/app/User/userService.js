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

// Service: Create, Update, Delete 비즈니스 로직 처리

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
        await connection.beginTransaction();
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1){
            await connection.rollback();
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
            await connection.rollback();
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            await connection.rollback();
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            await connection.rollback();
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
        await connection.commit();    
        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.logout = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const logoutResult = await userDao.userLogout(connection, userId);

    connection.release();

    return logoutResult;
}

exports.postAddAddress = async function (userId, address, detailAddress, infoAddress, category) {
    try {
        await connection.beginTransaction();
        const insertUserAddressParams = [userId, address, detailAddress, infoAddress, category];

        const connection = await pool.getConnection(async (conn) => conn);

        const userAddressResult = await userDao.insertUserAddress(connection, insertUserAddressParams);
        await connection.commit();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUserAddress Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updateDetailAddress = async function (userId, detailAddress, infoAddress, category) {
    try {
        await connection.beginTransaction();
        const updateUserAddressParams = [detailAddress, infoAddress, userId, category];

        const connection = await pool.getConnection(async (conn) => conn);

        const userDetailAddressResult = await userDao.updateUserAddress(connection, updateUserAddressParams);
        await connection.commit();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateUserDetailAddress Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.setDefaultAddress = async function (userId, addressId) {
    try {
        await connection.beginTransaction();
        const updateUserAddressParams = [userId, addressId];

        const connection = await pool.getConnection(async (conn) => conn);
        const settingDefaultResult = await userDao.SetdefaultAddress(connection,userId);
        const setDefaultResult = await userDao.SettingdefaultAddress(connection,updateUserAddressParams);
        await connection.commit();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateUserDetailAddress Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};


