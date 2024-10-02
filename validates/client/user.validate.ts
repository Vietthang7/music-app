import { Response, Request, NextFunction } from "express";
export const infoUser = async (req:Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng điền đầy đủ họ tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
    res.redirect("back");
    return;
  }
  next();
}
export const Register = async (req:Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng điền đầy đủ họ tên !");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect("back");
    return;
  }
  const minLength = 8;
  if (req.body.password.length < minLength) {
    req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
    res.redirect("back");
    return;
  }
  next();
}
export const editPatch = async (req:Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng điền đầy đủ họ tên !");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
    res.redirect("back");
    return;
  }
  if (req.body.password) {
    const minLength = 8;
    if (req.body.password.length < minLength) {
      req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
      res.redirect("back");
      return;
    }
  }
  next();
}

