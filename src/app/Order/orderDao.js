// 주문 정보 등록 및 IDX 반환
async function postOrderInfo(connection, userId, storeId) {
    const postOrderQuery = `
          INSERT INTO OrderInfo(userId, storeId)
          VALUES (?, ?);
    `;
    const getOrderQuery = `
          SELECT orderIdx
          FROM OrderInfo
          WHERE userId = ? and storeId = ? and status = 'CART'
          ORDER BY createdAt DESC limit 1;
    `;
    const postOrder = await connection.query(postOrderQuery, [userId, storeId]);
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

// 주문 세부사항 토탈 정보 담기 
async function postOrderTotalInfo(connection, orderId, menuId, menuCount) {
    const postOrderQuery = `
          INSERT INTO OrderTotalDetailInfo(orderId, menuId, menuCount)
          VALUES (?, ?, ?);
    `;
    const getOrderQuery = `
          SELECT orderTotalDetailIdx as 'orderIdx'
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

  // 카트 정보 조회
async function selectCartInfo(connection, userId) {
    const getCartInfoQuery = `
        select count(*) as 'CartCount',
	           sum(st.SumPrice+di.deliveryTip) as 'SumPrice'
        FROM StoreInfo si join DeliveryTipInfo di on si.storeIdx=di.storeId join
            (SELECT otdi.orderTotalDetailIdx as 'In-Cart Id',
	                sum((mi.price+ot.OptionPrice*otdi.menuCount)) as 'SumPrice',
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

  module.exports = {
    postOrderInfo,
    postOrderTotalInfo,
    postUserOrderInfoInCart,
    selectCartInfo,
    selectSameStoreInCartInfo,
  }