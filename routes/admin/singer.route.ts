import express from "express";
import multer from "multer";
const router = express.Router();

import * as controller from "../../controllers/admin/singer.controller";
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
// router.get("/create", controller.create);
// router.post("/create",
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1
//     },
//     {
//       name: "audio",
//       maxCount: 1
//     }
//   ]),
//   uploadCloud.uploadFields,
//   controller.createPost
// );
// router.get("/edit/:id", controller.edit);

export const singerRoute = router;