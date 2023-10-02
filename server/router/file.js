const router = require('express').Router();
const fileUpload = require("../middleware/file");
const {
    uploadFile,
    getFilesByCreator,
    getFiles,
    getFile,
    deleteFile,
    getFileByCreator,
    checkFileName,
    getBucketSize,
    getBucketTotalObjects
} = require("../controller/file");
const {getAccessToRoute, getSuperAdminAccess} = require("../middleware/auth");

router.use(getAccessToRoute);
router.post('/upload', fileUpload, uploadFile);
router.get('/creator', getFilesByCreator);
router.get('/creator/:id', getFileByCreator);
router.get('/check/:fileName', checkFileName);
router.get('/', getFiles);
router.get('/bucketSize', getBucketSize);
router.get('/bucketFiles', getBucketTotalObjects);
router.get('/:id', getFile);
router.get('/:id', getFile);
router.delete('/:id', getSuperAdminAccess, deleteFile);

module.exports = router;
