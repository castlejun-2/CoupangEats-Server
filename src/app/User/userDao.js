// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, userName 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, userName 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, userName 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, userName, phoneNumber)
        VALUES (?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 유저 IDX 체크
async function selectUserIdx(connection, userId) {
  const userIdxQuery = `
    select exists(select userIdx from UserInfo where userIdx = ? and status = 'ACTIVE') as exist;
     `;
  const [userIdxRow] = await connection.query(userIdxQuery, userId);
  return userIdxRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, userName, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, userIdx
        FROM UserInfo 
        WHERE email = ?;`;
  const setUserLoginQuery = `
        UPDATE UserInfo
        SET isLogin = 1
        WHERE email = ?;`;      
  const selectUserAccountRow = await connection.query(selectUserAccountQuery, email);
  const setUserLoginRow = await connection.query(setUserLoginQuery, email);
  return selectUserAccountRow[0];
}

// 로그아웃
async function userLogout(connection, userId) {
  const logoutQuery = `
      UPDATE UserInfo
      SET isLogin = 0
      WHERE userIdx = ?;
  `;
  const logoutRow = await connection.query(logoutQuery, userId);
  return logoutRow[0];
}

async function updateUserInfo(connection, id, userName) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET userName = ?
  WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [userName, id]);
  return updateUserRow[0];
}

// 주소지 추가
async function insertUserAddress(connection, insertUserAddressParams) {
  const insertUserAddressInfoQuery = `
        INSERT INTO AddressInfo(userId, addressLine, detailAddressLine, infoAddress, latitude, longitude, category)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
  const insertUserAddressInfoRow = await connection.query(
    insertUserAddressInfoQuery,
    insertUserAddressParams
  );

  return insertUserAddressInfoRow;
}

// 상세주소 변경
async function updateUserAddress(connection, updateUserAddressParams) {
  const updateUserDetailAddressQuery = `
        UPDATE AddressInfo
        SET detailAddressLine = ?, infoAddress = ?
        WHERE userId = ? and category = ?;
    `;
  const updateUserDetailAddressRow = await connection.query(
    updateUserDetailAddressQuery,
    updateUserAddressParams
  );

  return updateUserDetailAddressRow;
}

// 기본 배송지 설정전 세팅
async function setdefaultAddress(connection, userId){
  const defaultAddressSettingQuery=`
  update AddressInfo
  set isDefault = 0
  where userId = ?;
  `;
  const [SetdefaultAddressRows] = await connection.query(defaultAddressSettingQuery, userId);
  return SetdefaultAddressRows;
}

// 기본 배송지 설정
async function settingdefaultAddress(connection, updateUserAddressParams){
  const defaultAddressSettingQuery=`
  update AddressInfo
  set isDefault = 1
  where userId = ? and addressIdx = ?;
  `;
  const [SetdefaultAddressRows] = await connection.query(defaultAddressSettingQuery, updateUserAddressParams);
  return SetdefaultAddressRows;
}

// 유저 북마크 체크
async function selectUserBookMarkCheck(connection, userId, storeId) {
  const userBookMarkQuery = `
  select exists(select userId from UserBookmarkInfo where userId = ? and storeId = ? and status = 'ACTIVE') as exist;
     `;
  const [userIdxRow] = await connection.query(userBookMarkQuery, [userId, storeId]);
  return userIdxRow;
}

// 사용자 매장 즐겨찾기 삭제
async function deleteBookMark(connection, AddUserBookMarkParams) {
  const deleteBookMarkQuery = `
        UPDATE UserBookmarkInfo
        SET status = 'DELETE'
        WHERE userId = ? and storeId = ?;
    `;
  const deleteBookMarkRow = await connection.query(
    deleteBookMarkQuery,
    AddUserBookMarkParams
  );

  return deleteBookMarkRow;
}

// 사용자 매장 즐겨찾기 추가
async function postBookMark(connection, AddUserBookMarkParams) {
  const postBookMarkQuery = `
        INSERT INTO UserBookmarkInfo(userId, storeId)
        VALUES (?, ?);
    `;
  const postBookMarkRow = await connection.query(
    postBookMarkQuery,
    AddUserBookMarkParams
  );

  return postBookMarkRow;
}

// 즐겨찾기 매장 갯수 조회
async function selectUserBookMarkCount(connection, userId){
  const defaultAddressSettingQuery=`
  SELECT  concat(count(*),'개') as '즐겨찾는 매장 수'
  FROM UserInfo ui join UserBookmarkInfo ubi on ui.userIdx = ubi.userId
  WHERE ui.userIdx = ? and ubi.status = 'ACTIVE';
  `;
  const [BookMarkCountRows] = await connection.query(defaultAddressSettingQuery, userId);
  return BookMarkCountRows;
}

// 최근 추가한 순 즐겨찾기 조회
async function selectUserBookMarkByRecent(connection, userId){
  const getBookMarkQuery=`
  SELECT 	image.url as '가게 사진',
		      storeName as '가게 이름',
		      case when isCheetah = 1 then '치타배달' end as '치타배달',
		      rv.star as '평균 평점',
          rv.cnt as '리뷰 갯수',
          concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
          averageDelivery as '평균 배달시간',
          case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
        case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
FROM StoreInfo si left join
	 (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
	 From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
		  join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserBookmarkInfo ubi on ubi.storeId=si.storeIdx
         join UserInfo ui on ui.userIdx=ubi.userId
         join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
WHERE ui.userIdx = ? and ubi.status = 'ACTIVE'
ORDER BY ubi.createdAt DESC;    
  `;
  const [getBookMarkRows] = await connection.query(getBookMarkQuery, userId);
  return getBookMarkRows;
}

// 최근 주문한 순 즐겨찾기 조회
async function selectUserBookMarkByOrder(connection, userId){
  const getBookMarkQuery=`
  SELECT 	image.url as '가게 사진',
		      storeName as '가게 이름',
		      case when isCheetah = 1 then '치타배달' end as '치타배달',
		      rv.star as '평균 평점',
          rv.cnt as '리뷰 갯수',
          concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
          averageDelivery as '평균 배달시간',
          case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
        case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
FROM StoreInfo si left join
	 (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
	 From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
		  join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserBookmarkInfo ubi on ubi.storeId=si.storeIdx
         join UserInfo ui on ui.userIdx=ubi.userId
         join (select userId,storeID,oi.createdAt as ca from OrderInfo oi join UserInfo ui on ui.userIdx=oi.userId group by oi.storeId) ooi on ooi.storeId=si.storeIdx
         join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
WHERE ui.userIdx = ? and ubi.status = 'ACTIVE'
ORDER BY ooi.ca DESC;
  `;
  const [getBookMarkRows] = await connection.query(getBookMarkQuery, userId);
  return getBookMarkRows;
}

// 많이 주문한 순 즐겨찾기 조회
async function selectUserBookMarkByMany(connection, userId){
  const getBookMarkQuery=`
  SELECT 	image.url as '가게 사진',
		      storeName as '가게 이름',
		      case when isCheetah = 1 then '치타배달' end as '치타배달',
		      rv.star as '평균 평점',
          rv.cnt as '리뷰 갯수',
          concat(format((6371*acos(cos(radians(ad.latitude))*cos(radians(si.latitude))*cos(radians(si.longitude)-radians(ad.longitude))+sin(radians(ad.latitude))*sin(radians(si.latitude)))),1),'km') AS '거리',
          averageDelivery as '평균 배달시간',
          case when dti.deliveryTip = 0 then '무료배달' else concat(format(dti.deliveryTip,0),'원') end as '배달팁',
        case when si.status = 'ACTIVE' then '주문가능' else '준비중' end as '가게상태'
FROM StoreInfo si left join
	 (Select count(*) as cnt, round(avg(starValue),1) as star, mui.storeId as sti
	 From ReviewInfo ri join OrderInfo oi on oi.orderIdx=ri.orderId
		  join MenuInfo mui on oi.menuId = mui.menuIdx where oi.status = 'ACTIVE' group by sti) rv on rv.sti = si.storeIdx join
         (select mu.storeId as imagesi, GROUP_CONCAT( mu.menuImageUrl SEPARATOR ',') AS 'url'
          from StoreInfo si join
         (select miu.menuImageUrl,mi.storeId
          from MenuImageUrl miu join MenuInfo mi where mi.menuIdx=miu.menuId and isMain=1) mu on mu.storeId=si.storeIdx
          group by mu.storeId ) image on image.imagesi=si.storeIdx
         join DeliveryTipInfo dti on si.storeIdx=dti.storeId
         join UserBookmarkInfo ubi on ubi.storeId=si.storeIdx
         join UserInfo ui on ui.userIdx=ubi.userId
         join (select userId,storeID,count(storeId) as cs from OrderInfo oi join UserInfo ui on ui.userIdx=oi.userId group by oi.storeId) ooi on ooi.storeId=si.storeIdx
         join (select latitude,longitude,userId from AddressInfo where isDefault=1) ad on ad.userId=ui.userIdx
WHERE ui.userIdx = ? and ubi.status = 'ACTIVE'
ORDER BY ooi.cs DESC;
  `;
  const [getBookMarkRows] = await connection.query(getBookMarkQuery, userId);
  return getBookMarkRows;
}

// 사용자가 등록한 쿠폰 조회 
async function selectUserCoupon(connection, userId){
  const getUserCouponQuery=`
          SELECT ci.couponName as '쿠폰 이름',
                 format(ci.salePrice,0) as '할인 가격',
                 format(ci.limitOrderPrice,0) as '최소 주문 가격',
                 date_format(date_add(ci.createdAt, INTERVAL 7 DAY), '%m/%d') as '유효기간'
          FROM CouponInfo ci join UserCouponInfo uci on ci.couponIdx = uci.couponId
          WHERE uci.userId = ? and uci.status = 'ACTIVE';
  `;
  const [getCouponRows] = await connection.query(getUserCouponQuery, userId);
  return getCouponRows;
}

// 유저 쿠폰 체크
async function selectUserCouponCheck(connection, userId, couponId) {
  const userCouponQuery = `
      select exists(select userId from UserCouponInfo where userId = ? and couponId = ? and status = 'ACTIVE') as exist;
     `;
  const [CouponRow] = await connection.query(userCouponQuery, [userId, couponId]);
  return CouponRow;
}

// 사용자 쿠폰 등록
async function postCoupon(connection, AddUserCouponParams) {
  const postCouponQuery = `
        INSERT INTO UserCouponInfo(userId, couponId)
        VALUES (?, ?);
    `;
  const postBookCoupon = await connection.query(
    postCouponQuery,
    AddUserCouponParams
  );

  return postBookCoupon;
}
module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserIdx,
  selectUserPassword,
  selectUserAccount,
  userLogout,
  updateUserInfo,
  insertUserAddress,
  updateUserAddress,
  setdefaultAddress,
  settingdefaultAddress,
  selectUserBookMarkByRecent,
  selectUserBookMarkByOrder,
  selectUserBookMarkByMany,
  selectUserBookMarkCount,
  selectUserBookMarkCheck,
  postBookMark,
  deleteBookMark,
  selectUserCoupon,
  postCoupon,
  selectUserCouponCheck,
};
