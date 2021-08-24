const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const storeProvider = require("../../app/Store/storeProvider");
const userProvider = require("../../app/User/userProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 10
 * API Name : 과거 주문 내역 조회 API
 * [GET] /app/orders/:userId/history
 * path variable : userId
 */
 exports.getOrderHistory = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {        
        const orderHistoryInfo = await orderProvider.retrieveOrderHistoryInfo(userId);
        return res.send(response(baseResponse.SUCCESS, orderHistoryInfo)); 
    }  
}

/**
 * API No. 32
 * API Name : 카트에 담기 API
 * [POST] /app/orders/:userId/in-cart
 * path variable : userId
 */
 exports.postCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {storeId,menuCount,menuId,orderArray} = req.body;
    let orderId;
    var sumprice = 0;

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
        if (sameStoreInCartInfo[0].exist === 1) //카트에 다른 가게의 메뉴가 담겨있는지 확인
                return res.send(errResponse(baseResponse.NOT_SAME_STORE_IN_CART));

        const sameOrderInCartInfo = await orderProvider.retrieveSameOrderInCart(userId, storeId);       
        if(!sameOrderInCartInfo[0])
            orderId = await orderService.postUserOrder(userId, storeId, menuId, menuCount);
        else if(sameOrderInCartInfo[0].orderIdx) //storeId가 기존 Cart 정보에 있으면 해당 OrderId 사용
            orderId = await orderService.postUserOrder(userId, storeId, menuId, menuCount, sameOrderInCartInfo[0].orderIdx);

        for(let i=0; i<orderArray.length; i++){
            if(!orderArray[i].menuCategoryId)
                return res.send(errResponse(baseResponse.SIGNIN_MENUCATEGORYID_EMPTY));
            if(!orderArray[i].menuDetailId)
                return res.send(errResponse(baseResponse.SIGNIN_MENUDETAILID_EMPTY));
            const postOrderDetailList = await orderService.postOrderDetail(orderId[0].orderIdx, orderArray[i]);
        }
        
        //최종 금액 계산
        const orderMenuInfo = await orderProvider.getUserOrderMenu(userId); //주문 메뉴 리스트 조회
        console.log(orderMenuInfo[0])
        for(let i=0;i<orderMenuInfo.length;i++)
            sumprice+=parseInt(orderMenuInfo[i].menuPrice) //메뉴의 총 가격
        const delieveryTipInfo = await storeProvider.getDeliveryTip(orderMenuInfo[0].storeId,sumprice);
        sumprice+=parseInt(delieveryTipInfo[0].deliveryTip) //배달 팁
        console.log(sumprice)
        const totalCostResult = await orderService.postTotalCost(orderId[0].orderIdx, sumprice);
        return res.send(response(baseResponse.SUCCESS)); 
    }  
}

/**
 * API No. 33
 * API Name : 카트에 담긴 정보 미리보기 조회 API
 * [GET] /app/orders/:userId/preview-cart
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

/**
 * API No. 38
 * API Name : 새로운 카트에 담기 API
 * [POST] /app/orders/:userId/new-cart
 * path variable : userId
 */
 exports.newCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
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

        const cartDelete = await orderService.deleteInCart(userId); //기존 Cart 정보 모두 삭제
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
 * API No. 39
 * API Name : 카트에 담긴 정보 상세 조회 API
 * [GET] /app/orders/:userId/in-cart
 * path variable : userId
 */
 exports.getDetailCart = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const couponId = req.query.couponId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const result = [];
        var sumprice = 0;
            
        const userAddress = await userProvider.getUserDefaultAddress(userId); //기본 배송지 삽입
        result.push({'User Address': userAddress});

        const orderMenuInfo = await orderProvider.getUserOrderMenu(userId); //주문 메뉴 리스트 조회
        result.push({'Menu List': orderMenuInfo});

        const couponInfo = await orderProvider.getUserCoupon(userId); //해당 매장 사용가능한 쿠폰 조회
        result.push({'Coupon List': couponInfo[0].couponCount});

        //최종 금액 계산
        for(let i=0;i<orderMenuInfo.length;i++)
            sumprice+=parseInt(orderMenuInfo[i].menuPrice) //메뉴의 총 가격
        result.push({'Order Price': sumprice});
        const delieveryTipInfo = await storeProvider.getDeliveryTip(orderMenuInfo[0].storeId,sumprice);
        result.push({'Delivery Tip': parseInt(delieveryTipInfo[0].deliveryTip)});
        sumprice+=parseInt(delieveryTipInfo[0].deliveryTip) //배달 팁

        result.push({'Total Cost': sumprice});

        return res.send(response(baseResponse.SUCCESS, result)); 
    }  
}