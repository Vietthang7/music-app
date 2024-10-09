"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accountShema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    token: String,
    avatar: String,
    role_id: String,
    status: String,
    createdBy: String,
    updatedBy: String,
    deletedBy: String,
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
const Account = mongoose_1.default.model('Account', accountShema, "accounts");
exports.default = Account;
