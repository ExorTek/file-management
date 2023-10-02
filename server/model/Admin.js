const {ADMIN_MODEL_NAME,  FOLDER_MODEL_NAME} = process.env;
const mongoose = require('mongoose');
mongoose.pluralize(null);
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {type: String, required: [true, 'Name is required!'],},
    surname: {type: String, required: [true, 'Surname is required!'],},
    username: {type: String, unique: true, required: [true, 'Username is required!'],},
    email: {type: String, unique: true, required: [true, 'Email is required!'],},
    status: {type: String, enum: ['active', 'passive', 'banned', 'deleted'], default: 'active',},
    password: {type: String, required: [true, 'Password is required!'],},
    role: {type: String, enum: ['superadmin', 'admin', 'user'], default: 'user',},
    accessFolders: [{type: Schema.Types.ObjectId, ref: FOLDER_MODEL_NAME, default: [],}],
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},
}, {
    strict: true,
    versionKey: false,
});
module.exports = mongoose.model(ADMIN_MODEL_NAME, AdminSchema);
