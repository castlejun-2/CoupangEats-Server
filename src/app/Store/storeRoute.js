module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 3. 가게 검색 API
    app.get('/app/stores',store.getStores); 


};