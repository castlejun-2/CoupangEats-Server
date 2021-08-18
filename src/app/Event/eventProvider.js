const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const eventDao = require("./eventDao");

// 이벤트 리스트 읽어오기
exports.retrieveEventList = async function () {

    const connection = await pool.getConnection(async (conn) => conn);
    const eventListResult = await eventDao.selectEvent(connection);
    connection.release();

    return eventListResult;

};

// 쿠폰 리스트 읽어오기
exports.retrieveCouponList = async function () {

    const connection = await pool.getConnection(async (conn) => conn);
    const couponListResult = await eventDao.selectCoupon(connection);
    connection.release();

    return couponListResult;

};