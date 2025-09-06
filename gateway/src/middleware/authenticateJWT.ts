import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Defino la interface del usuario decodificado
interface DecodedUser {
  userId: string;
  role: string;
}

interface DecodedUser {
  userId: string;
  role: string;
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
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Verifico y decodifico el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;

    // Guardo el usuario decodificado en req.user
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
