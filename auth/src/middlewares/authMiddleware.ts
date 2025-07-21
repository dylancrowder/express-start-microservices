/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt from "jsonwebtoken";

// Extiende los tipos de Express para que `req.user` sea reconocido
declare module "express" {
  export interface Request {
    user?: any;
  }
}

export const authMiddleware = (req: any, res: any, next: any): any => {
  try {
    // Verificamos si existe el token en las cookies
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Verificamos y decodificamos el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Asignamos la información del usuario decodificado a `req.user`
    req.user = decoded;

    // Continuar con la siguiente función
    next();
  } catch {
    // Si ocurre un error al verificar el token, respondemos y terminamos la ejecución
    res.status(401).json({ message: "Token inválido o expirado" });
    return;
  }
};
