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
exports.editPatch = exports.Register = exports.infoUser = void 0;
const infoUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng điền đầy đủ họ tên!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
        res.redirect("back");
        return;
    }
    next();
});
exports.infoUser = infoUser;
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng điền đầy đủ họ tên !");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect("back");
        return;
    }
    const minLength = 8;
    if (req.body.password.length < minLength) {
        req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
        res.redirect("back");
        return;
    }
    next();
});
exports.Register = Register;
const editPatch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng điền đầy đủ họ tên !");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
        res.redirect("back");
        return;
    }
    if (req.body.password) {
        const minLength = 8;
        if (req.body.password.length < minLength) {
            req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
            res.redirect("back");
            return;
        }
    }
    next();
});
exports.editPatch = editPatch;
