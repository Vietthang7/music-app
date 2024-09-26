import express from "express";
import multer from "multer";
const router = express.Router();

import * as controller from "../../controllers/admin/upload.controller";
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
const upload = multer();
router.post(
  "/",
  upload.single("file"),
  uploadCloud.uploadSingle,
  controller.index
)
export const uploadRoute = router;