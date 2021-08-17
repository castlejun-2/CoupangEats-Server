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
    
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
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
 * [PATCH] /app/users/:userId/category
 * path variable : userId
 */
exports.getStoresByCategory = async function (req, res) {
    /**
     * Query String: category
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const category = req.query.category;
    
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!category)
            return res.send(errResponse(baseResponse.STORE_CATEGORY_EMPTY));

        const storeList = await storeProvider.retrieveStoreByCategoryList(category);
        return res.send(response(baseResponse.SUCCESS, storeList));   
    } 
}