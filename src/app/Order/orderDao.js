// 주문 정보 등록 및 IDX 반환
async function postOrderInfo(connection, userId, storeId) {
    const postOrderQuery = `
          INSERT INTO OrderInfo(userId, storeId)
          VALUES (?, ?);
    `;
    const getOrderQuery = `
          SELECT orderIdx
          FROM OrderInfo
          WHERE userId = 1 and storeId = 1 and status = 'CART'
          ORDER BY createdAt DESC limit 1;
    `;
    const postOrder = await connection.query(postOrderQuery, [userId, storeId]);
    const [getOrderIdx] = await connection.query(getOrderQuery, [userId, storeId]);

    return getOrderIdx;
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
          WHERE orderId = ? and menuId = ? and status = 'ACTIVE'
          ORDER BY createdAt DESC limit 1;
    `;
    const postOrder = await connection.query(postOrderQuery, [orderId, menuId, menuCount]);
    const [getOrderIdx] = await connection.query(getOrderQuery, [orderId, menuId]);

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
  module.exports = {
    postOrderInfo,
    postOrderTotalInfo,
    postUserOrderInfoInCart,
  }