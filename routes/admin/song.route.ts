import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/song.controller";
router.get("/", controller.index);
export const songRoute = router;