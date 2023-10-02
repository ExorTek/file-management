const {FOLDER_MODEL_NAME, ADMIN_MODEL_NAME} = process.env;
const mongoose = require('mongoose');
mongoose.pluralize(null);
const Schema = mongoose.Schema;

const FoldersSchema = new Schema({
    name: {type: String, required: [true, 'Folder Name is required!'], unique: true},
    creator: {type: Schema.Types.ObjectId, required: [true, 'Creator is required!'], ref: ADMIN_MODEL_NAME,},
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},
}, {
    strict: false,
    versionKey: false,
});
module.exports = mongoose.model(FOLDER_MODEL_NAME, FoldersSchema);
