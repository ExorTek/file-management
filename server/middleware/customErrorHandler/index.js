const CustomError = require("../../helper/error/CustomError");
const customErrorHandler = (error, req, res, next) => {
    let customError = error;
    if (process.env.NODE_ENV === 'development') console.log(error);
    if (error.code === 'LIMIT_UNEXPECTED_FILE') customError = new CustomError('You cannot upload more than the file upload limit!', 400);
    if (error.name === 'SyntaxError') customError = new CustomError("SYNTAX_ERR", 400);
    if (error.name === 'TypeError') customError = new CustomError("Type Error!", 400);
    if (error.name === 'CastError') customError = new CustomError("Cast Error", 400);
    if (error.code === 11000) {
        if (error.keyValue) {
            let key = Object.keys(error.keyValue)[0];
            if (key) {
                key = key.charAt(0).toUpperCase() + key.slice(1);
                customError = new CustomError(`${key} already exists!`, 400);
            } else customError = new CustomError("Duplicate key error! Please Enter unique key.", 400);
        } else {
            let splittedMessage = error.message.split(':')[3]?.split(' ')[2];
            if (splittedMessage) {
                splittedMessage = splittedMessage.charAt(0).toUpperCase() + splittedMessage.slice(1);
                customError = new CustomError(`${splittedMessage} already exist!`, 400);
            } else customError = new CustomError("Duplicate key error! Please Enter unique key.", 400);
        }
    }
    if (error.code === 66) customError = new CustomError("Performing an update on the path '_id' would modify the immutable field '_id'", 400);
    if (error.name === 'ValidationError') {
        let splitted = error.message.split(":")
        if (splitted && splitted[3]) customError = new CustomError((error.message.split(":")[2] || "").split(",")
            [(error.message.split(":")[2] || "").split(",").length - 2].trim(), 400);
        else customError = new CustomError((error.message.split(":")[2] || "").split(",")
            [(error.message.split(":")[2] || "").split(",").length - 1].trim(), 400);
    }
    res.status(customError.status || 500).json({
        success: false,
        status: customError.status || 500,
        message: customError.message,
        path: req.originalUrl,
        method: req.method,
        timeStamp: new Date().toISOString()
    });
};
module.exports = customErrorHandler;
