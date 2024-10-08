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
exports.changeStatus = exports.deleteTopic = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false
    });
    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lí chủ đề",
        topics: topics
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm mới chủ đề",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("topics_create")) {
        req.body.createdBy = res.locals.account.id;
        const newTopic = new topic_model_1.default(req.body);
        yield newTopic.save();
        req.flash("success", "Tạo mới chủ đề thành công");
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/topics`);
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const topic = yield topic_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (topic) {
            res.render("admin/pages/topics/edit", {
                pageTitle: "Chỉnh sửa chủ đề",
                topic: topic,
            });
        }
        else {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/topics`);
        }
    }
    catch (error) {
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("topics_edit")) {
        try {
            const id = req.params.id;
            req.body.updatedBy = res.locals.account.id;
            yield topic_model_1.default.updateOne({
                _id: id,
                deleted: false
            }, req.body);
            req.flash("success", "Cập nhật chủ đề thành công!");
        }
        catch (error) {
            req.flash("error", "Id ca sĩ không hợp lệ !");
        }
        res.redirect("back");
    }
    else {
        res.send(`403`);
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const topic = yield topic_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (topic) {
            res.render("admin/pages/topics/detail", {
                pageTitle: "Chi tiết chủ đề",
                topic: topic
            });
        }
        else {
            res.redirect(`${system_1.systemConfig.prefixAdmin}/topics`);
        }
    }
    catch (error) {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.detail = detail;
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("topics_delete")) {
        try {
            const id = req.params.id;
            yield topic_model_1.default.deleteOne({
                _id: id
            });
            req.flash('success', 'Đã xóa!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/topics`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.deleteTopic = deleteTopic;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("topics_edit")) {
        try {
            const { id, statusChange } = req.params;
            yield topic_model_1.default.updateOne({
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
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/topics`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.changeStatus = changeStatus;
