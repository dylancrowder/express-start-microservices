import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

// Defino la interface del usuario decodificado
interface DecodedUser {
  userId: string;
  role: string;
  email?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedUser;
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Extraer el token después de "Bearer "
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;

    // Guardo el usuario decodificado en req.user
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
