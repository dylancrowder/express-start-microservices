/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { AuthModel } from "./auth.service";
import { authVerification } from "../../utilities/joi";
import AppError from "../../utilities/error/appError";
import { UserDocument } from "./auth.schema";

export class AuthController {
  // REGISTRAR USUARIO
  static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UserDocument | any> => {
    try {
      const verificar = authVerification.validate(req.body);

      if (verificar.error) {
        throw new AppError(
          "ValidationError",
          400,
          verificar.error,
          "Los datos proporcionados no son válidos. Por favor, revisa los campos requeridos.",
          true
        );
      }

      const { email, password } = req.body;
      const user = await AuthModel.register({ email, password });

      if (!user) {
        throw new AppError(
          "ConflictError",
          409,
          "No se pudo crear el usuario.",
          "Ya existe un usuario con este correo o hubo un problema al registrarlo.",
          true
        );
      }

      res.status(201).json({ message: "Usuario registrado correctamente." });
    } catch (error) {
      next(error);
    }
  };

  // LOGIN
  static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UserDocument | any> => {
    try {
      const verificar = authVerification.validate(req.body);
      if (verificar.error) {
        throw new AppError(
          "ValidationError",
          400,
          verificar.error.details,
          "Los datos ingresados no son válidos. Revisa el email y la contraseña.",
          true
        );
      }

      const { email, password } = req.body;

      const user = await AuthModel.findByEmail(email);
      if (!user) {
        throw new AppError(
          "NotFoundError",
          404,
          "Usuario no encontrado.",
          "No existe un usuario registrado con este correo electrónico.",
          true
        );
      }

      const passwordCorrecta = await bcrypt.compare(password, user.password);
      if (!passwordCorrecta) {
        throw new AppError(
          "UnauthorizedError",
          401,
          "Contraseña incorrecta.",
          "La contraseña ingresada es incorrecta.",
          true
        );
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Cambiar a true en producción con HTTPS
        sameSite: "lax",
        maxAge: 3600000, // 1 hora
      });

      res.status(200).json({ message: "Autenticación exitosa.", token });
    } catch (error: any) {
      next(
        new AppError(
          "InternalServerError",
          500,
          error.message || "Error al iniciar sesión.",
          "Se produjo un error inesperado al iniciar sesión.",
          true
        )
      );
    }
  };

  // LOGOUT
  static logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Sesión cerrada exitosamente." });
    } catch (error: any) {
      next(
        new AppError(
          "InternalServerError",
          500,
          error.message || "Error al cerrar sesión.",
          "No se pudo cerrar la sesión correctamente.",
          true
        )
      );
    }
  };
}
