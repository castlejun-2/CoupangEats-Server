// 키워드로 가게 조회
async function selectStore(connection, keyword) {
    const selectStoreQuery = `
    SELECT image.url as '가게 사진',
           storeName as '가게 이름',
           case when isCheetah = 1 then '치타배달' else 'NULL' end as '치타배달',
           averageDelivery as '평균 배달시간',
           rv.star as '평균 평점',
           rv.cnt as '리뷰 갯수',
           storeAddress as '가게 주소',
           case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
           lm.mnN as '메뉴리스트',
           case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
    FROM StoreInfo si left join
         (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
         From ReviewInfo ri join MenuInfo mui on ri.menuId = mui.menuIdx group by sti) rv on rv.sti = si.storeIdx join
         (Select group_concat(menuName SEPARATOR ',') as mnN, si.storeIdx as ssi
         From MenuInfo mi join StoreInfo si on mi.storeId = si.storeIdx group by si.storeIdx) lm on lm.ssi = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url', storeId
         from StoreInfo si join
         (select *
         from MenuImageUrl where isMain=1) mu on mu.storeId=si.storeIdx
         group by mu.storeId ) image on image.imagesi=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
    WHERE concat(storeName,lm.mnN) Like concat ("%",?,"%");
`;
    const [listRows] = await connection.query(selectStoreQuery, keyword);
    return listRows;
  }

  module.exports = {
    selectStore,
  };