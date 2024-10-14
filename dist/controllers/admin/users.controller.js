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
const user_model_1 = __importDefault(require("../../models/user.model"));
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
    const pagination = yield (0, pagination_helper_1.paginationUser)(req, find);
    const users = yield user_model_1.default
        .find(find)
        .limit(pagination.limitItems)
        .skip(pagination["skip"])
        .sort(sort);
    for (const item of users) {
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
    res.render("admin/pages/users/index", {
        pageTitle: "Tài khoản Users",
        users: users,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/users/create", {
        pageTitle: "Tài khoản User",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_create")) {
        const existUserTrash = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: true
        });
        if (existUserTrash) {
            req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
            res.redirect("back");
            return;
        }
        const existUser = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existUser) {
            req.flash("error", "Email đã tồn tại");
            res.redirect("back");
            return;
        }
        req.body.password = (0, md5_1.default)(req.body.password);
        req.body.tokenUser = (0, generate_helper_1.generateRandomString)(30);
        req.body.createdBy = res.locals.account.id;
        const user = new user_model_1.default(req.body);
        yield user.save();
        req.flash("success", "Tạo mới tài khoản thành công");
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield user_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (user) {
            res.render("admin/pages/users/edit", {
                pageTitle: "Tài khoản client",
                user: user
            });
        }
        else {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
    catch (error) {
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_edit")) {
        try {
            const id = req.params.id;
            if (req.body.password == "") {
                delete req.body.password;
            }
            else {
                req.body.password = (0, md5_1.default)(req.body.password);
            }
            req.body.updatedBy = res.locals.account.id;
            yield user_model_1.default.updateOne({
                _id: id,
                deleted: false
            }, req.body);
            req.flash("success", "Cập nhật thành công!");
        }
        catch (error) {
            req.flash("error", "Id tài khoản  không hợp lệ!");
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
        const user = yield user_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (user) {
            res.render("admin/pages/users/detail", {
                pageTitle: "Chi tiết tài khoản",
                user: user
            });
        }
        else {
            res.redirect(`${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
    catch (error) {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/users`);
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_delete")) {
        try {
            const id = req.params.id;
            yield user_model_1.default.updateOne({
                _id: id
            }, {
                deleted: true,
                deletedBy: res.locals.account.id
            });
            req.flash('success', 'Đã chuyển vào thùng rác!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.deleteItem = deleteItem;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_edit")) {
        try {
            const { id, statusChange } = req.params;
            yield user_model_1.default.updateOne({
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
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_edit")) {
        try {
            const { status, ids } = req.body;
            switch (status) {
                case "active":
                case "inactive":
                    yield user_model_1.default.updateMany({
                        _id: ids
                    }, {
                        status: status
                    });
                    req.flash('success', 'Cập nhật trạng thái thành công!');
                    break;
                case "delete":
                    yield user_model_1.default.updateMany({
                        _id: ids
                    }, {
                        deleted: true
                    });
                    req.flash('success', 'Đã chuyển vào thùng rác!');
                    break;
                default:
                    break;
            }
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
    else {
        res.send(`403`);
    }
});
exports.changeMulti = changeMulti;
