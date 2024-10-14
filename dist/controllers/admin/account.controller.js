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
exports.changeMulti = exports.changeStatus = exports.deleteItem = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const system_1 = require("../../config/system");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const moment_1 = __importDefault(require("moment"));
const pagination_helper_1 = require("../../helpers/pagination.helper");
const md5_1 = __importDefault(require("md5"));
const generate_helper_1 = require("../../helpers/generate.helper");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    const filterStatus = [{
            label: "Tất cả",
            value: ""
        },
        {
            label: "Đang hoạt động",
            value: "active"
        },
        {
            label: "Dừng hoạt động",
            value: "inactive"
        },
    ];
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    let keyword = "";
    if (req.query.keyword) {
        const regex = new RegExp(`${req.query.keyword}`, "i");
        find["fullName"] = regex;
        keyword = req.query.keyword.toString();
    }
    const sort = {};
    const sortKey = `${req.query.sortKey}`;
    if (sortKey && req.query.sortValue) {
        sort[sortKey] = req.query.sortValue;
    }
    else {
        sort["createdAt"] = "desc";
    }
    const pagination = yield (0, pagination_helper_1.paginationAccount)(req, find);
    const records = yield accounts_model_1.default
        .find(find)
        .limit(pagination.limitItems)
        .skip(pagination["skip"])
        .sort(sort);
    for (const item of records) {
        if (item.createdBy) {
            const accountCreated = yield accounts_model_1.default.findOne({
                _id: item.createdBy
            });
            item["createdByFullName"] = accountCreated.fullName;
        }
        else {
            item["createdAtFormat"] = "";
        }
        item["createdAtFormat"] = (0, moment_1.default)(item.createdAt).format("DD/MM/YY HH:mm:ss");
        if (item.updatedBy) {
            const accountUpdated = yield accounts_model_1.default.findOne({
                _id: item.updatedBy
            });
            item["updatedByFullName"] = accountUpdated.fullName;
        }
        else {
            item["updatedByFullName"] = "";
        }
        item["updatedAtFormat"] = (0, moment_1.default)(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    for (const record of records) {
        const role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false
        });
        record["roleTitle"] = role.title;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Tài khoản admin",
        records: records,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.find({
        deleted: false
    }).select("title");
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tài khoản admin",
        roles: roles
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_create")) {
        const existAccountTrash = yield accounts_model_1.default.findOne({
            email: req.body.email,
            deleted: true
        });
        if (existAccountTrash) {
            req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
            res.redirect("back");
            return;
        }
        const existAccount = yield accounts_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existAccount) {
            req.flash("error", "Email đã tồn tại");
            res.redirect("back");
            return;
        }
        req.body.password = (0, md5_1.default)(req.body.password);
        req.body.token = (0, generate_helper_1.generateRandomString)(30);
        req.body.createdBy = res.locals.account.id;
        const account = new accounts_model_1.default(req.body);
        yield account.save();
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const account = yield accounts_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (account) {
            const roles = yield role_model_1.default.find({
                deleted: false
            }).select("title");
            res.render("admin/pages/accounts/edit", {
                pageTitle: "Tài khoản admin",
                roles: roles,
                account: account
            });
        }
        else {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
    catch (error) {
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const id = req.params.id;
            if (req.body.password == "") {
                delete req.body.password;
            }
            else {
                req.body.password = (0, md5_1.default)(req.body.password);
            }
            req.body.updatedBy = res.locals.account.id;
            yield accounts_model_1.default.updateOne({
                _id: id,
                deleted: false
            }, req.body);
            req.flash("success", "Cập nhật thành công!");
        }
        catch (error) {
            req.flash("error", "Id tài khoản không hợp lệ!");
        }
        res.redirect("back");
    }
    else {
        res.send("403");
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const account = yield accounts_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (account) {
            const role = yield role_model_1.default.findOne({
                _id: account.role_id,
                deleted: false
            });
            res.render("admin/pages/accounts/detail", {
                pageTitle: "Chi tiết tài khoản",
                role: role,
                account: account
            });
        }
        else {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
    catch (error) {
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_delete")) {
        try {
            const id = req.params.id;
            yield accounts_model_1.default.deleteOne({
                _id: id
            });
            req.flash('success', 'Đã xóa!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.deleteItem = deleteItem;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const { id, statusChange } = req.params;
            yield accounts_model_1.default.updateOne({
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
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const { status, ids } = req.body;
            switch (status) {
                case "active":
                case "inactive":
                    yield accounts_model_1.default.updateMany({
                        _id: ids
                    }, {
                        status: status
                    });
                    break;
                case "delete":
                    yield accounts_model_1.default.updateMany({
                        _id: ids
                    }, {
                        deleted: true
                    });
                    break;
                default:
                    break;
            }
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.changeMulti = changeMulti;
