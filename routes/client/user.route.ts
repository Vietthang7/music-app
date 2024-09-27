import express from "express";
const router = express.Router();
import { Register } from "../../validates/user.validate"
import * as controller from "../../controllers/client/user.controller";
router.get("/register", controller.register);
router.post("/register",Register,controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);

export const userRoute = router;