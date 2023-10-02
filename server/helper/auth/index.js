const jwt = require('jsonwebtoken');
const {JWT_EXPIRE, JWT_PRIVATE_KEY} = process.env;
const sendJwtToClient = (id, req, res) => {
    const payload = {
        sub: id,
        ip: req.connection.remoteAddress,
    }
    const options = {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRE,

    };
    const token = jwt.sign(
        payload,
        JWT_PRIVATE_KEY,
        options
    )
    res.status(200).json({
        success: true,
        token: token,
        status: 200,
        message: 'Login Successful!',
        path: req.originalUrl,
        timeStamp: new Date().toISOString()
    });
};
const isTokenIncluded = (req) => req.headers.authorization && req.headers.authorization.startsWith('Bearer');
const getAccessTokenFromHeader = (req) => req.headers.authorization.split(' ')[1];




module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader,
};
