import express from "express";
const router = express.Router();


import * as controller from "../../controllers/client/home.controller";

router.get("/",controller.index);

export const homeRoute = router;
