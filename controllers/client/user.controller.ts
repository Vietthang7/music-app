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
    res.redirect("back");
    return;
  }
  if (req.body.password != req.body.confirmpassword) {
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
  // req.flash("success", "Đăng kí tài khoản thành công");
  res.redirect("/");
};