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
exports.generalPatch = exports.general = void 0;
const setting_model_1 = __importDefault(require("../../models/setting.model"));
const general = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield setting_model_1.default.findOne({});
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        setting: setting
    });
});
exports.general = general;
const generalPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("settings-general_edit")) {
        const setting = yield setting_model_1.default.findOne({});
        if (setting) {
            yield setting_model_1.default.updateOne({
                _id: setting.id
            }, req.body);
        }
        else {
            const record = new setting_model_1.default(req.body);
            yield record.save();
        }
        res.redirect("back");
    }
});
exports.generalPatch = generalPatch;
