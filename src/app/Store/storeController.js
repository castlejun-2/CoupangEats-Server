const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 3
 * API Name : 키워드로 매장 검색 API
 * [PATCH] /app/users/:userId/keyword
 * path variable : userId
 */
exports.getStoresByKeyword = async function (req, res) {
    /**
     * Query String: keyword
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const keyword = req.query.keyword;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!keyword)
            return res.send(errResponse(baseResponse.STORE_KEYWORD_EMPTY));

        const storeList = await storeProvider.retrieveStoreByKeywordList(keyword);
        return res.send(response(baseResponse.SUCCESS, storeList)); 
    }  
}

/**
 * API No. 7
 * API Name : 카테고리로 매장 조회 API
 * [GET] /app/users/:userId/category
 * path variable : userId
 */
exports.getStoresByCategory = async function (req, res) {
    /**
     * Query String: category,latitude,longitude
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const category = req.query.category;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!category)
            return res.send(errResponse(baseResponse.STORE_CATEGORY_EMPTY));

        const storeList = await storeProvider.retrieveStoreByCategoryList(userId, category);
        return res.send(response(baseResponse.SUCCESS, storeList));   
    } 
}

/**
 * API No. 9
 * API Name : 앱 메인화면 통합 조회 API
 * [GET] /app/users/:userId/main
 * path variable : userId
 */
 exports.getMainScreen = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        let type;
        const result = [];
            
        const storeCategoryList = await storeProvider.retrieveStoreCategoryList();
            result.push({'StoreClassification ': storeCategoryList});
        type = 'new';  
            const mainList1 = await storeProvider.retrieveMainScreenList(userId, type);
            result.push({'NewStore': mainList1});
        
        type = 'popular';
            const mainList2 = await storeProvider.retrieveMainScreenList(userId, type);
            result.push({'PopularStore': mainList2});
        
        type === 'pick'; //그 외의 매장 리스트 조회
            const mainOtherList = await storeProvider.retrieveMainScreenList(userId, 0);
            result.push({'OtherStoreList': mainOtherList});

        return res.send(response(baseResponse.SUCCESS, result));         
    } 
}

/**
 * API No. 34
 * API Name : 앱 메인화면 신규매장 조회 API
 * [GET] /app/users/:userId/main-new
 * path variable : userId
 */
 exports.getMainScreenByNewStore = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const mainListByNew = await storeProvider.retrieveMainScreenList(userId, 'new');
        return res.send(response(baseResponse.SUCCESS, mainListByNew));         
    } 
}

/**
 * API No. 35
 * API Name : 앱 메인화면 인기매장 조회 API
 * [GET] /app/users/:userId/main-popular
 * path variable : userId
 */
 exports.getMainScreenByPopularStore = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const mainListByPopular = await storeProvider.retrieveMainScreenList(userId, 'popular');
        return res.send(response(baseResponse.SUCCESS, mainListByPopular));         
    } 
}

/**
 * API No. 36
 * API Name : 앱 메인화면 골라먹는매장 조회 API
 * [GET] /app/stores/:userId/main-pick
 * path variable : userId
 */
 exports.getMainScreenByPickStore = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const mainListByPick = await storeProvider.retrieveMainScreenList(userId, 0);
        return res.send(response(baseResponse.SUCCESS, mainListByPick));         
    } 
}

/**
 * API No. 18
 * API Name : 매장 메인화면 조회 API
 * [GET] /app/users/:userId/mainstore
 * path variable : userId
 */
 exports.getStoreMain = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const storeId = req.query.storeId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!storeId)
            return res.send(errResponse(baseResponse.SIGNIN_STOREID_EMPTY));
        const result = [];
            
        const mainTopList = await storeProvider.retrieveMainList(storeId);
        result.push({'Store Top Info': mainTopList});

        const reviewList = await storeProvider.retrieveReviewList(storeId);
        result.push({'Preview Review': reviewList});
        
        const menuList = await storeProvider.retrieveMenuCategoryList(storeId);
        for(let i=0; i<menuList.length; i++){
            const DetailMenu = await storeProvider.getMenu(menuList[i].storeCategoryId);
            result.push(menuList[i],DetailMenu);
        }
        return res.send(response(baseResponse.SUCCESS, result));      
    } 
}

/**
 * API No. 19
 * API Name : 매장 세부정보 조회 API
 * [GET] /app/users/:userId/detail-store
 * path variable : userId
 */
 exports.getStoreDetail = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const storeId = req.query.storeId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!storeId)
            return res.send(errResponse(baseResponse.SIGNIN_STOREID_EMPTY));
    
        const storeDetailList = await storeProvider.retrieveStoreDetail(storeId);

        return res.send(response(baseResponse.SUCCESS, storeDetailList));      
    } 
}