const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 10
 * API Name : 키워드로 매장 검색 API
 * [PATCH] /app/stores/:userId/keyword
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

        const storeList = await storeProvider.retrieveStoreByKeywordList(userId, keyword);
        return res.send(response(baseResponse.SUCCESS, storeList)); 
    }  
};

/**
 * API No. 11
 * API Name : 카테고리로 매장 조회 API
 * [GET] /app/stores/:userId/category
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
};

/**
 * API No. 12
 * API Name : 앱 메인화면 통합 조회 API
 * [GET] /app/stores/:userId/main
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
};

/**
 * API No. 13
 * API Name : 메뉴 정보 조회 API
 * [GET] /app/stores/:userId/menu
 * path variable : userId
 */
 exports.getMenu = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const menuId = req.query.menuId;
    const result = [];

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else {
        if(!menuId)
            return res.send(errResponse(baseResponse.SIGNIN_MENUID_EMPTY));

        const getMenuTopInfo = await storeProvider.getMenuTopInfo(menuId); //메뉴 상단 정보 가져오기
        result.push(getMenuTopInfo[0]);

        const getReceiptMenuOptionCategoryInfo = await storeProvider.getUserMenuOptionCategoryInfo(menuId); //카테고리별 옵션 조회
        for(let i=0;i<getReceiptMenuOptionCategoryInfo.length;i++){
            let detailOptionResult = await storeProvider.getUserDetailMenuInRecipt(getReceiptMenuOptionCategoryInfo[i].menuCategoryIdx);
            result.push({'Category Name': getReceiptMenuOptionCategoryInfo[i].categoryName, 'Max Select': getReceiptMenuOptionCategoryInfo[i].maxSelect,
                        detailOptionResult})
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
};

/**
 * API No. 14
 * API Name : 매장 메인화면 조회 API
 * [GET] /app/stores/:userId/mainstore
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
};

/**
 * API No. 15
 * API Name : 매장 세부정보 조회 API
 * [GET] /app/stores/:userId/detail-store
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
};

/**
 * API No. 16
 * API Name : 매장 리뷰 조회 API
 * [GET] /app/stores/:userId/review
 * path variable : userId
 */
 exports.getReview = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const storeId = req.query.storeId;
    const isPhoto = req.query.photo;
    const filter = req.query.filter;
    const result = [];
    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!storeId)
            return res.send(errResponse(baseResponse.SIGNIN_STOREID_EMPTY));

        const reviewTopLayerResult = await storeProvider.retrieveReviewTopLayer(storeId); //매장 리뷰 상단정보
        result.push({'Store Top Layer Info': reviewTopLayerResult});

        if(isPhoto === 1){ //포토리뷰만 보기
            const storeReviewOnlyPhotoList = await storeProvider.retrieveStorePhotoReview(storeId, filter);
            result.push({'Review List': storeReviewOnlyPhotoList});
            return res.send(response(baseResponse.SUCCESS, result));
        }
        else{
            const storeReviewList = await storeProvider.retrieveStoreReview(storeId, filter);
            result.push({'Review List': storeReviewList});
            return res.send(response(baseResponse.SUCCESS, result));   
        }            
    } 
};

/**
 * API No. 17
 * API Name : 리뷰 도움돼요 증가 API
 * [POST] /app/stores/:userId/help-review
 * path variable : userId
 */
 exports.postHelpReview = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {reviewId} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!reviewId)
            return res.send(errResponse(baseResponse.SIGNIN_REVIEWID_EMPTY));
        const reviewHelpResult = await storeService.postReviewIsHelp(userId, reviewId); 
        return res.send(reviewHelpResult);   
    }             
};

/**
 * API No. 18
 * API Name : 리뷰 도움안돼요 증가 API
 * [POST] /app/stores/:userId/nonhelp-review
 * path variable : userId
 */
 exports.postNotHelpReview = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {reviewId} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!reviewId)
            return res.send(errResponse(baseResponse.SIGNIN_REVIEWID_EMPTY));

        const reviewHelpResult = await storeService.postReviewIsNotHelp(userId, reviewId); 
        return res.send(reviewHelpResult);   
    }             
};

/**
 * API No. 19
 * API Name : 리뷰 작성 API
 * [POST] /app/stores/:userId/review
 * path variable : userId
 */
 exports.postReview = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {orderId, starValue, review, reviewImageUrl} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!orderId)
            return res.send(errResponse(baseResponse.SIGNIN_ORDERID_EMPTY));
        if(!starValue)
            return res.send(errResponse(baseResponse.SIGNIN_STARVALUE_EMPTY));

        const postReviewResult = await storeService.postUserReview(userId, orderId, starValue, review);

        if(!postReviewResult[0])
            return res.send(postReviewResult);
        else{
            if(reviewImageUrl){
                for(let i=0;i<reviewImageUrl.length;i++){
                    const postReviewImage = await storeService.postUserReviewImage(postReviewResult[0].reviewIdx, reviewImageUrl[i].url);}
            }
            return res.send(baseResponse.SUCCESS);   
        }
    }             
};

/**
 * API No. 20
 * API Name : 리뷰 수정 API
 * [PATCH] /app/stores/:userId/review
 * path variable : userId
 */
 exports.updateReview = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {orderId, reviewId, starValue, review, insertReviewImageUrl, deleteReviewImageUrl} = req.body;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!orderId)
            return res.send(errResponse(baseResponse.SIGNIN_ORDERID_EMPTY));
        if(!reviewId)
            return res.send(errResponse(baseResponse.UPDATE_REVIEWID_EMPTY));

        const updateReviewResult = await storeService.updateUserReview(userId, orderId, reviewId, starValue, review);
        if(insertReviewImageUrl){
            for(let i=0;i<insertReviewImageUrl.length;i++){ //리뷰 이미지 URL 추가
                const postReviewImage = await storeService.postUserReviewImage(reviewId, insertReviewImageUrl[i].url);}
        }
        if(deleteReviewImageUrl){
            for(let i=0;i<deleteReviewImageUrl.length;i++){ //리뷰 이미지 URL 삭제
                const postReviewImage = await storeService.deleteUserReviewImage(reviewId, deleteReviewImageUrl[i].id);}
        }
        return res.send(updateReviewResult);   

    }             
};

/**
* API No. 21
* API Name : 치타배달 매장 조회 API
* [GET] /app/stores/:userId/cheetah
* path variable : userId
*/
exports.getStoresByCheetah = async function (req, res) {

     const userIdFromJWT = req.verifiedToken.userId;
     const userId = req.params.userId;
 
     if (!userIdFromJWT || !userId) 
         return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
         
     if (userIdFromJWT != userId) {
         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
     } else {
         const storeList = await storeProvider.retrieveStoreByCheetahList(userId);
         return res.send(response(baseResponse.SUCCESS, storeList)); 
     }  
};

/**
* API No. 22
* API Name : 치타배달 미리보기 팜업 API
* [GET] /app/stores/:userId/preview-cheetah
* path variable : userId
*/
exports.getStoresByPreviewCheetah = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userIdFromJWT || !userId) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const cheetahList = await storeProvider.retrieveStoreByCheetahPreviewList(userId);
        return res.send(response(baseResponse.SUCCESS, cheetahList)); 
    }  
};

/**
* API No. 23
* API Name : 매장 배달팁 상세 조회 API
* [GET] /app/stores/:userId/delievery-tip
* path variable : userId
*/
exports.getDelieveryTip = async function (req, res) {

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

       const storeDeliveryTipResult = await storeProvider.retrievestoreDeliveryTip(storeId);
       return res.send(response(baseResponse.SUCCESS, storeDeliveryTipResult));         
   } 
};

/**
 * API No. 24
 * API Name : 앱 메인화면 신규매장 조회 API
 * [GET] /app/stores/:userId/main-new
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
};

/**
 * API No. 25
 * API Name : 앱 메인화면 인기매장 조회 API
 * [GET] /app/stores/:userId/main-popular
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
};

/**
 * API No. 26
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
};

/**
 * API No. 27
 * API Name : 앱 메인화면 신규매장 조회 API (비회원용)
 * [GET] /app/stores/main-new
 */
 exports.getMainScreenByNewStoreForAll = async function (req, res) {

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const mainListByNewWithLocate = await storeProvider.retrieveMainScreenListForAll('new', latitude, longitude);
    return res.send(response(baseResponse.SUCCESS, mainListByNewWithLocate));
};

/**
 * API No. 28
 * API Name : 앱 메인화면 인기매장 조회 API (비회원용)
 * [GET] /app/stores/main-popular
 */
 exports.getMainScreenByPopularStoreForAll = async function (req, res) {

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const mainListByNewWithLocate = await storeProvider.retrieveMainScreenListForAll('popular', latitude, longitude);
    return res.send(response(baseResponse.SUCCESS, mainListByNewWithLocate));
};

/**
 * API No. 29
 * API Name : 앱 메인화면 골라먹는매장 조회 API (비회원용)
 * [GET] /app/stores/main-pick
 */
 exports.getMainScreenByPickStoreForAll = async function (req, res) {

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const mainListByNewWithLocate = await storeProvider.retrieveMainScreenListForAll('other', latitude, longitude);
    return res.send(response(baseResponse.SUCCESS, mainListByNewWithLocate));
};