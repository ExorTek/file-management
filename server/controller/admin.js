const asyncHandler = require("express-async-handler");
const Admin = require('../model/Admin');
const Folder = require('../model/Folder');
const argon2 = require('argon2');
const CustomError = require("../helper/error/CustomError");
const {sendJwtToClient} = require("../helper/auth");

const register = asyncHandler(async (req, res) => {
    const {name, surname, username, email, status, password, accessFolders} = req.body;
    const hashedPassword = await argon2.hash(password);
    const admin = new Admin({
        name,
        surname,
        username,
        email,
        status,
        password: hashedPassword,
        accessFolders
    });
    await admin.save();
    res.status(200).json({
        success: true,
        message: "Admin created successfully"
    });
});

const login = asyncHandler(async (req, res, next) => {
    const {password, username} = req.body;
    const admin = await Admin.findOne({$or: [{username: username}, {email: username}]});
    if (!admin) return next(new CustomError('Please check your credentials!', 400));
    const isMatch = await argon2.verify(admin.password, password);
    if (!isMatch) return next(new CustomError('Please check your credentials!', 400));
    sendJwtToClient(admin._id, req, res);
});

const changePassword = asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) return next(new CustomError('Please check your credentials!', 400));
    if (newPassword !== confirmPassword) return next(new CustomError('Please check your credentials!', 400));
    const admin = await Admin.findById(req.user._id);
    const isMatch = await argon2.verify(admin.password, oldPassword);
    if (!isMatch) return next(new CustomError('Please check your credentials!', 400));
    admin.password = await argon2.hash(newPassword);
    await admin.save();
    sendJwtToClient(admin._id, req, res);
});

const sendLoggedInUser = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.user._id).select('-password');
    res.status(200).json({
        success: true,
        data: admin
    });
});
const createUser = asyncHandler(async (req, res, next) => {
    const {name, surname, username, email, status, password, role, accessFolders} = req.body;
    const hashedPassword = await argon2.hash(password);
    const admin = new Admin({
        name,
        surname,
        username,
        email,
        status,
        password: hashedPassword,
        role,
        accessFolders
    });
    await admin.save();
    delete admin.password;
    res.status(200).json({
        success: true,
        message: "Admin created successfully",
    });
});
const updateUser = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            ...req.body,
            updatedAt: Date.now()
        },
    }, {upsert: true, new: true});
    res.status(200).json({
        success: true,
        data: admin
    });
});
const getUsers = asyncHandler(async (req, res, next) => {
    const admins = await Admin.find().select('-password').populate('accessFolders');
    res.status(200).json({
        success: true,
        data: admins
    });
});
const getUserDoesntAccessFolders = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const folders = await Folder.find({}).select({
        _id: 1,
        name: 1
    })
    if (id == 'new') return res.status(200).json({
        success: true,
        data: folders
    });
    const {accessFolders} = await Admin.findById(id).select({
        accessFolders: 1,
        _id: 0
    });

    const foldersDoesntAccess = folders.filter(folder => !accessFolders.includes(folder._id));
    const foldersAccess = folders.filter(folder => accessFolders.includes(folder._id));
    res.status(200).json({
        success: true,
        data: {
            access: foldersAccess,
            doesntAccess: foldersDoesntAccess
        }
    });
});
const getUserById = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id).select('-password');
    res.status(200).json({
        success: true,
        data: admin
    });
});


module.exports = {
    register,
    login,
    changePassword,
    sendLoggedInUser,
    createUser,
    updateUser,
    getUsers,
    getUserById,
    getUserDoesntAccessFolders
}
