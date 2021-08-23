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
 * [POST] /app/orders/:userId/in-cart
 * path variable : userId
 */
 exports.postCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const type = req.query.type;
    const {storeId,menuCount,menuId,orderArray} = req.body;
    let orderId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!storeId)
            return res.send(errResponse(baseResponse.SIGNIN_STOREID_EMPTY));
        if(!menuId)
            return res.send(errResponse(baseResponse.SIGNIN_MENUID_EMPTY));
        
        //validation 처리
        const storeActiveInfo = await storeProvider.retrieveStoreActive(storeId)        
        if (storeActiveInfo[0].exist === 0) //가게가 정상 영업중인지 확인
            return res.send(errResponse(baseResponse.STORE_NOT_ACTIVE));     
        
        const sameStoreInCartInfo = await orderProvider.retrieveSameStoreInCart(userId, storeId)        
        if (sameStoreInCartInfo[0].exist === 1 && !type) //카트에 다른 가게의 메뉴가 담겨있는지 확인
                return res.send(errResponse(baseResponse.NOT_SAME_STORE_IN_CART));
        else if(sameStoreInCartInfo[0].exist === 1 && type === 'new') //'새로담기'를 할 때 기존 Cart 정보는 삭제 후 담기
            const cartDelete = await orderService.deleteInCart(userId);
        
        const sameOrderInCartInfo = await orderProvider.retrieveSameOrderInCart(userId, storeId);       
        if(sameOrderInCartInfo[0].orderIdx) //storeId가 기존 Cart 정보에 있으면 해당 OrderId 사용
            orderId = await orderService.postUserOrder(userId, storeId, menuId, menuCount, sameOrderInCartInfo[0].orderIdx);
        else
            orderId = await orderService.postUserOrder(userId, storeId, menuId, menuCount);

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

/**
 * API No. 33
 * API Name : 카트에 담긴 정보 조회 API
 * [GET] /app/orders/:userId/in-cart
 * path variable : userId
 */
 exports.getCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {        
        const cartInfo = await orderProvider.retrieveUserCartInfo(userId);
        return res.send(response(baseResponse.SUCCESS, cartInfo)); 
    }  
}

/**
 * API No. 37
 * API Name : 카트 비우기 API
 * [PATCH] /app/orders/:userId/in-cart
 * path variable : userId
 */
 exports.deleteCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {        
        const cartDelete = await orderService.deleteInCart(userId);
        return res.send(response(baseResponse.SUCCESS)); 
    } 
}