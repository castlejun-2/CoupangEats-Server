const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

// 유저 여부 조회
exports.userCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await userDao.selectUserIdx(connection, userId);
  connection.release();

  return userCheckResult;
};

// 즐겨찾기 여부 조회
exports.bookMarkCheck = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkBookMarkResult = await userDao.selectUserBookMarkCheck(connection, userId, storeId);
  connection.release();

  return checkBookMarkResult;
};

// 추가한 즐겨찾기 매장 갯수 조회
exports.getBookMarkCount = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getBookMarkCount = await userDao.selectUserBookMarkCount(connection, userId);
  connection.release();

  return getBookMarkCount;
};

// 추가한 즐겨찾기 매장 조회
exports.getBookMark = async function (userId, filter) {
  if(filter === 'recent-plus' || !filter ){
    const connection = await pool.getConnection(async (conn) => conn);
    const getBookMarkByRecentList = await userDao.selectUserBookMarkByRecent(connection, userId);
    connection.release();

    return getBookMarkByRecentList;
  }
  else if(filter === 'recent-order'){
    const connection = await pool.getConnection(async (conn) => conn);
    const getBookMarkByOrderList = await userDao.selectUserBookMarkByOrder(connection, userId);
    connection.release();

    return getBookMarkByOrderList;
  }
  else if(filter === 'many-order'){
    const connection = await pool.getConnection(async (conn) => conn);
    const getBookMarkByManyList = await userDao.selectUserBookMarkByMany(connection, userId);
    connection.release();

  return getBookMarkByManyList;    
  }  
};

// 등록한 쿠폰 조회
exports.getCoupon = async function (userId, couponId, sumprice) {
  if(!couponId){
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserCoupon = await userDao.selectUserCoupon(connection, userId);
    connection.release();

    return getUserCoupon;
  }
  else{
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserCouponById = await userDao.selectUserCouponById(connection, userId, couponId, sumprice);
    connection.release();

    return getUserCouponById;
  }
};

// 쿠폰 등록 여부 조회
exports.checkCoupon = async function (userId, couponId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkCouponResult = await userDao.selectUserCouponCheck(connection, userId, couponId);
  connection.release();

  return checkCouponResult;
};

// 사용자 기본 배송지 조회 
exports.getUserDefaultAddress = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userDefaultAddressResult = await userDao.selectUserDefaultAddress(connection, userId);
  connection.release();

  return userDefaultAddressResult;
};

// 사용자 이름 및 핸드폰번호 조회
exports.getUserMyPage = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userMyPageResult = await userDao.selectUserMyPage(connection, userId);
  connection.release();

  return userMyPageResult;
};

// 사용자 배달 주소지 리스트 조회
exports.getUserAddressList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAddressResult = await userDao.selectUserAddressList(connection, userId);
  connection.release();

  return userAddressResult;
};