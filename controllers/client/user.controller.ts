import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from "md5";
import { generateRandomString } from "../../helpers/generate.helper";
import { generateRandomNumber } from "../../helpers/generate.helper";
import ForgotPassword from "../../models/forgot-password.model";
import { sendMail } from "../../helpers/sendEmail.helper";
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
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã dừng hoạt động!");
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
// [GET] /user/editProfile
export const editProfile = async (reqL: Request, res: Response) => {
  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân"
  });
}
// [PATCH] /user/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const tokenUser: string = req.cookies.tokenUser;
    await User.updateOne({
      tokenUser: tokenUser,
      deleted: false
    }, req.body);
    req.flash("success", "Cập nhật thông tin thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật không thành công!");
  }
  res.redirect("back");
}
//[GET] /user/edit-password
export const editPassword = async (req: Request, res: Response) => {
  res.render("client/pages/user/editPassword", {
    pageTitle: "Nhập mật khẩu cũ"
  });
};
//[POST] /user/password-old
export const editPasswordPost = async (req, res) => {
  const password: string = req.body.password;
  const tokenUser: string = req.cookies.tokenUser;
  const existUser = await User.findOne({
    tokenUser: tokenUser,
    deleted: false
  });
  if (md5(req.body.password) != existUser.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }
  res.redirect(`/user/password/reset`)
};
// [GET] /user/password/reset
export const resetPassword = async (req: Request, res: Response) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi lại mật khẩu mới",
  });
};
// [PATCH] /user/password/reset
export const resetPasswordPatch = async (req: Request, res: Response) => {
  try {
    if (req.body.password != req.body.confirmpassword) {
      req.flash("error", "Mật khẩu không khớp");
      res.redirect("back");
      return;
    }
    const password: string = req.body.password;
    const tokenUser: string = req.cookies.tokenUser;
    await User.updateOne({
      tokenUser: tokenUser,
      deleted: false
    }, {
      password: md5(password)
    });
    req.flash("success", "Đổi mật khẩu thành công");
  } catch (error) {
    req.flash("error", "Cập nhật không thành công!");
  }
  res.redirect("/");
};
//[GET] /user/password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
//[POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (user["status"] == "inactive") {
    req.flash("error", "Tài khoản đã dừng hoạt động!");
    res.redirect("back");
    return;
  }
  const otp = generateRandomNumber(6);

  // Việc 1: Lưu email, OTP vào database
  const forgotPasswordData = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3 * 60 * 1000
  };
  const forgotPassword = new ForgotPassword(forgotPasswordData);
  await forgotPassword.save();


  // Việc 2: Gửi mã OTP qua email của user 
  const subject = "Mã OTP lấy lại mật khẩu."
  const htmlSendMail = `Mã OTP xác thực của bạn là <b style = "color:green;"> ${otp} </b>.Mã OTP có hiệu lực trong 3 phút .Vui lòng không cung cấp mã OTP cho người khác`;
  sendMail(email, subject, htmlSendMail);
  res.redirect(`/user/password/otp?email=${email}`);
};
//[GET]/user/password/otp
export const otpPassword = async (req: Request, res: Response) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực mật khẩu",
    email: email
  });
};
//[POST]/user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const otp: number = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect(`/user/password/reset`);
};
