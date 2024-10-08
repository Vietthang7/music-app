"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatus = exports.deleteSong = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const moment_1 = __importDefault(require("moment"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield song_model_1.default.find({
        deleted: false
    });
    for (const item of songs) {
        const singerInfo = yield singer_model_1.default.findOne({
            _id: item.singerId,
            deleted: false,
            status: "active"
        }).select("fullName");
        if (singerInfo) {
            item["singerFullName"] = singerInfo["fullName"];
        }
        else {
            item["singerFullName"] = "Chưa có thông tin";
        }
        const topicInfo = yield topic_model_1.default.findOne({
            _id: item.topicId,
            deleted: false,
            status: "active"
        }).select("title");
        if (topicInfo) {
            item["topic"] = singerInfo["topic"];
        }
        else {
            item["topic"] = "Chưa có thông tin";
        }
        if (item["createdAt"]) {
            const formattedDate = (0, moment_1.default)(item["createdAt"]).format("DD/MM/YY HH:mm:ss");
            item["formattedCreatedAt"] = formattedDate;
        }
        if (item["updatedAt"]) {
            const formattedDate = (0, moment_1.default)(item["updatedAt"]).format("DD/MM/YY HH:mm:ss");
            item["formattedUpdatedAt"] = formattedDate;
        }
    }
    res.render("admin/pages/songs/index", {
        pageTitle: "Quản lí bài hát",
        songs: songs
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false
    });
    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        topics: topics,
        singers: singers
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        req.body.audio = req.body.audio[0];
    }
    const song = new song_model_1.default(req.body);
    yield song.save();
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    const topics = yield topic_model_1.default.find({
        deleted: false
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false
    }).select("fullName");
    res.render("admin/pages/songs/edit", {
        pageTitle: "Chính sửa bài hát",
        topics: topics,
        singers: singers,
        song: song
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        req.body.audio = req.body.audio[0];
    }
    yield song_model_1.default.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash('success', 'Cập nhật bài hát thành công!');
    res.redirect(`back`);
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield song_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (song) {
            const topic = yield topic_model_1.default.findOne({
                _id: song.topicId,
                deleted: false
            }).select("title");
            res.render("admin/pages/songs/detail", {
                pageTitle: "Chi tiết bài hát",
                song: song,
                topic: topic
            });
        }
        else {
            res.redirect(`${system_1.systemConfig.prefixAdmin}/songs`);
        }
    }
    catch (error) {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.detail = detail;
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_delete")) {
        try {
            const id = req.params.id;
            yield song_model_1.default.deleteOne({
                _id: id
            });
            req.flash('success', 'Đã xóa!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.deleteSong = deleteSong;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_edit")) {
        try {
            const { id, statusChange } = req.params;
            yield song_model_1.default.updateOne({
                _id: id
            }, {
                status: statusChange
            });
            req.flash('success', 'Cập nhật trạng thái thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.changeStatus = changeStatus;
