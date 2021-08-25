module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    ADDRESS_DEFAULT_SETTING_SUCCESS: { "isSuccess": true, "code": 1001, "message":"배달 주소가 변경되었습니다" },
    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_USERNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"이름을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    SIGNUP_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2019, "message": "핸드폰 번호를 입력해주세요" },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2020, "message": "비밀번호를 입력해주세요" },
    STORE_KEYWORD_EMPTY : { "isSuccess": false, "code": 2021, "message": "키워드를 입력해주세요" },
    SIGNUP_ADDRESS_EMPTY : { "isSuccess": false, "code": 2022, "message": "주소를 등록해주세요" },
    SIGNUP_ADDRESS_DETAIL_EMPTY : { "isSuccess": false, "code": 2023, "message": "상세주소를 등록해주세요" },
    ADDRESS_CATEGORY_EMPTY : { "isSuccess": false, "code": 2024, "message": "주소의 구분을 입력해주세요" },
    ADDRESS_DEFAULT_EMPTY : { "isSuccess": false, "code": 2025, "message": "기본 주소지로 설정할 주소를 선택해주세요" },
    STORE_CATEGORY_EMPTY: { "isSuccess": false, "code": 2026, "message": "카테고리를 선택해주세요" },
    SIGNIN_LATITUDE_EMPTY: { "isSuccess": false, "code": 2027, "message": "위도를 넣어주세요" },
    SIGNIN_LONGITUDE_EMPTY: { "isSuccess": false, "code": 2028, "message": "경도를 넣어주세요" },
    SIGNIN_TYPE_EMPTY: { "isSuccess": false, "code": 2029, "message": "타입을 입력주세요" },
    SIGNIN_TYPE_WRONG: { "isSuccess": false, "code": 2030, "message": "잘못된 타입을 입력하였습니다" },
    SIGNIN_BOOKMARK_STORE_EMPTY: { "isSuccess": false, "code": 2031, "message": "즐겨찾기에 추가할 매장ID를 입력해주세요" },
    USER_BOOKMARK_EXIST: { "isSuccess": false, "code": 2032, "message": "이미 즐겨찾기 등록된 매장입니다" },
    SIGNIN_COUPONID_EMPTY: { "isSuccess": false, "code": 2033, "message": "등록할 쿠폰 ID를 입력해주세요" },
    SIGNIN_STOREID_EMPTY: { "isSuccess": false, "code": 2034, "message": "조회할 매장을 입력해주세요" },
    SIGNIN_MENUID_EMPTY: { "isSuccess": false, "code": 2035, "message": "카트에 담을 메뉴를 입력해주세요" },
    SIGNIN_MENUCATEGORYID_EMPTY: { "isSuccess": false, "code": 2036, "message": "카트에 담을 메뉴의 추가 옵션 카테고리를 입력해주세요" },
    SIGNIN_MENUDETAILID_EMPTY: { "isSuccess": false, "code": 2037, "message": "카트에 담을 메뉴의 추가옵션을 입력해주세요" },
    STORE_NOT_ACTIVE: { "isSuccess": false, "code": 2038, "message": "매장 영업시간이 아닙니다" },
    NOT_SAME_STORE_IN_CART: { "isSuccess": false, "code": 2039, "message": "이미 카트에 담겨있는 주문정보 매장과 동일하지 않습니다" },
    SIGNIN_REVIEWID_EMPTY: { "isSuccess": false, "code": 2040, "message": "도움여부를 증가시킬 리뷰를 선택해주세요" },
    SIGNIN_ORDERID_EMPTY: { "isSuccess": false, "code": 2041, "message": "리뷰를 작성할 주문내역을 선택해주세요" },
    SIGNIN_STARVALUE_EMPTY: { "isSuccess": false, "code": 2042, "message": "별점을 입력해주세요" },
    UPDATE_REVIEWID_EMPTY: { "isSuccess": false, "code": 2043, "message": "수정할 리뷰를 선택해주세요" },
    SIGNIN_CARDID_EMPTY: { "isSuccess": false, "code": 2044, "message": "삭제할 카드를 선택해주세요" },
    SIGNIN_ORDERID_FOR_GET_REVIEW_EMPTY: { "isSuccess": false, "code": 2045, "message": "리뷰를 조회할 주문번호를 선택해주세요" },
    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_COUPON_EXIST : { "isSuccess": false, "code": 3007, "message": "이미 등록 된 쿠폰입니다." },
    ALREADY_HELP_REVIEW_CHECK : { "isSuccess": false, "code": 3008, "message": "이미 도움 여부를 증가시켰습니다." },
    ORDERID_AND_USERID_DO_NOT_MATCH : { "isSuccess": false, "code": 3008, "message": "UserID와 OrderID가 일치하지 않습니다." },
    REVIEW_EXIST : { "isSuccess": false, "code": 3009, "message": "이미 리뷰를 작성한 주문입니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
