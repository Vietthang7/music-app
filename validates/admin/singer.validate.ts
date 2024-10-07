import { Request, Response, NextFunction } from "express";
export const createSinger = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    req.flash("error", "Tên ca sĩ không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}