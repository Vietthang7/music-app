"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const likeSongSchema = new mongoose_1.default.Schema({
    userId: String,
    songId: String
}, {
    timestamps: true,
});
const LikeSong = mongoose_1.default.model("LikeSong", likeSongSchema, "likes");
exports.default = LikeSong;
