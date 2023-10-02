const CustomError = require("../../helper/error/CustomError");
const jwt = require("jsonwebtoken");
const Admin = require("../../model/Admin");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helper/auth");
const {JWT_PRIVATE_KEY} = process.env;

const getAccessToRoute = (req, res, next) => {
    if (isTokenIncluded(req)) {
        const accessToken = getAccessTokenFromHeader(req);
        jwt.verify(accessToken, JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) return next(new CustomError('Unauthorized!', 401));
            if (decoded.ip !== req.connection.remoteAddress) return next(new CustomError('Unauthorized!', 401));
            const admin = await Admin.findById(decoded.sub);
            if (!admin) return next(new CustomError('Unauthorized!', 401));
            if (admin.status !== 'active') return next(new CustomError('Unauthorized!', 401));
            req.user = admin;
            next();
        });
    } else {
        return next(new CustomError('Unauthorized!', 401));
    }
};
const getSuperAdminAccess = (req, res, next) => {
    const {role} = req.user;
    if (role !== 'superadmin') return next(new CustomError('You are not authorized to access this route!', 403));
    next();
};
const getAdminAccess = (req, res, next) => {
    const {role} = req.user;
    if (role !== 'admin' && role !== 'superadmin') return next(new CustomError('You are not authorized to access this route!', 403));
    next();
};
const getAccessToFolders = async (req, res, next) => {
    const {accessFolders} = req.user;
    const {folderId} = req.query;
    if (!folderId) return next(new CustomError('Folder id is require!', 400));
    if (accessFolders.includes(folderId)) return next();
    return next(new CustomError('You are not authorized to access this folder!', 403));
};
module.exports = {
    getAccessToRoute,
    getSuperAdminAccess,
    getAccessToFolders,
    getAdminAccess
}
