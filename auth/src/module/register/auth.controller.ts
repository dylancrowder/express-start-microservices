/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { AuthModel } from "./auth.model";
import { logger } from "../../utilities/winsdom";
import { authVerification } from "../../utilities/joi";
import AppError from "../../utilities/error/appError";
import { log } from "winston";

export class AuthController {
  //CREAR NUEVO USUARIO
  static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const verificar = authVerification.validate(req.body);

      if (verificar.error) {
        throw new AppError(
          "ValidationError",
          400,
          verificar.error,
          "Datos inválidos. Por favor, revisa los campos de la autentificación.",
          true
        );
      }

      const { email, password } = req.body;

      const user = await AuthModel.register({ email, password });

      if (!user) {
        throw new AppError(
          "DatabaseError",
          409,
          "No se pudo registrar el usuario.",
          "Error al registrar usuario. Intente más tarde.",
          true
        );
      }

      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      next(error);
    }
  };

  //LOGUEAR USUARIO
  static login = async (req: Request, res: Response): Promise<any> => {
    try {
      // Validar el body
      const verificar = authVerification.validate(req.body);
      if (verificar.error) {
        logger.error("❌ Error de validación:", verificar.error.details);
        return res
          .status(400)
          .json({ message: "Datos de autenticación inválidos" });
      }

      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await AuthModel.findByEmail(email.trim().toLowerCase());
      if (!user) {
        logger.debug("Usuario no encontrado con ese email");
        return res
          .status(401)
          .json({ message: "Email o contraseña incorrectos" });
      }

      // Verificar contraseña
      const passwordCorrecta = await bcrypt.compare(password, user.password);
      if (!passwordCorrecta) {
        logger.debug("Contraseña incorrecta");
        return res
          .status(401)
          .json({ message: "Email o contraseña incorrectos" });
      }

      // Generar el JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      // Setear cookie segura
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // poné `true` si estás en producción con HTTPS
        sameSite: "lax",
        maxAge: 3600000, // 1 hora
      });

      res.json({ message: "Autenticado correctamente", token });
    } catch (error: any) {
      logger.error("❌ Error al iniciar sesión:", error.message || error);
      res
        .status(500)
        .json({ message: "Error en el login", error: error.message });
    }
  };

  //DESLOGUEAR USUARIO
  static logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada" });
  };

  //VERIFICAR USUARIO
}
