// 키워드로 가게 조회
async function selectStoreByKeyword(connection, userId, keyword) {
    const selectStoreByKeywordQuery = `
    SELECT image.url as 'storeImageUrl',
           storeName as 'storeName',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as 'CheetahDelivery',
           averageDelivery as 'averageDeliveryTime',
           rv.star as 'averageStarRating',
           rv.cnt as 'reviewCount',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
           lm.mnN as 'menuList',
           cui.saleprice as 'Coupon',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as 'storeStatus'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
         From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
         join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
         (Select group_concat(menuName SEPARATOR ',') as mnN, mi.storeId as ssi
          From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx left join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx left join
		     (select ci.storeId, ci.salePrice as 'saleprice' from CouponInfo ci
          join StoreInfo si on ci.storeId=si.storeIdx group by ci.storeId) cui on cui.storeId=si.storeIdx
         left join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserInfo ui on ui.userIdx = ?
         left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
    WHERE (storeName LIKE concat("%",?,"%")) or (lm.mnN LIKE concat("%",?,"%"));
`;
    const [listRows] = await connection.query(selectStoreByKeywordQuery, [userId, keyword, keyword]);
    return listRows;
}

//카테고리별 가게 조회
async function selectStoreByCategory(connection, userId, category) {
  const selectStoreByCategoryQuery = `
    SELECT image.url as 'storeImageUrl',
           storeName as 'storeName',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as 'CheetahDelivery',
           averageDelivery as 'averageDeliveryTime',
           rv.star as 'averageStarRating',
           rv.cnt as 'reviewCount',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
           lm.mnN as 'menuList',
           cui.saleprice as 'Coupon',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as 'storeStatus'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
         From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
         join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
         (Select group_concat(menuName SEPARATOR ',') as mnN, mi.storeId as ssi
          From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx left join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx left join
		     (select ci.storeId, ci.salePrice as 'saleprice' from CouponInfo ci
          join StoreInfo si on ci.storeId=si.storeIdx group by ci.storeId) cui on cui.storeId=si.storeIdx
         left join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserInfo ui on ui.userIdx = ?
         left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
    WHERE si.category Like concat ("%",?,"%");
  `;
  const [listRows] = await connection.query(selectStoreByCategoryQuery, [userId, category]);
  return listRows;
}
// 메인화면 새로 입점한 가게 리스트 조회 API
async function selectMainScreenByNew(connection, userId) {
  const selectMainByNewListQuery = `
          SELECT image.url as 'storeImageUrl',
                 storeName as 'storeName',
                 rv.star as 'averageStarRating',
                 rv.cnt as 'reviewCount',
                 concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance',
                 case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
                 case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as 'storeStatus'
          FROM StoreInfo si left join
               (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
               From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
               join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
               (select mu.storeId as imagesi, mu.menuImageUrl AS 'url'
                from StoreInfo si join
               (select miu.menuImageUrl,mi.storeId
                from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
                group by mu.storeId ) image on image.imagesi=si.storeIdx
               left join DeliveryTipInfo dti on si.storeIdx=dti.storeId
               join UserInfo ui on ui.userIdx = ?
               left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
          WHERE (DATE(NOW())-DATE(si.createdAt)) < 2
  `;
  const [mainRows] = await connection.query(selectMainByNewListQuery, userId);
  return mainRows;
}

// 메인화면 인기 매장 리스트 조회 API
async function selectMainScreenByPopular(connection, userId) {
  const selectMainByPopularListQuery = `
          SELECT image.url as 'storeImageUrl',
                 storeName as 'storeName',
                 rv.star as 'averageStarRating',
                 rv.cnt as 'reviewCount',
                 concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance',
                 case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
                 case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as 'storeStatus'
          FROM StoreInfo si left join
               (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
               From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
               join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
               (select mu.storeId as imagesi, mu.menuImageUrl AS 'url'
                from StoreInfo si join
               (select miu.menuImageUrl,mi.storeId
                from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
                group by mu.storeId ) image on image.imagesi=si.storeIdx
               left join DeliveryTipInfo dti on si.storeIdx=dti.storeId
               join UserInfo ui on ui.userIdx = ?
               left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
		      WHERE rv.cnt >= 5 ORDER BY rv.star DESC  
  `;
  const [mainRows] = await connection.query(selectMainByPopularListQuery, userId);
  return mainRows;
}

// 메인화면 그 외의 매장 리스트 조회 API
async function selectMainScreenByOther(connection, userId) {
  const selectMainByOtherListQuery = `
    SELECT image.url as 'storeImageUrl',
           storeName as 'storeName',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as 'CheetahDelivery',
           averageDelivery as 'averageDeliveryTime',
           rv.star as 'averageStarRating',
           rv.cnt as 'reviewCount',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
           lm.mnN as 'menuList',
           cui.saleprice as 'Coupon',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as 'storeStatus'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
         From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
         join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
         (Select group_concat(menuName SEPARATOR ',') as mnN, mi.storeId as ssi
          From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx left join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx left join
		     (select ci.storeId, ci.salePrice as 'saleprice' from CouponInfo ci
          join StoreInfo si on ci.storeId=si.storeIdx group by ci.storeId) cui on cui.storeId=si.storeIdx
         left join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserInfo ui on ui.userIdx = ?
         left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx;
  `;
  const [mainRows] = await connection.query(selectMainByOtherListQuery, userId);
  return mainRows;
}

// 메인화면 카테고리 조회 API
async function selectStoreCategory(connection) {
  const selectStoreCategoryListQuery = `
        SELECT sc.categoryName as 'categoryName',
	             sc.categoryImageUrl as 'categoryImageUrl'
        FROM StoreCategoryInfo sc
        WHERE status = 'ACTIVE';
  `;
  const [categoryRows] = await connection.query(selectStoreCategoryListQuery);
  return categoryRows;
}

// 매장 메인화면 조회 API
async function selectMainScreen(connection, storeId) {
  const selectMainListQuery = `
  SELECT 	image.url as 'storeImageUrl',
		      storeName as 'storeName',
		      case when isCheetah = 1 then '치타배달' end as 'cheetahDelivery',
		      rv.star as 'averageStarRating',
          rv.cnt as 'reviewCount',
          averageDelivery as 'averageDeliveryTime',
          case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
          format(si.minimumOrder,0) as 'limitOrderPrice'
  FROM StoreInfo si left join
	    (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
      From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
      join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
      (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
       from StoreInfo si join
      (select miu.menuImageUrl,mi.storeId
       from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
       group by mu.storeId ) image on image.imagesi=si.storeIdx
      left join DeliveryTipInfo dti on si.storeIdx=dti.storeId
  WHERE si.storeIdx = ?;
  `;
  const [mainRows] = await connection.query(selectMainListQuery, storeId);
  return mainRows;
}

// 매장 리뷰 리스트 조회
async function selectMainReview(connection, storeId) {
  const selectStoreReviewListQuery = `
    SELECT riu.reviewImageUrl as 'reviewImageUrl',
	         ri.review as 'reviewText',
           ri.starValue as 'starRating'
    FROM ReviewInfo ri left join ReviewImageUrlInfo riu on ri.reviewIdx=riu.reviewId
    WHERE ri.storeId = ?;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewListQuery, storeId);
  return reviewRows;
}

// 매장 메뉴 분류 리스트 조회
async function selectMainMenuCategory(connection, storeId) {
  const selectStoreCategoryListQuery = `
    SELECT smci.storeCategoryIdx as 'storeCategoryId',
           smci.categoryName as 'menuCategory'
    FROM StoreMenuCategoryInfo smci join MenuInfo mi on mi.category=smci.storeCategoryIdx
    WHERE mi.storeId = ?
    GROUP BY smci.storeCategoryIdx;
  `;
  const [categoryRows] = await connection.query(selectStoreCategoryListQuery, storeId);
  return categoryRows;
}

// 매장 메뉴 카테고리별 메뉴 조회
async function selectDetailMenu(connection, categoryId) {
  const selectStoreCategoryListQuery = `
    SELECT mi.menuName as 'menuName',
		       mi.price as 'menuPrice',
           mi.description as 'menuDescription',
           miu.menuImageUrl as 'menuImageUrl'
    FROM MenuInfo mi join (Select menuId, MenuImageUrl From MenuImageUrl group by menuId) miu on mi.menuIdx = miu.menuId
    WHERE mi.category = ?;
  `;
  const [detailRows] = await connection.query(selectStoreCategoryListQuery, categoryId);
  return detailRows;
}

// 매장 카테고리 리스트 조회
async function selectMainCategory(connection, storeId) {
  const selectStoreCategoryListQuery = `
    SELECT mci.menuCategoryIdx as 'categoryId',
           mci.categoryName as 'menuCategoryName',
	         mci.maxSelect as 'maxSelect'
    FROM MenuCategoryInfo mci left join MenuInfo mi on mi.menuIdx=mci.menuId
    WHERE mi.storeId = ?;
  `;
  const [categoryRows] = await connection.query(selectStoreCategoryListQuery, storeId);
  return categoryRows;
}

// 카테고리별 옵션 조회
async function selectCategoryDetailMenu(connection, categoryId) {
  const selectStoreCategoryListQuery = `
    SELECT mcd.detailMenuName as 'categoryPlusOptionName',
           format(mcd.plusPrice,0) as 'plusPrice'
    FROM MenuCategoryDetailInfo mcd left join MenuCategoryInfo mc on mcd.menuCategoryId=mc.menuCategoryIdx
    WHERE mc.menucategoryIdx=?;
  `;
  const [detailRows] = await connection.query(selectStoreCategoryListQuery, categoryId);
  return detailRows;
}

// 매장 세부정보 조회 API
async function selectStoreDetailInfo(connection, storeId) {
  const selectStoreDetailListQuery = `
SELECT si.storeName as 'storeName',
	     si.storeNumber as 'storeNumber',
       si.storeAddress as 'storeAddress',
       si.representative as 'storeRepresentative',
       si.licenseNumber as 'storeLicenseNumber',
       si.brandName as 'storeBrandName',
       si.latitude as 'storeLatitude',
       si.longitude as 'storeLongitude',
       concat(si.startTime,'~',si.finishTime) as 'storeRunningTime',
       si.description as 'storeDescription',
       si.notice as 'storeNotice',
       si.menuOrigin as 'storeOriginInfo'
FROM StoreInfo si
WHERE storeIdx = ?;
  `;
  const [detailRows] = await connection.query(selectStoreDetailListQuery, storeId);
  return detailRows;
}

// 가게 오픈 여부
async function selectStoreActiveInfo(connection, storeId) {
  const storeActiveQuery = `
    select exists(select storeIdx from StoreInfo where storeIdx = ? and status = 'ACTIVE') as exist;
  `;
  const [storeActiveRow] = await connection.query(storeActiveQuery, storeId);
  return storeActiveRow;
}

// 가게의 배달 팁 조회
async function selectStoreDeliveryTipInfo(connection, storeId, sumprice) {
  const storeActiveQuery = `
    SELECT case di.limitorder when di.limitorder < ? then '0' else deliveryTip end as 'deliveryTip'
    FROM StoreInfo si join DeliveryTipInfo di on si.storeIdx=di.storeId
    WHERE di.status='ACTIVE' and si.storeIdx = ?
  `;
  const [storeActiveRow] = await connection.query(storeActiveQuery, [sumprice, storeId]);
  return storeActiveRow;
}
module.exports = {
  selectStoreByKeyword,
  selectStoreByCategory,
  selectMainScreenByNew,
  selectMainScreenByPopular,
  selectMainScreenByOther,
  selectStoreCategory,
  selectMainScreen,
  selectMainReview,
  selectMainMenuCategory,
  selectDetailMenu,
  selectMainCategory,
  selectCategoryDetailMenu,
  selectStoreDetailInfo,
  selectStoreActiveInfo,
  selectStoreDeliveryTipInfo,
};

  