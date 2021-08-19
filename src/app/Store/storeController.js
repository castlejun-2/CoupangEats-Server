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
 * API Name : 메인화면 신규 입점 및 인기 매장 조회 API
 * [GET] /app/users/:userId/main
 * path variable : userId
 */
 exports.getMainScreen = async function (req, res) {
    /**
     * Query String: type
     */
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
            result.push({'매장 분류': storeCategoryList});
        type = 'new';  
            const mainList1 = await storeProvider.retrieveMainScreenList(userId, type);
            result.push({'신규매장': mainList1});
        
        type = 'popular';
            const mainList2 = await storeProvider.retrieveMainScreenList(userId, type);
            result.push({'인기매장': mainList2});
        
        type === 'pick'; //그 외의 매장 리스트 조회
            const mainOtherList = await storeProvider.retrieveMainScreenList(userId, 0);
            result.push({'골라먹는 매장': mainOtherList});

        return res.send(response(baseResponse.SUCCESS, result));         
    } 
}

/**
 * API No. 18
 * API Name : 매장 메인화면 조회 API
 * [GET] /app/users/:userId/storeMain
 * path variable : userId
 */
 exports.getStoreMain = async function (req, res) {
    /**
     * Query String: type
     */
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
        result.push({'매장 상단 정보': mainTopList});

        const reviewList = await storeProvider.retrieveReviewList(storeId);
        result.push({'리뷰 미리보기': reviewList});
        
        const menuList = await storeProvider.retrieveMenuList(storeId);
        for(let i=0; i<menuList.length; i++){
            const DetailMenu = await storeProvider.getDetailMenu(menuList[i].Id);
            result.push(menuList[i],DetailMenu);
        }
        return res.send(response(baseResponse.SUCCESS, result));      
    } 
}