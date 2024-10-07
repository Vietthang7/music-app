import { Request, Response, NextFunction } from "express";
export const createTopic = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    req.flash("error", "Tên chủ đề không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}