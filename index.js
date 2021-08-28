const express = require('./config/express');
const {logger} = require('./config/winston');

let port;

if(process.env.NODE_ENV == 'development'){ //Developmnet Port Number
    port = 3000;
}
else if(process.env.NODE_ENV == 'production'){ //Production Port Number
    port = 3001;
}
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);