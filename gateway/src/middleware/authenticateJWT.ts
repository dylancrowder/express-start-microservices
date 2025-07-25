import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return res.json({ authenticated: true, userId: (decoded as any).userId });
  } catch (error) {
    console.log(error);

    return res.status(401).json({ message: "Token inválido" });
  }
};
