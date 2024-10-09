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
exports.editSong = exports.createSong = void 0;
const createSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.title) {
        req.flash("error", "Tên bài hát không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.audio) {
        req.flash("error", "File audio không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.singerId) {
        req.flash("error", "Tên ca sĩ không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.topicId) {
        req.flash("error", "File audio không được để trống!");
        res.redirect("back");
        return;
    }
    next();
});
exports.createSong = createSong;
const editSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.title) {
        req.flash("error", "Tên bài hát không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.singerId) {
        req.flash("error", "Tên ca sĩ không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.topicId) {
        req.flash("error", "File audio không được để trống!");
        res.redirect("back");
        return;
    }
    next();
});
exports.editSong = editSong;
