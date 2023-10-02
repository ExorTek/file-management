const {FILE_MODEL_NAME, ADMIN_MODEL_NAME} = process.env;
const mongoose = require('mongoose');
mongoose.pluralize(null);
const Schema = mongoose.Schema;

const FilesSchema = new Schema({
    name: {type: String,unique: true, required: true},
    originalName: {type: String},
    encoding: {type: String},
    location: {type: String},
    bucket: {type: String},
    mimType: {type: String},
    size: {type: Number},
    key: {type: String},
    creator: {type: Schema.Types.ObjectId, ref: ADMIN_MODEL_NAME,},
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},
}, {
    strict: false,
    versionKey: false,
});
module.exports = mongoose.model(FILE_MODEL_NAME, FilesSchema);
