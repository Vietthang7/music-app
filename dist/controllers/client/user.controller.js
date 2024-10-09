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
exports.otpPasswordPost = exports.otpPassword = exports.forgotPasswordPost = exports.forgotPassword = exports.resetPasswordPatch = exports.resetPassword = exports.editPasswordPost = exports.editPassword = exports.editPatch = exports.editProfile = exports.profile = exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_helper_1 = require("../../helpers/generate.helper");
const generate_helper_2 = require("../../helpers/generate.helper");
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const sendEmail_helper_1 = require("../../helpers/sendEmail.helper");
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
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã dừng hoạt động!");
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
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/profile", {
        pageTitle: "Thông tin cá nhân"
    });
});
exports.profile = profile;
const editProfile = (reqL, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
});
exports.editProfile = editProfile;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenUser = req.cookies.tokenUser;
        yield user_model_1.default.updateOne({
            tokenUser: tokenUser,
            deleted: false
        }, req.body);
        req.flash("success", "Cập nhật thông tin thành công!");
    }
    catch (error) {
        req.flash("error", "Cập nhật không thành công!");
    }
    res.redirect("back");
});
exports.editPatch = editPatch;
const editPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/editPassword", {
        pageTitle: "Nhập mật khẩu cũ"
    });
});
exports.editPassword = editPassword;
const editPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    const existUser = yield user_model_1.default.findOne({
        tokenUser: tokenUser,
        deleted: false
    });
    if ((0, md5_1.default)(req.body.password) != existUser.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }
    res.redirect(`/user/password/reset`);
});
exports.editPasswordPost = editPasswordPost;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi lại mật khẩu mới",
    });
});
exports.resetPassword = resetPassword;
const resetPasswordPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.password != req.body.confirmpassword) {
            req.flash("error", "Mật khẩu không khớp");
            res.redirect("back");
            return;
        }
        const password = req.body.password;
        const tokenUser = req.cookies.tokenUser;
        yield user_model_1.default.updateOne({
            tokenUser: tokenUser,
            deleted: false
        }, {
            password: (0, md5_1.default)(password)
        });
        req.flash("success", "Đổi mật khẩu thành công");
    }
    catch (error) {
        req.flash("error", "Cập nhật không thành công!");
    }
    res.redirect("/");
});
exports.resetPasswordPatch = resetPasswordPatch;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
    });
    if (!user) {
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }
    if (user["status"] == "inactive") {
        req.flash("error", "Tài khoản đã dừng hoạt động!");
        res.redirect("back");
        return;
    }
    const otp = (0, generate_helper_2.generateRandomNumber)(6);
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
    res.redirect(`/user/password/otp?email=${email}`);
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
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
    const user = yield user_model_1.default.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect(`/user/password/reset`);
});
exports.otpPasswordPost = otpPasswordPost;
