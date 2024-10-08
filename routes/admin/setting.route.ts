import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer();
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
import * as controller from "../../controllers/admin/setting.controller";
router.get("/general", controller.general);
router.patch("/general",
  upload.single('logo'),
  uploadCloud.uploadSingle,
  controller.generalPatch
);

export const settingRoute = router;