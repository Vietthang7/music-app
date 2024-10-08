"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const user_validate_1 = require("../../validates/client/user.validate");
const user_validate_2 = require("../../validates/client/user.validate");
const user_middleware_1 = require("../../middleware/client/user.middleware");
const controller = __importStar(require("../../controllers/client/user.controller"));
const password_validate_1 = require("../../validates/client/password.validate");
const uploadCloud = __importStar(require("../../middleware/admin/uploadCloud.middleware"));
const upload = (0, multer_1.default)();
router.get("/register", controller.register);
router.post("/register", user_validate_1.Register, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/profile", user_middleware_1.requireAuth, controller.profile);
router.get("/editprofile", user_middleware_1.requireAuth, controller.editProfile);
router.patch("/edit", upload.single('avatar'), uploadCloud.uploadSingle, user_validate_2.infoUser, controller.editPatch);
router.get("/edit-password", user_middleware_1.requireAuth, controller.editPassword);
router.post("/edit-password", user_middleware_1.requireAuth, password_validate_1.valiPassword, controller.editPasswordPost);
router.get("/password/reset", user_middleware_1.requireAuth, controller.resetPassword);
router.patch("/password/reset", user_middleware_1.requireAuth, password_validate_1.valiPassword, controller.resetPasswordPatch);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
exports.userRoute = router;
