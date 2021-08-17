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
        INSERT INTO AddressInfo(userId, addressLine, detailAddressLine, infoAddress, category)
        VALUES (?, ?, ?, ?, ?);
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
async function SetdefaultAddress(connection, userId){
  const defaultAddressSettingQuery=`
  update AddressInfo
  set isDefault = 0
  where userId = ?;
  `;
  const [SetdefaultAddressRows] = await connection.query(defaultAddressSettingQuery, userId);
  return SetdefaultAddressRows;
}

// 기본 배송지 설정
async function SettingdefaultAddress(connection, updateUserAddressParams){
  const defaultAddressSettingQuery=`
  update AddressInfo
  set isDefault = 1
  where userId = ? and addressIdx = ?;
  `;
  const [SetdefaultAddressRows] = await connection.query(defaultAddressSettingQuery, updateUserAddressParams);
  return SetdefaultAddressRows;
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
  SetdefaultAddress,
  SettingdefaultAddress
};
