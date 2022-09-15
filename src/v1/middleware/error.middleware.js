const logger = require('../utils/logger.util');
const handleError = (err, req, res, next) => {
    logger.error(err.message);
    res.status(400).json({
        code: 400,
        msg: 'Lỗi không xác định.',
    });
};
module.exports = handleError;
