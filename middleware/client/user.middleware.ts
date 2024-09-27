import User from "../../models/user.model";
import { Request, Response, NextFunction } from "express";
export const infoUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false
    });

    if (user) {
      res.locals.user = user;
    }
  }
  next();
}
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.tokenUser) {
    res.redirect("/user/login");
    return;
  }

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false
  });
  if (!user) {
    res.redirect("/user/login");
    return;
  }

  next();
}