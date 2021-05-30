import { IRequest } from "./../interfaces/requestInterface";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import utils from "../utils/utils";

/**
 * middleware to check authentication
 * @param req : api request
 * @param res : api response
 * @param next : go to the next middleware
 */
export const isAuthenticated = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  // check if token is given
  const token = req.headers.token;
  if (!token || token === "") {
    // user not authorized
    req.isAuthenticated = false;
    return next();
  }

  // declare decoded token value
  let decodedToken: any;

  try {
    // check id the token is valid
    decodedToken = jwt.verify(token.toString(), utils.privateKey);
  } catch (error) {
    // user not authorized
    req.isAuthenticated = false;
    return next();
  }
  if (!decodedToken) {
    // user not authorized
    req.isAuthenticated = false;
    return next();
  }

  // user is authorized
  req.isAuthenticated = true;
  // append the userId to the request
  req.userId = decodedToken.id;

  return next();
};
