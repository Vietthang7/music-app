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
exports.resetPasswordPatch = exports.resetPassword = exports.otpPasswordPost = exports.otpPassword = exports.forgotPasswordPost = exports.forgotPassword = exports.logOut = exports.loginPost = exports.login = void 0;
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const md5_1 = __importDefault(require("md5"));
const system_1 = require("../../config/system");
const generate_helper_1 = require("../../helpers/generate.helper");
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const sendEmail_helper_1 = require("../../helpers/sendEmail.helper");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập"
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const existAccount = yield accounts_model_1.default.findOne({
        email: email,
        deleted: true
    });
    if (existAccount) {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }
    const account = yield accounts_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!account) {
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }
    if ((0, md5_1.default)(password) != account.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }
    if (account.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("token", account.token);
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/dashboard`);
});
exports.loginPost = loginPost;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/login`);
});
exports.logOut = logOut;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/auth/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const account = yield accounts_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!account) {
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }
    if (account.status != "active") {
        req.flash("error", "Tài khoản đã dừng hoạt động!");
        res.redirect("back");
        return;
    }
    const otp = (0, generate_helper_1.generateRandomNumber)(6);
    const forgotPasswordData = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 3 * 60 * 1000
    };
    const forgotPassword = new forgot_password_model_1.default(forgotPasswordData);
    yield forgotPassword.save();
    const subject = "Mã OTP lấy lại mật khẩu.";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style = "color:green;"> ${otp} </b>.Mã OTP có hiệu lực trong 3 phút .Vui lòng không cung cấp mã OTP cho người khác`;
    (0, sendEmail_helper_1.sendMail)(email, subject, htmlSendMail);
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/password/otp?email=${email}`);
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    res.render("admin/pages/auth/otp-password", {
        pageTitle: "Xác thực mật khẩu",
        email: email
    });
});
exports.otpPassword = otpPassword;
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        req.flash("error", "OTP không hợp lệ");
        res.redirect("back");
        return;
    }
    const account = yield accounts_model_1.default.findOne({
        email: email
    });
    res.cookie("token", account.token);
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/password/reset`);
});
exports.otpPasswordPost = otpPasswordPost;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/auth/reset-password", {
        pageTitle: "Đổi lại mật khẩu mới",
    });
});
exports.resetPassword = resetPassword;
const resetPasswordPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password != req.body.confirmpassword) {
        req.flash("error", "Mật khẩu không khớp");
        res.redirect("back");
        return;
    }
    const password = req.body.password;
    const token = req.cookies.token;
    yield accounts_model_1.default.updateOne({
        token: token,
        deleted: false
    }, {
        password: (0, md5_1.default)(password)
    });
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/dashboard`);
});
exports.resetPasswordPatch = resetPasswordPatch;
