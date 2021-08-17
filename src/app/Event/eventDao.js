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

module.exports = {
    selectEvent
};