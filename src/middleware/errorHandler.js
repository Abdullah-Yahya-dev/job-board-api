const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message}: ${err.stack}`);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // 🔴 1. CastError (Invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // 🔴 2. ValidationError (Mongoose schema validation)
    if (err.name === 'ValidationError') {
        statusCode = 400;

        // extract all error messages
        const errors = Object.values(err.errors).map(val => val.message);

        message = errors.join(', ');
    }

    // 🔴 3. Duplicate Key Error (MongoDB code 11000)
    if (err.code === 11000) {
        statusCode = 400;

        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];

        message = `${field} already exists: ${value}`;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;