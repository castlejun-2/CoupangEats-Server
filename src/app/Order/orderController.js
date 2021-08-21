const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const storeProvider = require("../../app/Store/storeProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 32
 * API Name : 카트에 담기 API
 * [GET] /app/orders/:userId/in-cart
 * path variable : userId
 */
 exports.getCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {storeId,menuCount,menuId,orderArray} = req.body; 

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!storeId)
            return res.send(errResponse(baseResponse.SIGNIN_STOREID_EMPTY));
        if(!menuId)
            return res.send(errResponse(baseResponse.SIGNIN_MENUID_EMPTY));
        
        const storeActiveInfo = await storeProvider.retrieveStoreActive(storeId)        
        if (storeActiveInfo[0].exist === 0) //가게가 정상 영업중인지 확인
            return res.send(errResponse(baseResponse.STORE_NOT_ACTIVE));     
            
        const orderId = await orderService.postUserOrder(userId, storeId, menuId, menuCount);
        for(let i=0; i<orderArray.length; i++){
            if(!orderArray[i].menuCategoryId)
                return res.send(errResponse(baseResponse.SIGNIN_MENUCATEGORYID_EMPTY));
            if(!orderArray[i].menuDetailId)
                return res.send(errResponse(baseResponse.SIGNIN_MENUDETAILID_EMPTY));
            const postOrderDetailList = await orderService.postOrderDetail(orderId[0].orderIdx, orderArray[i]);
        }
        return res.send(response(baseResponse.SUCCESS)); 
    }  
}