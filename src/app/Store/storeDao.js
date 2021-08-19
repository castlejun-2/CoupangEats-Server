// 키워드로 가게 조회
async function selectStoreByKeyword(connection, userId, keyword) {
    const selectStoreByKeywordQuery = `
    SELECT image.url as '가게 사진',
           storeName as '가게 이름',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as '치타배달',
           averageDelivery as '평균 배달시간',
           rv.star as '평균 평점',
           rv.cnt as '리뷰 갯수',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
           lm.mnN as '메뉴리스트',
           cui.saleprice as '할인쿠폰',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
          From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
               join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
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
    SELECT image.url as '가게 사진',
           storeName as '가게 이름',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as '치타배달',
           averageDelivery as '평균 배달시간',
           rv.star as '평균 평점',
           rv.cnt as '리뷰 갯수',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
           lm.mnN as '메뉴리스트',
           cui.saleprice as '할인쿠폰',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
          From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
               join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
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
          SELECT image.url as '가게 사진',
                 storeName as '가게 이름',
                 rv.star as '평균 평점',
                 rv.cnt as '리뷰 갯수',
                 concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
                 case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
                 case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
          FROM StoreInfo si left join
               (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
                From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
                join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
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
          SELECT image.url as '가게 사진',
                 storeName as '가게 이름',
                 rv.star as '평균 평점',
                 rv.cnt as '리뷰 갯수',
                 concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
                 case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
                 case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
          FROM StoreInfo si left join
               (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
                From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
                join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
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
    SELECT image.url as '가게 사진',
           storeName as '가게 이름',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as '치타배달',
           averageDelivery as '평균 배달시간',
           rv.star as '평균 평점',
           rv.cnt as '리뷰 갯수',
           concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
           lm.mnN as '메뉴리스트',
           cui.saleprice as '할인쿠폰',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
          From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
               join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
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
        SELECT sc.categoryName as '카테고리 이름',
	             sc.categoryImageUrl as '카테고리 대표 사진'
        FROM StoreCategoryInfo sc
        WHERE status = 'ACTIVE';
  `;
  const [categoryRows] = await connection.query(selectStoreCategoryListQuery);
  return categoryRows;
}

// 매장 메인화면 조회 API
async function selectMainScreen(connection, storeId) {
  const selectMainListQuery = `
  SELECT 	image.url as '가게 사진',
		      storeName as '가게 이름',
		      case when isCheetah = 1 then '치타배달' end as '치타배달',
		      rv.star as '평균 평점',
          rv.cnt as '리뷰 갯수',
          averageDelivery as '평균 배달시간',
          case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
          format(si.minimumOrder,0) as '최소 주문 가격'
  FROM StoreInfo si left join
	    (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
	     From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
		   join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx left join
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
    SELECT riu.reviewImageUrl as '리뷰 사진',
	         ri.review as '리뷰 내용',
           ri.starValue as '평점'
    FROM ReviewInfo ri left join ReviewImageUrlInfo riu on ri.reviewIdx=riu.reviewId
    WHERE ri.storeId = ?;
  `;
  const [reviewRows] = await connection.query(selectStoreReviewListQuery, storeId);
  return reviewRows;
}

// 매장 메뉴 분류 리스트 조회
async function selectMainMenuCategory(connection, storeId) {
  const selectStoreCategoryListQuery = `
    SELECT smci.storeCategoryIdx as 'Id',
           smci.categoryName as '메뉴 카테고리'
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
    SELECT mi.menuName as '메뉴이름',
		       mi.price as '메뉴가격',
           mi.description as '메뉴설명',
           miu.menuImageUrl as '메뉴이미지'
    FROM MenuInfo mi join (Select menuId, MenuImageUrl From MenuImageUrl group by menuId) miu on mi.menuIdx = miu.menuId
    WHERE mi.category = ?;
  `;
  const [detailRows] = await connection.query(selectStoreCategoryListQuery, categoryId);
  return detailRows;
}

// 매장 카테고리 리스트 조회
async function selectMainCategory(connection, storeId) {
  const selectStoreCategoryListQuery = `
    SELECT mci.menuCategoryIdx as 'Id',
           mci.categoryName as '메뉴 카테고리',
	         mci.maxSelect as '최대선택갯수'
    FROM MenuCategoryInfo mci left join MenuInfo mi on mi.menuIdx=mci.menuId
    WHERE mi.storeId = ?;
  `;
  const [categoryRows] = await connection.query(selectStoreCategoryListQuery, storeId);
  return categoryRows;
}

// 카테고리별 옵션 조회
async function selectCategoryDetailMenu(connection, categoryId) {
  const selectStoreCategoryListQuery = `
    SELECT mcd.detailMenuName as '카테고리 추가 옵션',
           format(mcd.plusPrice,0) as '추가금액'
    FROM MenuCategoryDetailInfo mcd left join MenuCategoryInfo mc on mcd.menuCategoryId=mc.menuCategoryIdx
    WHERE mc.menucategoryIdx=?;
  `;
  const [detailRows] = await connection.query(selectStoreCategoryListQuery, categoryId);
  return detailRows;
}

// 매장 세부정보 조회 API
async function selectStoreDetailInfo(connection, storeId) {
  const selectStoreDetailListQuery = `
SELECT si.storeName as '매장 이름',
	     si.storeNumber as '전화번호',
       si.storeAddress as '매장 주소',
       si.representative as '대표자명',
       si.licenseNumber as '사업자등록번호',
       si.brandName as '상호명',
       si.latitude as '위도',
       si.longitude as '경도',
       concat(si.startTime,'~',si.finishTime) as '영업시간',
       si.description as '매장소개',
       si.notice as '공지사항',
       si.menuOrigin as '원산지 정보'
FROM StoreInfo si
WHERE storeIdx = ?;
  `;
  const [detailRows] = await connection.query(selectStoreDetailListQuery, storeId);
  return detailRows;
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
};

  