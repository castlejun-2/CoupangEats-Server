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
    const userIdFromJWT = req.verifiedToken.userIdx;
    const userId = req.params.userId;
    const keyword = req.query.keyword;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!latitude)
            return res.send(errResponse(baseResponse.SIGNIN_LATITUDE_EMPTY));
        if(!longitude)
            return res.send(errResponse(baseResponse.SIGNIN_LONGITUDE_EMPTY));
        if(!keyword)
            return res.send(errResponse(baseResponse.STORE_KEYWORD_EMPTY));

        const storeList = await storeProvider.retrieveStoreByKeywordList(latitude, longitude, keyword);
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
     * Query String: category
     */
    const userIdFromJWT = req.verifiedToken.userIdx;
    const userId = req.params.userId;
    const category = req.query.category;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    console.log(userId);
    console.log(userIdFromJWT);
    
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!latitude)
            return res.send(errResponse(baseResponse.SIGNIN_LATITUDE_EMPTY));
        if(!longitude)
            return res.send(errResponse(baseResponse.SIGNIN_LONGITUDE_EMPTY));
        if(!category)
            return res.send(errResponse(baseResponse.STORE_CATEGORY_EMPTY));

        const storeList = await storeProvider.retrieveStoreByCategoryList(latitude, longitude, category);
        return res.send(response(baseResponse.SUCCESS, storeList));   
    } 
}