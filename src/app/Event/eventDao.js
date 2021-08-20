// 진행중인 이벤트 조회
async function selectEvent(connection) {
    const selectEventListQuery = `
            SELECT ei.eventImageUrl as 'eventImageUrl',
                   concat(@SEQ := @SEQ+1,'/',cnt_t.cnt) as 'eventCount'
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
          SELECT si.storeName as 'storeName',
                 mui.MainImage as 'storeImageUrl',
                 ci.salePrice as 'salePrice'
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
    selectCoupon,
};