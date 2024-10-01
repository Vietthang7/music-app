import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from "md5";
import { generateRandomString } from "../../helpers/generate.helper"
//[GET] /user/register
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng kí tài khoản"
  });
};
//[POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false
  })
  if (existUser) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
  }
  if (req.body.password != req.body.confirmpassword) {
    req.flash("error", "Mật khẩu không khớp");
    res.redirect("back");
    return;
  }
  const userData = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    tokenUser: generateRandomString(30),
  };
  const user = new User(userData);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng kí tài khoản thành công");
  res.redirect("/");
};
//[GET] /user/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản"
  });
};
//[POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(req.body.password) != user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }

  const expires = 3 * 24 * 60 * 60 * 1000;
  res.cookie(
    "tokenUser",
    user.tokenUser,
    {
      expires: new Date(Date.now() + expires)
    });
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");
};
//[GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
};
//[GET] /user/profile
export const profile = async (req: Request, res: Response) => {
  res.render("client/pages/user/profile", {
    pageTitle: "Thông tin cá nhân"
  });
};
