require('express-async-errors')
const winston = require('winston');

module.exports = () => {
    winston.add(new winston.transports.File({filename: "logs/test-app-logs.log"}));
}