const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../../helper/aws/s3');
const CustomError = require("../../helper/error/CustomError");
const {AWS_BUCKET_NAME} = process.env;

const s3Storage = multer({
    storage: multerS3({
        s3,
        bucket: AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const {fileName, folderName} = req.query;
            if (!fileName || !folderName) return cb(new CustomError('Please provide a valid file name and folder name!', 400), false);
            const extension = file.mimetype.split('/')[1];
            const name = `${folderName}/${fileName}.${extension}`;
            cb(null, name)
        }
    })
});
const fileFilter = (req, file, callback) => {
    const allowedTypes = ['image/vnd.microsoft.icon', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/bmp', 'image/png', 'image/webp', 'video/mp4', 'video/mpeg', 'video/webm'];
    if (!allowedTypes.includes(file.mimetype)) return callback(new CustomError('Please provide a valid file!', 400), false);
    return callback(null, true);
}
const fileUpload = multer({storage: s3Storage.storage, fileFilter}).single('file');
module.exports = fileUpload;
