import express from "express";
import multer from "multer";
const router = express.Router();

import * as controller from "../../controllers/admin/song.controller";
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
import { createSong } from "../../validates/admin/song.validate";
import { editSong } from "../../validates/admin/song.validate";
const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "audio",
      maxCount: 1
    }
  ]),
  uploadCloud.uploadFields,
  createSong,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "audio",
      maxCount: 1
    }
  ]),
  uploadCloud.uploadFields,
  editSong,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.patch("/delete/:id", controller.deleteSong);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);

export const songRoute = router;