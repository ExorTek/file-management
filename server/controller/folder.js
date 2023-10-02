const asyncHandler = require("express-async-handler");
const Folder = require('../model/Folder')
const Admin = require('../model/Admin')
const creatorPopulate = {
    path: 'creator',
    select: '_id name surname username status role email'
};
const createFolder = asyncHandler(async (req, res, next) => {
    const {name} = req.body;
    const folder = new Folder({
        name,
        creator: req.user._id,
    });
    await folder.save();
    const superAdmin = await Admin.find({role: 'superadmin'});
    for (const superAdminElement of superAdmin) {
        superAdminElement.accessFolders.push(folder._id);
        superAdminElement.save();
    }
    res.status(200).json({
        success: true,
        data: folder
    });
});
const getFoldersByCreator = asyncHandler(async (req, res, next) => {
    const folders = await Folder.find({creator: req.user._id}).populate(creatorPopulate);
    res.status(200).json({
        success: true,
        data: folders
    });
});
const updateFolder = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findByIdAndUpdate(req.params.id, {
        ...req.body,
    }, {new: true});
    res.status(200).json({
        success: true,
        data: folder
    });
});

const deleteFolder = asyncHandler(async (req, res, next) => {
    await Folder.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Folder deleted successfully"
    });
});

const getFolders = asyncHandler(async (req, res, next) => {
    const folders = await Folder.find().populate(creatorPopulate);
    res.status(200).json({
        success: true,
        data: folders
    });
});

const getFoldersByAccess = asyncHandler(async (req, res, next) => {
    const {accessFolders} = req.user
    const folders = await Folder.find({_id: {$in: accessFolders}});
    res.status(200).json({
        success: true,
        data: folders
    });
});

module.exports = {
    createFolder,
    getFoldersByCreator,
    updateFolder,
    deleteFolder,
    getFolders,
    getFoldersByAccess
};
