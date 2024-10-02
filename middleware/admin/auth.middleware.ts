import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";
import { NextFunction } from "express";
import { Response, Request } from "express";
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const account = await Account.findOne({
    token: req.cookies.token,
    deleted: false
  }).select("fullName email phone avatar role_id");
  if (!account) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const role = await Role.findOne({
    _id: account.role_id
  }).select("title permissions");
  res.locals.account = account;
  res.locals.role = role;
  next();
}