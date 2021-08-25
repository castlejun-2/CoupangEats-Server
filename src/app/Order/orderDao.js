// 주문 정보 등록 및 IDX 반환
async function postOrderInfo(connection, userId, storeId, cardId) {
    const postOrderQuery = `
          INSERT INTO OrderInfo(userId, storeId, cardId)
          VALUES (?, ?, ?);
    `;
    const getOrderQuery = `
          SELECT orderIdx
          FROM OrderInfo
          WHERE userId = ? and storeId = ? and status = 'CART'
          ORDER BY createdAt DESC limit 1;
    `;
    const postOrder = await connection.query(postOrderQuery, [userId, storeId, cardId]);
    const [getOrderIdx] = await connection.query(getOrderQuery, [userId, storeId]);

    return getOrderIdx;
}
// 카트에 존재하는 메뉴의 매장과 현재 주문하려는 매장이 일치한지 여부 조회
async function selectSameStoreInCartInfo(connection, userId, storeId) {
    const getSameStoreQuery = `
        select exists(select orderIdx from OrderInfo where userId = ? and storeId != ? and status = 'CART') as exist;
      `;
    const [sameStoreRow] = await connection.query(getSameStoreQuery, [userId, storeId]);
    return sameStoreRow;
}

// 카트에 존재하는 동일 매장의 OrderIdx 가져오기
async function selectSameOrderInCartInfo(connection, userId, storeId) {
    const getSameOrderQuery = `
        SELECT orderIdx
        FROM OrderInfo oi
        WHERE userId = ? and storeId = ? and status='CART';
      `;
    const [sameOrderRow] = await connection.query(getSameOrderQuery, [userId, storeId]);
    return sameOrderRow;
}

// 주문 세부사항 토탈 정보 담기 
async function postOrderTotalInfo(connection, orderId, menuId, menuCount) {
    const postOrderQuery = `
          INSERT INTO OrderTotalDetailInfo(orderId, menuId, menuCount)
          VALUES (?, ?, ?);
    `;
    const getOrderQuery = `
          SELECT orderId as 'orderedId', orderTotalDetailIdx as 'orderIdx'
          FROM OrderTotalDetailInfo
          WHERE orderId = ? and status = 'ACTIVE'
          ORDER BY createdAt DESC limit 1;
    `;
    const postOrder = await connection.query(postOrderQuery, [orderId, menuId, menuCount]);
    const [getOrderIdx] = await connection.query(getOrderQuery, orderId);

    return getOrderIdx;
}

  // 주문정보 카트에 담기
async function postUserOrderInfoInCart(connection, postOrderDetailParams) {
    const postOrderInCartQuery = `
          INSERT INTO OrderDetailInfo(orderTotalId,menuCategoryId,menuDetailId)
          VALUES (?, ?, ?);
      `;
    const [postInCartRow] = await connection.query(postOrderInCartQuery, postOrderDetailParams);
    return postInCartRow;
}

// 카트 정보 미리보기 조회
async function selectCartInfo(connection, userId) {
    const getCartInfoQuery = `
        select count(*) as 'CartCount',
	           sum(st.SumPrice) as 'SumPrice'
        FROM StoreInfo si join DeliveryTipInfo di on si.storeIdx=di.storeId join
            (SELECT otdi.orderTotalDetailIdx as 'In-Cart Id',
	                sum((mi.price+ot.OptionPrice)*otdi.menuCount) as 'SumPrice',
                    oi.storeId as 'OrderStore',
                    otdi.menuCount as 'menuCnt'
            FROM OrderInfo oi join OrderTotalDetailInfo otdi on oi.orderIdx=otdi.orderId join MenuInfo mi on mi.menuIdx=otdi.menuId
	            join StoreInfo si on si.storeIdx=oi.storeId join UserInfo ui on ui.userIdx=oi.userId join
                (select orderTotalDetailIdx as otdiId, sum(plusPrice) as 'OptionPrice'
                from OrderInfo oi join OrderTotalDetailInfo otdi on oi.orderIdx=otdi.orderId join OrderDetailInfo odi on odi.orderTotalId=otdi.orderTotalDetailIdx
	                join MenuInfo mi on mi.menuIdx=otdi.menuId join MenuCategoryInfo mci on mci.menuId=mi.menuIdx join MenuCategoryDetailInfo mcdi on mcdi.menuCategoryId=mci.menuCategoryIdx
                where oi.userId = ? and oi.status = 'Cart' and odi.menuDetailId=mcdi.menuDetailIdx
                group by orderTotalDetailIdx) ot on ot.otdiId=otdi.orderTotalDetailIdx
            WHERE oi.status = 'CART' and oi.userId = ?
            GROUP BY otdi.orderTotalDetailIdx) st on st.OrderStore=si.storeIdx;
    `;
    const [getCartRow] = await connection.query(getCartInfoQuery, [userId, userId]);
    return getCartRow;
}

// 카트 비우기
async function deleteUserInCart(connection, userId) {
    const deleteCartQuery = `
        UPDATE OrderInfo
        SET status = 'DELETE'
        WHERE userId = ? and status='CART';
      `;
    const [deleteCartRow] = await connection.query(deleteCartQuery, userId);
    return deleteCartRow;
}

// 카트 정보 상세 조회(메뉴)
async function selectCartDetailByMenuInfo(connection, userId) {
    const getCartDetailInfoQuery = `
            SELECT oi.storeId as 'storeId',
                   mi.menuName as 'menuName',
	              (mi.price+pp.plusPrice)*otdi.menuCount as 'menuPrice',
                   otdi.menuCount as 'menuCount'
            FROM OrderInfo oi join OrderTotalDetailInfo otdi on oi.orderIdx=otdi.orderId
				              join OrderDetailInfo odi on otdi.orderTotalDetailIdx=odi.orderTotalId
				              join MenuInfo mi on otdi.menuId=mi.menuIdx join
                              (SELECT otdi.orderTotalDetailIdx as 'otdiIdx',
						              sum(mcdi.plusPrice) as 'plusPrice'
                               FROM OrderInfo oi join OrderTotalDetailInfo otdi on oi.orderIdx=otdi.orderId
						                         join OrderDetailInfo odi on otdi.orderTotalDetailIdx=odi.orderTotalId
						                         join MenuInfo mi on otdi.menuId=mi.menuIdx
                                                 left join MenuCategoryDetailInfo mcdi on odi.menuDetailId=mcdi.menuDetailIdx
					           WHERE oi.status='CART' and oi.userId = ? GROUP BY otdi.orderTotalDetailIdx) pp on pp.otdiIdx=otdi.orderTotalDetailIdx
            WHERE oi.status='CART' and oi.userId = ? GROUP BY otdi.orderTotalDetailIdx;
    `;
    const [getCartRow] = await connection.query(getCartDetailInfoQuery, [userId, userId]);
    return getCartRow;
}

// 카트 정보 상세 조회(사용 가능 쿠폰)
async function selectCartDetailByCouponInfo(connection, userId) {
    const getCartCouponInfoQuery = `
    SELECT count(*) as 'couponCount'
    FROM OrderInfo oi join StoreInfo si on oi.storeId=si.storeIdx
                      join CouponInfo ci on si.storeIdx=ci.storeId
                      join UserCouponInfo uci on uci.couponId=ci.couponIdx
                      join UserInfo ui on ui.userIdx=uci.userId
    WHERE oi.status='CART' and ui.userIdx=? and uci.status='ACTIVE';
    `;
    const [getCartRow] = await connection.query(getCartCouponInfoQuery, userId);
    return getCartRow;
}

// 사용자와 주문내역 일치여부 조회
async function selectUserIdSameOrderIdInfo(connection, userId, orderId) {
    const getIsSameQuery = `
    select exists(select orderIdx from OrderInfo where userId = ? and orderIdx = ? and status = 'ACTIVE') as exist,
           storeId
    FROM OrderInfo
    WHERE userId = ? and orderIdx = ? and status = 'ACTIVE';
    `;
    const [getSameRow] = await connection.query(getIsSameQuery, [userId, orderId, userId, orderId]);
    return getSameRow;
}

// 주문내역 총 비용 삽입
async function posttotalCostInOrderInfo(connection, orderId, deliveryTip, sumPrice) {
    const postSumCostQuery = `
    UPDATE OrderInfo
    SET sumCost = ?,deliveryTip = ?
    WHERE orderIdx = ?;
    `;
    const [postSumCostRow] = await connection.query(postSumCostQuery, [sumPrice, deliveryTip, orderId]);
    return postSumCostRow;
}

// 과거 주문내역 조회
async function selectOrderHistoryInfo(connection, userId) {
    const getOrderHistoryQuery = `
SELECT oi.orderIdx as 'orderId',
	   mu.mimage as 'storeImage',
	   si.storeName as 'storeName',
	   date_format(oi.createdAt,'%Y-%m-%d %H:%i') as 'orderDate',
       case when oi.status='ACTIVE' then '배달 완료'
			when oi.status='DELETE' then '주문 취소됨' end as 'orderState',
	   ri.starValue as 'starRating',
       ml.menulist as 'menuList',
       oi.sumCost as 'sumCost'
FROM StoreInfo si join OrderInfo oi on oi.storeId=si.storeIdx join ReviewInfo ri on ri.orderId=oi.orderIdx left join
     (Select oi.orderIdx as 'oid', group_concat(mi.menuName SEPARATOR '+') as 'menuList'
      FROM OrderInfo oi join OrderTotalDetailInfo otdi on oi.orderIdx=otdi.orderId
		   join MenuInfo mi on otdi.menuId=mi.menuIdx group by oi.orderIdx) ml on ml.oid=oi.orderIdx left join
	 (Select mi.storeId as 'msid', miu.menuImageUrl as 'mimage'
      FROM MenuInfo mi join MenuImageUrl miu on miu.menuId=mi.menuIdx Where isMain=1 Group By mi.storeId) mu on mu.msid=si.storeIdx
WHERE oi.userId=? and (oi.status='ACTIVE' or oi.status='INACTIVE')
ORDER BY oi.createdAt DESC;
    `;
    const [getOrderHistoryRow] = await connection.query(getOrderHistoryQuery, userId);
    return getOrderHistoryRow;
}
  module.exports = {
    postOrderInfo,
    postOrderTotalInfo,
    postUserOrderInfoInCart,
    selectSameOrderInCartInfo,
    selectCartInfo,
    selectSameStoreInCartInfo,
    deleteUserInCart,
    selectCartDetailByMenuInfo,
    selectCartDetailByCouponInfo,
    selectUserIdSameOrderIdInfo,
    posttotalCostInOrderInfo,
    selectOrderHistoryInfo,
  }