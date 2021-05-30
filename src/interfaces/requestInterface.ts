import { Request } from "express";

// interface to accept other params for middleware
export interface IRequest extends Request {
  [key: string]: any
}