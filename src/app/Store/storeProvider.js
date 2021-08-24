const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

//키워드에 맞는로 매장 검색 API
exports.retrieveStoreByKeywordList = async function (userId, keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByKeywordResult = await storeDao.selectStoreByKeyword(connection, userId, keyword);
    connection.release();

    return storeListByKeywordResult;
};

//카테고리에 해당하는 매장 검색 API
exports.retrieveStoreByCategoryList = async function (userId, category) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByCategoryResult = await storeDao.selectStoreByCategory(connection, userId, category);
    connection.release();

    return storeListByCategoryResult;
};

//치타배달 매장 검색 API
exports.retrieveStoreByCheetahList = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByCheetahResult = await storeDao.selectStoreByCheetahList(connection, userId);
    connection.release();

    return storeListByCheetahResult;
};

//메인화면 조회 API
exports.retrieveMainScreenList = async function (userId, type) {
    if(type){
        if(type === 'new'){
            const connection = await pool.getConnection(async (conn) => conn);
            const mainScreenByNewListResult = await storeDao.selectMainScreenByNew(connection,userId);

            connection.release();    
            return mainScreenByNewListResult;
        }    
        else if(type === 'popular'){
            const connection = await pool.getConnection(async (conn) => conn);
            const mainScreenByPopularListResult = await storeDao.selectMainScreenByPopular(connection,userId);
        
            connection.release();    
            return mainScreenByPopularListResult;
        }
    }
    else{
        const connection = await pool.getConnection(async (conn) => conn);

        const mainScreenOtherListResult = await storeDao.selectMainScreenByOther(connection,userId);
        connection.release();    
        return mainScreenOtherListResult;
    }
};

//쿠팡이츠 카테고리 조회
exports.retrieveStoreCategoryList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeCategoryListResult = await storeDao.selectStoreCategory(connection);
    connection.release();    
    return storeCategoryListResult;
    
};

//매장 메인화면 조회
exports.retrieveMainList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreListResult = await storeDao.selectMainScreen(connection, storeId);
    connection.release();    
    return mainStoreListResult;
};

//매장 메인화면 리뷰 미리보기 조회
exports.retrieveReviewList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreReviewListResult = await storeDao.selectMainReview(connection, storeId);
    connection.release();    
    return mainStoreReviewListResult;
};

//매장 메인화면 메뉴카테고리 조회
exports.retrieveMenuCategoryList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreCategoryListResult = await storeDao.selectMainMenuCategory(connection, storeId);
    connection.release();    
    return mainStoreCategoryListResult;
};

//매장 메인화면 카테고리별 메뉴 조회
exports.getMenu = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreDetailMenuListResult = await storeDao.selectDetailMenu(connection, categoryId);
    connection.release();    
    return mainStoreDetailMenuListResult;
};

//메뉴별 카테고리 조회
exports.retrieveMenuList = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreCategoryListResult = await storeDao.selectMainCategory(connection, storeId);
    connection.release();    
    return mainStoreCategoryListResult;
};

//메뉴 카테고리별 상세 옵션 조회(추가금액 등)
exports.getDetailMenu = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const mainStoreDetailMenuListResult = await storeDao.selectCategoryDetailMenu(connection, categoryId);
    connection.release();    
    return mainStoreDetailMenuListResult;
};

//매장정보 상세 조회
exports.retrieveStoreDetail = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeDetailResult = await storeDao.selectStoreDetailInfo(connection, storeId);
    connection.release();    
    return storeDetailResult;
};

//리뷰 상단 요약 조회
exports.retrieveReviewTopLayer = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const reviewTopLayerResult = await storeDao.selectReviewTopLayerInfo(connection, storeId);
    connection.release();    
    return reviewTopLayerResult;
};

//상점 포토리뷰만 조회
exports.retrieveStorePhotoReview = async function (storeId, filter) {
    if(filter === 'is-help'){ //도움이 많은 순 정렬
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewByHelpList = await storeDao.selectPhotoReviewByHelp(connection, storeId);
        connection.release();
    
        return getReviewByHelpList;
      }
      else if(filter === 'star-asce'){ //별점 오름차순 정렬
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewByAsceList = await storeDao.selectPhotoReviewByAsce(connection, storeId);
        connection.release();
    
      return getReviewByAsceList;
      }
      else if(filter === 'star-desc'){ //별점 내림차순 정렬
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewBydescList = await storeDao.selectPhotoReviewBydesc(connection, storeId);
        connection.release();
    
      return getReviewBydescList;     
      }
      else{ //필터가 없을시에는 최신등록순으로 자동 조회
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewByRecentList = await storeDao.selectPhotoReviewByRecent(connection, storeId);
        connection.release();
    
        return getReviewByRecentList;
      }
};

//상점 리뷰조회
exports.retrieveStoreReview = async function (storeId, filter) {
    if(filter === 'is-help'){ //도움이 많은 순 정렬
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewByHelpList = await storeDao.selectReviewByHelp(connection, storeId);
        connection.release();
    
        return getReviewByHelpList;
      }
      else if(filter === 'star-asce'){ //별점 오름차순 정렬
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewByAsceList = await storeDao.selectReviewByAsce(connection, storeId);
        connection.release();
    
      return getReviewByAsceList;
      }
      else if(filter === 'star-desc'){ //별점 내림차순 정렬
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewBydescList = await storeDao.selectReviewBydesc(connection, storeId);
        connection.release();
    
      return getReviewBydescList;     
      }
      else{ //필터가 없을시에는 최신등록순으로 자동 조회
        const connection = await pool.getConnection(async (conn) => conn);
        const getReviewByRecentList = await storeDao.selectReviewByRecent(connection, storeId);
        connection.release();
    
        return getReviewByRecentList;
      }
};

//리뷰 도움여부를 증가시켰는지 확인
exports.checkAlreadyHelpCheck = async function (userId, reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    console.log(userId, reviewId);
    const checkHelpReviewResult = await storeDao.selectCheckHelpReviewInfo(connection, userId, reviewId);
    console.log(checkHelpReviewResult);
    connection.release();    
    return checkHelpReviewResult;
};

//리뷰 도움안돼요 여부를 증가시켰는지 확인
exports.checkAlreadyNotHelpCheck = async function (userId, reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const checkNotHelpReviewResult = await storeDao.selectCheckNotHelpReviewInfo(connection, userId, reviewId);
    console.log(checkNotHelpReviewResult[0]);
    connection.release();    
    return checkNotHelpReviewResult;
};

//매장 배달팁 조회
exports.retrievestoreDeliveryTip = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const deliveryTipResult = await storeDao.selectDeliveryTipInfo(connection, storeId);
    connection.release();    
    return deliveryTipResult;
};

//매장 오픈여부 조회
exports.retrieveStoreActive = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeActiveResult = await storeDao.selectStoreActiveInfo(connection, storeId);
    connection.release();    
    return storeActiveResult;
};

//주문 금액별 배달팁 조회
exports.getDeliveryTip = async function (storeId, sumprice) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeDeliveryTipResult = await storeDao.selectStoreDeliveryTipInfo(connection, storeId, sumprice);
    connection.release();    
    return storeDeliveryTipResult;
};

//주문 금액별 배달팁 조회
exports.retrieveStoreByCheetahPreviewList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeDeliveryTipResult = await storeDao.selectStoreCheetahPreviewInfo(connection, userId);
    connection.release();    
    return storeDeliveryTipResult;
};