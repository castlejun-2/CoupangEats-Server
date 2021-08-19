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
               join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
         (Select group_concat(menuName SEPARATOR ',') as mnN, mi.storeId as ssi
          From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx join
		     (select ci.storeId, ci.salePrice as 'saleprice' from CouponInfo ci
          join StoreInfo si on ci.storeId=si.storeIdx group by ci.storeId) cui on cui.storeId=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserInfo ui on ui.userIdx = ?
         join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
    WHERE concat(storeName,lm.mnN) Like concat ("%",?,"%");
`;
    const [listRows] = await connection.query(selectStoreByKeywordQuery, [userId, keyword]);
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
               join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
         (Select group_concat(menuName SEPARATOR ',') as mnN, mi.storeId as ssi
          From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx join
		     (select ci.storeId, ci.salePrice as 'saleprice' from CouponInfo ci
          join StoreInfo si on ci.storeId=si.storeIdx group by ci.storeId) cui on cui.storeId=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserInfo ui on ui.userIdx = ?
         join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
    WHERE si.category Like concat ("%",?,"%")
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
                join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
               (select mu.storeId as imagesi, mu.menuImageUrl AS 'url'
                from StoreInfo si join
               (select miu.menuImageUrl,mi.storeId
                from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
                group by mu.storeId ) image on image.imagesi=si.storeIdx
               join DeliveryTipInfo dti on si.storeIdx=dti.storeId
               join UserInfo ui on ui.userIdx = ?
               join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
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
                join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
               (select mu.storeId as imagesi, mu.menuImageUrl AS 'url'
                from StoreInfo si join
               (select miu.menuImageUrl,mi.storeId
                from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
                group by mu.storeId ) image on image.imagesi=si.storeIdx
               join DeliveryTipInfo dti on si.storeIdx=dti.storeId
               join UserInfo ui on ui.userIdx = ?
               join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
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
               join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
         (Select group_concat(menuName SEPARATOR ',') as mnN, mi.storeId as ssi
          From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx join
		     (select ci.storeId, ci.salePrice as 'saleprice' from CouponInfo ci
          join StoreInfo si on ci.storeId=si.storeIdx group by ci.storeId) cui on cui.storeId=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserInfo ui on ui.userIdx = ?
         join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx;
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
module.exports = {
  selectStoreByKeyword,
  selectStoreByCategory,
  selectMainScreenByNew,
  selectMainScreenByPopular,
  selectMainScreenByOther,
  selectStoreCategory,
};

  