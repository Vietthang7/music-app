import express from "express";
const router = express.Router();
// import { Register } from "../../validates/user.validate"
import * as controller from "../../controllers/client/user.controller";
router.get("/register", controller.register);
router.post("/register",controller.registerPost);
export const userRoute = router;