import { RequestHandler } from "express";

export const hola: RequestHandler = (req, res, next) => {
  console.log("hola");
  next();
};
