import { Request, Response, NextFunction } from "express";
import Setting from "../../models/setting.model";
export const setting = async (req: Request, res: Response, next: NextFunction) => {
  const setting = await Setting.findOne({});
  res.locals.setting = setting;

  next();
}