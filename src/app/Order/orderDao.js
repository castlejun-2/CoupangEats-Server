// 주문 정보 등록 및 IDX 반환
async function postOrderInfo(connection, userId, storeId) {
    const postOrderQuery = `
          INSERT INTO OrderInfo(userId, storeId)
          VALUES (?, ?);
      `;
    const getOrderQuery = `
          SELECT orderInfoIdx as 'orderIdx'
          FROM OrderInfo
          WHERE userId = ? and storeId = ? and status = 'CART';
      `;
    const postOrder = await connection.query(postOrderQuery, [userId, storeId]);
    const [getOrderIdx] = await connection.query(getOrderQuery, [userId, storeId]);

    return getOrderIdx;
  }

  // 주문정보 카트에 담기
async function postUserOrderInfoInCart(connection, postOrderDetailParams) {
    const postOrderInCartQuery = `
          INSERT INTO OrderDetailInfo(orderId,menuId,menuCategoryId,menuDetailId)
          VALUES (?, ?, ?, ?);
      `;
    const [postInCartRow] = await connection.query(postOrderInCartQuery, postOrderDetailParams);
    return postInCartRow;
  }
  module.exports = {
    postOrderInfo,
    postUserOrderInfoInCart,
  }