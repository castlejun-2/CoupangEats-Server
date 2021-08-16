const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getStores = async function (req, res) {
    /**
     * Query String: keyword
     */
    const keyword = req.query.keyword;
    
    if(!keyword)
        return res.send(errResponse(baseResponse.STORE_KEYWORD_EMPTY));

    const storeList = await storeProvider.retrieveStoreList(keyword);
    return res.send(response(baseResponse.SUCCESS, storeList));    
}