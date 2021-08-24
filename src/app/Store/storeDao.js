// 키워드로 가게 조회
async function selectStoreByKeyword(connection, userId, keyword) {
    const selectStoreByKeywordQuery = `
    SELECT si.storeIdx as 'storeId',
           image.url as 'storeImageUrl',
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
    SELECT si.storeIdx as 'storeId',
           image.url as 'storeImageUrl',
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

//치타배달 매장 조회
async function selectStoreByCheetahList(connection, userId) {
  const selectStoreByCheetahQuery = `
    SELECT si.storeIdx as 'storeId',
           image.url as 'storeImageUrl',
           storeName as 'storeName',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as 'CheetahDelivery',
           averageDelivery as 'averageDeliveryTime',
           rv.star as 'averageStarRating',
           rv.cnt as 'reviewCount',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as 'deliveryTip',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as 'storeStatus'
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
         join UserInfo ui on ui.userIdx = ?
         left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
    WHERE si.isCheetah = 1
    HAVING distance < 26;
  `;
  const [cheetahRows] = await connection.query(selectStoreByCheetahQuery, userId);
  return cheetahRows;
}

// 메인화면 새로 입점한 가게 리스트 조회 API
async function selectMainScreenByNew(connection, userId) {
  const selectMainByNewListQuery = `
          SELECT si.storeIdx as 'storeId',
                 image.url as 'storeImageUrl',
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
          SELECT si.storeIdx as 'storeId',
                 image.url as 'storeImageUrl',
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
    SELECT si.storeIdx as 'storeId',
           image.url as 'storeImageUrl',
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
		      case when isCheetah = 1 then '치타배달' else 'NULL' end as 'cheetahDelivery',
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

// 매장 리뷰 상단리스트(이름,평균평점,평점 갯수) 조회
async function selectReviewTopLayerInfo(connection, storeId) {
  const selectStoreReviewTopListQuery = `
  SELECT si.storeName as 'storeName',
		     rv.star as 'averageStarRating',
         rv.cnt as 'reviewCount'
  FROM StoreInfo si left join
	    (Select count(*) as cnt, round(avg(starValue),1) as star, si.storeIdx as sti
      From ReviewInfo ri join StoreInfo si on si.storeIdx=ri.storeId 
      join OrderInfo oi on orderIdx=ri.orderId where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx
  WHERE si.storeIdx = ?;
  `;
  const [reviewInfoRows] = await connection.query(selectStoreReviewTopListQuery, storeId);
  return reviewInfoRows;
}

// 포토리뷰 도움 많은 순 조회 API
async function selectPhotoReviewByHelp(connection, storeId) {
  const selectStoreReviewByHelpListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and rimage.reviewUrl is not NULL and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY isHelp DESC;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByHelpListQuery, storeId);
  return reviewRows;
}

// 포토리뷰 별점 오름차순 조회 API
async function selectPhotoReviewByAsce(connection, storeId) {
  const selectStoreReviewByAsceListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and rimage.reviewUrl is not NULL and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY starRating;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByAsceListQuery, storeId);
  return reviewRows;
}

// 포토리뷰 별점 내림차순 조회 API
async function selectPhotoReviewBydesc(connection, storeId) {
  const selectStoreReviewByDescListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and rimage.reviewUrl is not NULL and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY starRating DESC;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByDescListQuery, storeId);
  return reviewRows;
}

// 포토리뷰 최신등록순 조회 API
async function selectPhotoReviewByRecent(connection, storeId) {
  const selectStoreReviewByRecentListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and rimage.reviewUrl is not NULL and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY createDay;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByRecentListQuery, storeId);
  return reviewRows;
}

// 매장리뷰 도움 많은 순 조회 API
async function selectReviewByHelp(connection, storeId) {
  const selectStoreReviewByHelpListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY isHelp DESC;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByHelpListQuery, storeId);
  return reviewRows;
}

// 매장리뷰 별점 오름차순 조회 API
async function selectReviewByAsce(connection, storeId) {
  const selectStoreReviewByAsceListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY starRating;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByAsceListQuery, storeId);
  return reviewRows;
}

// 매장리뷰 별점 내림차순 조회 API
async function selectReviewBydesc(connection, storeId) {
  const selectStoreReviewByDescListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY starRating DESC;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByDescListQuery, storeId);
  return reviewRows;
}

// 매장리뷰 최신등록순 조회 API
async function selectReviewByRecent(connection, storeId) {
  const selectStoreReviewByRecentListQuery = `
SELECT oi.orderIdx as 'oid',
	     ui.userName as 'userName',
	     ri.starValue as 'starRating',
       concat(TIMESTAMPDIFF(DAY,ri.createdAt,now()),'일 전') as 'createDay',
       rimage.reviewUrl as 'reviewImageUrl',
       ri.review as 'reviewText',
       ml.mlist as 'orderMenu',
       ri.isHelp as 'helpReview'
FROM UserInfo ui join ReviewInfo ri on ui.userIdx=ri.userId left join
	(SELECT riui.reviewId as rrid, group_concat(riui.ReviewImageUrl SEPARATOR '-') as 'reviewUrl'
	FROM ReviewImageUrlInfo riui join ReviewInfo ri on riui.reviewId=ri.reviewIdx
	GROUP BY riui.reviewId) rimage on rimage.rrid=ri.reviewIdx left join OrderInfo oi on oi.orderIdx = ri.orderId
	left join OrderTotalDetailInfo otdi on otdi.orderId=oi.orderIdx left join
    (SELECT oi.orderIdx as moid, group_concat(menuName) as 'mlist'
	 FROM MenuInfo mi join OrderTotalDetailInfo otdi on mi.menuIdx=otdi.menuId join OrderInfo oi on oi.orderIdx=otdi.orderId
	 GROUP BY oi.orderIdx) ml on ri.orderId = ml.moid
WHERE ri.storeId = ? and ri.status = 'ACTIVE' and oi.status = 'ACTIVE'
GROUP BY oi.orderIdx
ORDER BY createDay
  `;
  const [reviewRows] = await connection.query(selectStoreReviewByRecentListQuery, storeId);
  return reviewRows;
}

// 리뷰 도움돼요 확인 여부
async function selectCheckHelpReviewInfo(connection, userId, reviewId) {
  const selectCheckHelpReviewQuery = `
  SELECT status
  FROM ReviewHelpInfo
  WHERE userId = ? and reviewId = ?;
  `;
  const [checkReviewRows] = await connection.query(selectCheckHelpReviewQuery, [userId, reviewId]);
  return checkReviewRows;
}

// 리뷰 도움안돼요 확인 여부
async function selectCheckNotHelpReviewInfo(connection, userId, reviewId) {
  const selectCheckHelpReviewQuery = `
  SELECT status
  FROM ReviewNotHelpInfo
  WHERE userId = ? and reviewId = ?;
  `;
  const [checkReviewRows] = await connection.query(selectCheckHelpReviewQuery, [userId, reviewId]);
  return checkReviewRows;
}

// 리뷰 도움여부 증가를 한번 더 누를시 감소
async function changeReviewIsHelp(connection, reviewId) {
  const changeHelpReviewQuery = `
  UPDATE ReviewInfo
  SET isHelp = isHelp - 1
  WHERE reviewIdx = ?;
  `;
  const [changeReviewRows] = await connection.query(changeHelpReviewQuery, reviewId);
  return changeReviewRows;
}

// 리뷰 도움안돼요여부 증가를 한번 더 누를시 감소
async function changeReviewIsNotHelp(connection, reviewId) {
  const changeNotHelpReviewQuery = `
  UPDATE ReviewInfo
  SET isNotHelp = isNotHelp - 1
  WHERE reviewIdx = ?;
  `;
  const [changeReviewRows] = await connection.query(changeNotHelpReviewQuery, reviewId);
  return changeReviewRows;
}

// 리뷰 도움여부 상태 변경
async function changeUserIsHelpReview(connection, userId, reviewId) {
  const changeHelpReviewQuery = `
  UPDATE ReviewHelpInfo
  SET status = 'DELETE'
  WHERE userId = ? and reviewId = ?;
  `;
  const [changeReviewRows] = await connection.query(changeHelpReviewQuery, [userId, reviewId]);
  return changeReviewRows;
}

// 리뷰 도움안돼요여부 상태 변경
async function changeUserIsNotHelpReview(connection, userId, reviewId) {
  const changeNotHelpReviewQuery = `
  UPDATE ReviewNotHelpInfo
  SET status = 'DELETE'
  WHERE userId = ? and reviewId = ?;
  `;
  const [changeReviewRows] = await connection.query(changeNotHelpReviewQuery, [userId, reviewId]);
  return changeReviewRows;
}

// 리뷰 도움여부 증가를 시켰음을 확인
async function insertUserIsHelpReview(connection, userId, reviewId) {
  const insertHelpReviewQuery = `
  INSERT INTO ReviewHelpInfo(userId, reviewId)
  VALUES (?, ?);
  `;
  const [insertReviewRows] = await connection.query(insertHelpReviewQuery, [userId, reviewId]);
  return insertReviewRows;
}

// 리뷰 도움안돼요여부 증가를 시켰음을 확인
async function insertUserIsNotHelpReview(connection, userId, reviewId) {
  const insertNotHelpReviewQuery = `
  INSERT INTO ReviewNotHelpInfo(userId, reviewId)
  VALUES (?, ?);
  `;
  const [insertReviewRows] = await connection.query(insertNotHelpReviewQuery, [userId, reviewId]);
  return insertReviewRows;
}

// 리뷰 도움여부 증가를 시켰음을 확인(수정)
async function updateUserIsHelpReview(connection, userId, reviewId) {
  const updateHelpReviewQuery = `
  UPDATE ReviewHelpInfo
  SET status = 'ACTIVE'
  WHERE userId = ? and reviewId = ?;
  `;
  const [updateReviewRows] = await connection.query(updateHelpReviewQuery, [userId, reviewId]);
  return updateReviewRows;
}

// 리뷰 도움안돼요여부 증가를 시켰음을 확인(수정)
async function updateUserIsNotHelpReview(connection, userId, reviewId) {
  const updateNotHelpReviewQuery = `
  UPDATE ReviewNotHelpInfo
  SET status = 'ACTIVE'
  WHERE userId = ? and reviewId = ?;
  `;
  const [updateReviewRows] = await connection.query(updateNotHelpReviewQuery, [userId, reviewId]);
  return updateReviewRows;
}

// 리뷰 도움여부 증가
async function updateReviewIsHelp(connection, reviewId) {
  const updateHelpReviewQuery = `
  UPDATE ReviewInfo
  SET isHelp = isHelp + 1
  WHERE reviewIdx = ?;
  `;
  const [updateReviewRows] = await connection.query(updateHelpReviewQuery, reviewId);
  return updateReviewRows;
}

// 리뷰 도움안돼요여부 증가
async function updateReviewIsNotHelp(connection, reviewId) {
  const updateNotHelpReviewQuery = `
  UPDATE ReviewInfo
  SET isNotHelp = isNotHelp + 1
  WHERE reviewIdx = ?;
  `;
  const [updateReviewRows] = await connection.query(updateNotHelpReviewQuery, reviewId);
  return updateReviewRows;
}

// 이미 작성한 리뷰인지 확인
async function selectReviewExist(connection, userId, orderId) {
  const checkReviewExistQuery = `
    select exists(select reviewIdx from ReviewInfo where userId = ? and orderId = ? and status = 'ACTIVE') as exist
  `;
  const [reviewExistRows] = await connection.query(checkReviewExistQuery, [userId, orderId]);
  return reviewExistRows;
}

// 리뷰 작성
async function insertReviewInfo(connection, userId, orderId, storeId, starValue, review) {
  const insertReviewQuery = `
    INSERT INTO ReviewInfo(orderId, userId, storeId, starValue, review)
    VALUES (?, ?, ?, ? ,?);
  `;
  const selectReviewId = `
    SELECT reviewIdx
    FROM ReviewInfo
    WHERE orderId = ? and userId = ?
  `;
  const [insertReviewRows] = await connection.query(insertReviewQuery, [orderId, userId, storeId, starValue, review]);
  const [selectReviewIdRows] = await connection.query(selectReviewId, [orderId, userId]);
  return selectReviewIdRows;
}

// 리뷰 이미지 작성
async function insertReviewImage(connection,  reviewId, reviewImageUrl) {
  const insertReviewQuery = `
    INSERT INTO ReviewImageUrlInfo(reviewId, reviewImageUrl)
    VALUES (?, ?);
  `;
  const [insertImageRows] = await connection.query(insertReviewQuery, [ reviewId, reviewImageUrl]);
  return insertImageRows;
}

// 리뷰 이미지 삭제
async function deleteReviewImage(connection, reviewId, reviewImageUrlIdx) {
  const deleteReviewQuery = `
      DELETE
      FROM ReviewImageUrlInfo
      WHERE reviewId = ? and reviewImageUrlIdx = ?;
  `;
  const [deleteImageRows] = await connection.query(deleteReviewQuery, [reviewId, reviewImageUrlIdx]);
  return deleteImageRows;
}

// 리뷰 수정(텍스트만)
async function updateOnlyTextReviewInfo(connection, reviewId, review) {
  const updateReviewQuery = `
      UPDATE ReviewInfo
      SET review = ?
      WHERE reviewIdx = ?;
  `;
  const [updateReviewRows] = await connection.query(updateReviewQuery, [review, reviewId]);
  return updateReviewRows;
}

// 리뷰 수정(평점만)
async function updateOnlyStarValueReviewInfo(connection, reviewId, starValue) {
  const updateReviewQuery = `
      UPDATE ReviewInfo
      SET starValue = ?
      WHERE reviewIdx = ?;
  `;
  const [updateReviewRows] = await connection.query(updateReviewQuery, [starValue, reviewId]);
  return updateReviewRows;
}

// 리뷰 수정
async function updateReviewInfo(connection, reviewId, starValue, review) {
  const updateReviewQuery = `
      UPDATE ReviewInfo
      SET starValue = ?,review = ?
      WHERE reviewIdx = ?;
  `;
  const [updateReviewRows] = await connection.query(updateReviewQuery, [starValue, review, reviewId]);
  return updateReviewRows;
}


// 매장 배달팁 상세 조회
async function selectDeliveryTipInfo(connection, storeId) {
  const selectStoreDeliveryTipQuery = `
SELECT concat(format(dti.limitOrder,0),'원~') as 'Order Price',
	     concat(format(dti.deliveryTip,0),'원') as 'Delivery Tip'
FROM DeliveryTipInfo dti join StoreInfo si on dti.storeId=si.storeIdx
WHERE si.storeIdx = ? and dti.status = 'ACTIVE';
  `;
  const [deliveryTipRows] = await connection.query(selectStoreDeliveryTipQuery, storeId);
  return deliveryTipRows;
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

// 주변 치타배달 매장 미리보기 팜업 조회
async function selectStoreCheetahPreviewInfo(connection, userId) {
  const storeCheetahPreviewQuery = `
    SELECT count(sd.distance) as 'cheetahStoreCount'
    FROM (
    SELECT concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS 'distance'
    FROM UserInfo ui left join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx,StoreInfo si
    WHERE ui.userIdx = ?
    HAVING distance < 26 ) sd
  `;
  const [nearStoreRow] = await connection.query(storeCheetahPreviewQuery, userId);
  return nearStoreRow;
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
  selectDeliveryTipInfo,
  selectStoreActiveInfo,
  selectStoreDeliveryTipInfo,
  selectReviewByAsce,
  selectReviewBydesc,
  selectReviewByHelp,
  selectReviewByRecent,
  selectPhotoReviewByAsce,
  selectPhotoReviewBydesc,
  selectPhotoReviewByHelp,
  selectPhotoReviewByRecent,
  selectReviewTopLayerInfo,
  selectCheckHelpReviewInfo,
  insertUserIsHelpReview,
  updateUserIsHelpReview,
  updateReviewIsHelp,
  changeReviewIsHelp,
  changeUserIsHelpReview,
  selectStoreByCheetahList,
  selectCheckNotHelpReviewInfo,
  insertUserIsNotHelpReview,
  updateUserIsNotHelpReview,
  updateReviewIsNotHelp,
  changeReviewIsNotHelp,
  insertReviewInfo,
  insertReviewImage,
  deleteReviewImage,
  changeUserIsNotHelpReview,
  selectStoreCheetahPreviewInfo,
  selectReviewExist,
  updateOnlyStarValueReviewInfo,
  updateOnlyTextReviewInfo,
  updateReviewInfo,
};

  