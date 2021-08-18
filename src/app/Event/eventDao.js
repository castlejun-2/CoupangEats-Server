// 진행중인 이벤트 조회
async function selectEvent(connection) {
    const selectEventListQuery = `
            SELECT ei.eventImageUrl as '이벤트 이미지',
                   concat(@SEQ := @SEQ+1,'/',cnt_t.cnt) as '이벤트 갯수'
            FROM EventInfo ei,
                 (Select count(*) as cnt From EventInfo Where status='ACTIVE') cnt_t,
                 (SELECT @SEQ := 0) A
            WHERE status='ACTIVE';`;
    const [eventRows] = await connection.query(selectEventListQuery);
    return eventRows;
}

// 진행중인 이벤트 쿠폰 조회
async function selectCoupon(connection) {
  const selectCouponListQuery = `
          SELECT si.storeName as '할인 쿠폰 가게 이름',
                 mui.MainImage as '가게 대표 사진',
                 ci.salePrice as '할인가격'
          FROM StoreInfo si join CouponInfo ci on ci.storeId=si.storeIdx,
               (Select tmi.storeId as tsid, miu.menuImageUrl as MainImage
                From MenuImageUrl miu join MenuInfo tmi on tmi.menuIdx=miu.menuId
                Where miu.isMain=1 group by tmi.StoreId) mui
          WHERE mui.tsid=si.storeIdx and ci.status='ACTIVE';
  `;
  const [couponRows] = await connection.query(selectCouponListQuery);
  return couponRows;
}
module.exports = {
    selectEvent,
    selectCoupon
};