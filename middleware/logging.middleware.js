const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip
  });
  next();
};

module.exports = requestLogger;