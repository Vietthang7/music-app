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
exports.deleteItem = exports.detail = exports.editPatch = exports.edit = exports.permissionsPatch = exports.permissions = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const system_1 = require("../../config/system");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const moment_1 = __importDefault(require("moment"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield role_model_1.default.find({
        deleted: false
    });
    for (const record of records) {
        if (record.createdBy) {
            const accountCreated = yield accounts_model_1.default.findOne({
                _id: record.createdBy
            });
            record["createdByFullName"] = accountCreated.fullName;
        }
        else {
            record["createdByFullName"] = "";
        }
        record["createdAtFormat"] = (0, moment_1.default)(record.createdAt).format("DD/MM/YY HH:mm:ss");
        if (record.updatedBy) {
            const accountUpdated = yield accounts_model_1.default.findOne({
                _id: record.updatedBy
            });
            record["updatedByFullName"] = accountUpdated.fullName;
        }
        else {
            record["updatedByFullName"] = "";
        }
        record["updatedAtFormat"] = (0, moment_1.default)(record.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo mới nhóm quyền",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_create")) {
        req.body.createdBy = res.locals.account.id;
        const records = new role_model_1.default(req.body);
        yield records.save();
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
    }
    else {
        res.send(`403`);
    }
});
exports.createPost = createPost;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield role_model_1.default.find({
        deleted: false
    });
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_permissions")) {
        const roles = req.body;
        for (const role of roles) {
            yield role_model_1.default.updateOne({
                _id: role.id,
                deleted: false
            }, {
                permissions: role.permissions
            });
        }
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    }
    else {
        res.send(`403`);
    }
});
exports.permissionsPatch = permissionsPatch;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const records = yield role_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            records: records
        });
    }
    catch (error) {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/roles`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_edit")) {
        try {
            const id = req.params.id;
            req.body.updatedBy = res.locals.account.id;
            yield role_model_1.default.updateOne({
                _id: id,
                deleted: false
            }, req.body);
            req.flash("success", "Cập nhật thành công!");
            res.redirect("back");
        }
        catch (error) {
            req.flash("error", "Id sản phẩm không hợp lệ !");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const records = yield role_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (records) {
            res.render("admin/pages/roles/detail", {
                pageTitle: "Chi tiết",
                records: records
            });
        }
        else {
            res.redirect(`${system_1.systemConfig.prefixAdmin}/roles`);
        }
    }
    catch (error) {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/roles`);
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_delete")) {
        try {
            const id = req.params.id;
            yield role_model_1.default.deleteOne({
                _id: id
            });
            req.flash('success', 'Đã xóa!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.deleteItem = deleteItem;
