// 키워드로 가게 조회
async function selectStore(connection, keyword) {
    const selectStoreQuery = `
                  SELECT storeName as '가게 이름',
                         isCheetah as '치타배달 유무',
                         averageDelivery as '평균 배달시간',
                         rv.star as '평균 평점',
                         rv.cnt as '리뷰 갯수',
                         dt.deliveryTip as '배달팁',
                         mi.menuinfo as '메뉴리스트' 
                  FROM StoreInfo
                  WHERE storeName Like concat (“%”,?,”%”);
                  `;
    const [listRows] = await connection.query(selectStoreQuery, keyword);
    return listRows;
  }

  module.exports = {
    selectStore,
  };