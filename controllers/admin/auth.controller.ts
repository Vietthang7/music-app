import { Request, Response } from "express";
import Account from "../../models/accounts.model";
import md5 from "md5";
import { systemConfig } from "../../config/system";
// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập"
  });
}
// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const existAccount = await Account.findOne({
    email: email,
    deleted: true
  });
  if (existAccount) {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }
  const account = await Account.findOne({
    email: email,
    deleted: false
  });

  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (md5(password) != account.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if (account.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("token", account.token);
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}
// [GET] /admin/auth/logout
export const logOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}