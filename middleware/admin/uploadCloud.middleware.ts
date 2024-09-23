import { streamUpload } from "../../helpers/streamUpload.helper";
import { NextFunction,Request,Response } from "express";
export const uploadSingle = (req:Request, res:Response, next:NextFunction) => {
  if(req["file"]) {
    const uploadToCloudinary = async (buffer) => {
      const result = await streamUpload(buffer);
      req.body[req["file"].fieldname] = result["url"];
      next();
    }

    uploadToCloudinary(req["file"].buffer);
  } else {
    next();
  }
}