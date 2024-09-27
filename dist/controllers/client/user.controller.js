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
exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_helper_1 = require("../../helpers/generate.helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí tài khoản"
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existUser) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }
    if (req.body.password != req.body.confirmpassword) {
        req.flash("error", "Mật khẩu không khớp");
        res.redirect("back");
        return;
    }
    const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: (0, md5_1.default)(req.body.password),
        tokenUser: (0, generate_helper_1.generateRandomString)(30),
    };
    const user = new user_model_1.default(userData);
    yield user.save();
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng kí tài khoản thành công");
    res.redirect("/");
});
exports.registerPost = registerPost;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if ((0, md5_1.default)(req.body.password) != user.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }
    if (user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect("back");
        return;
    }
    const expires = 3 * 24 * 60 * 60 * 1000;
    res.cookie("tokenUser", user.tokenUser, {
        expires: new Date(Date.now() + expires)
    });
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
});
exports.logout = logout;
