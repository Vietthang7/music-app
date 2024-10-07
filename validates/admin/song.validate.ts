import { Request, Response, NextFunction } from "express";
export const createSong = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    req.flash("error", "Tên bài hát không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.audio) {
    req.flash("error", "File audio không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.singerId) {
    req.flash("error", "Tên ca sĩ không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.topicId) {
    req.flash("error", "File audio không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}
export const editSong = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    req.flash("error", "Tên bài hát không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.singerId) {
    req.flash("error", "Tên ca sĩ không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.topicId) {
    req.flash("error", "File audio không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}