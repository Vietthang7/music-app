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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostAccount = exports.editPatchAccount = void 0;
const editPatchAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng điền đầy đủ họ tên!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng điền đầy đủ email!");
        res.redirect("back");
        return;
    }
    if (req.body.password) {
        const minLength = 8;
        const password = req.body.password;
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
        const numberPattern = /\d/;
        if (password.length < minLength) {
            req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
            res.redirect("back");
            return;
        }
        if (!/[a-zA-Z]/.test(password)) {
            req.flash("error", "Mật khẩu phải có ít nhất một chữ cái");
            res.redirect("back");
            return;
        }
        if (!numberPattern.test(password)) {
            req.flash("error", "Mật khẩu phải có ít nhất một số");
            res.redirect("back");
            return;
        }
        if (!specialCharPattern.test(password)) {
            req.flash("error", "Mật khẩu phải có ít nhất một ký tự đặc biệt");
            res.redirect("back");
            return;
        }
    }
    next();
});
exports.editPatchAccount = editPatchAccount;
const createPostAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng điền đầy đủ họ tên!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng điền đầy đủ email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect("back");
        return;
    }
    const minLength = 8;
    const password = req.body.password;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/;
    if (password.length < minLength) {
        req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
        res.redirect("back");
        return;
    }
    if (!/[a-zA-Z]/.test(password)) {
        req.flash("error", "Mật khẩu phải có ít nhất một chữ cái");
        res.redirect("back");
        return;
    }
    if (!numberPattern.test(password)) {
        req.flash("error", "Mật khẩu phải có ít nhất một số");
        res.redirect("back");
        return;
    }
    if (!specialCharPattern.test(password)) {
        req.flash("error", "Mật khẩu phải có ít nhất một ký tự đặc biệt");
        res.redirect("back");
        return;
    }
    next();
});
exports.createPostAccount = createPostAccount;
