const asyncHandler = require("express-async-handler");
const File = require('../model/File');
const CustomError = require("../helper/error/CustomError");
const s3 = require('../helper/aws/s3');
const {DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {pagination} = require("../helper/pagination");
const {GetMetricStatisticsCommand} = require("@aws-sdk/client-cloudwatch");
const cloudWatchClient = require("../helper/aws/cloudWatch");
const bytesToSize = require("../helper/lib/byteToSize");
const creatorPopulate = {
    path: 'creator',
    select: '_id name surname username status role email'
};
const uploadFile = asyncHandler(async (req, res, next) => {
    const {file} = req;
    const savedFile = await File.create({
        name: file.key.split('/').slice(-1)[0].split('.')[0],
        originalName: file.originalname,
        encoding: file.encoding,
        location: file.location,
        bucket: file.bucket,
        mimType: file.mimetype,
        size: file.size,
        key: file.key,
        creator: req.user._id,
    })

    res.status(200).json({
        success: true,
        data: savedFile,
    });
});
const deleteFile = asyncHandler(async (req, res, next) => {
    const file = await File.findById(req.params.id);
    await File.findByIdAndDelete(file._id)
    if (!file) next(new CustomError("File not found!", 404));
    const command = new DeleteObjectCommand({
        Bucket: file.bucket,
        Key: file.key
    })
    await s3.send(command);
    res.status(200).json({
        success: true,
        message: 'File deleted successfully!'
    });
});
const getFiles = asyncHandler(async (req, res, next) => {
    const files = await pagination(File, File.find({}).populate(creatorPopulate), req);
    res.status(200).json({
        success: true,
        data: files
    });
});
const getFile = asyncHandler(async (req, res, next) => {
    const file = await File.findById(req.params.id);
    if (!file) next(new CustomError("File not found", 404));
    res.status(200).json({
        success: true,
        data: file
    });
});
const getFilesByCreator = asyncHandler(async (req, res, next) => {
    const files = await File.find({creator: req.user._id});
    res.status(200).json({
        success: true,
        data: files
    });
});

const getFileByCreator = asyncHandler(async (req, res, next) => {
    const file = await File.findOne({creator: req.user._id, _id: req.params.id});
    if (!file) next(new CustomError("File not found", 404));
    res.status(200).json({
        success: true,
        data: file
    });
});

const checkFileName = asyncHandler(async (req, res, next) => {
    const {fileName} = req.params;
    const file = await File.find({
        name: {
            $regex: fileName
        }
    }).limit(1);
    return res.status(200).json({
        success: true,
        data: !!file.length
    })
});

const getBucketSize = asyncHandler(async (req, res, next) => {
    const command = new GetMetricStatisticsCommand({
        EndTime: new Date(),
        MetricName: 'BucketSizeBytes',
        Namespace: 'AWS/S3',
        Period: 86400,
        StartTime: new Date("2022-01-01"),
        Dimensions: [
            {
                Name: 'BucketName',
                Value: process.env.AWS_BUCKET_NAME
            },
            {
                Name: 'StorageType',
                Value: 'StandardStorage'
            },
        ],
        Statistics: [
            'Sum'
        ],
        Unit: 'Bytes'
    });
    const data = await cloudWatchClient.send(command);
    res.status(200).json({
        success: true,
        data: data.Datapoints.sort((a, b) => a.Timestamp - b.Timestamp).map(item => {
            return {
                time: new Date(item.Timestamp).toDateString(),
                value: bytesToSize(item.Sum)
            }
        })
    });
});
const getBucketTotalObjects = asyncHandler(async (req, res, next) => {
    const command = new GetMetricStatisticsCommand({
        MetricName: 'NumberOfObjects',
        Namespace: 'AWS/S3',
        Period: 86400,
        StartTime: new Date("2022-01-01"),
        EndTime: new Date(),
        Dimensions: [
            {
                Name: 'BucketName',
                Value: process.env.AWS_BUCKET_NAME
            },
            {
                Name: 'StorageType',
                Value: 'AllStorageTypes'
            },
        ],
        Statistics: [
            'Sum'
        ],
        Unit: 'Count'
    });
    const data = await cloudWatchClient.send(command);
    res.status(200).json({
        success: true,
        data: data.Datapoints.sort((a, b) => a.Timestamp - b.Timestamp).map(item => {
            return {
                time: new Date(item.Timestamp).toDateString(),
                value: item.Sum
            }
        })
    });

});
module.exports = {
    uploadFile,
    getFiles,
    getFilesByCreator,
    getFile,
    deleteFile,
    getFileByCreator,
    checkFileName,
    getBucketSize,
    getBucketTotalObjects
}
