/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { AuthModel } from "./auth.model";
import { logger } from "../../utilities/winsdom";

export class AuthController {
  //CREAR NUEVO USUARIO
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      logger.debug("uyser ty c otnra ,", email, password);

      const user = await AuthModel.register(email, password);

      if (!user) {
        res.status(500).json({
          message:
            "Error al registrar usuario no se pudo ingresar a la base de datos ",
        });
        return;
      }

      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      logger.debug(error);
      res.status(500).json({ message: "Error en el registro" });
    }
  };

  //LOGUEAR USUARIO
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await AuthModel.findByEmail(email);

      if (
        !user ||
        typeof password !== "string" ||
        typeof user.password !== "string" ||
        !(await bcrypt.compare(password, user.password))
      ) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      // Generar el JWT con el userId
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3600000,
      });

      // Enviar el token en el cuerpo de la respuesta
      res.json({ message: "Autenticado correctamente" });
    } catch (error) {
      logger.error("❌ Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error en el login", error });
    }
  };
  //DESLOGUEAR USUARIO
  static logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada" });
  };
  //VERIFICAR USUARIO
  static verify = async (req: Request, res: Response): Promise<any> => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "No autenticado" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return res.json({ authenticated: true, userId: (decoded as any).userId });
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}
