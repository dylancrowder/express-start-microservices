/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { AuthModel } from "./auth.service";

import { UserDocument } from "./auth.schema";
import { IUser } from "./auth.interface";

import { AppError, authVerification } from "@ecomerce/common";

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
      const user: IUser = await AuthModel.register({ email, password });

      res.status(201).json({
        message: "Usuario registrado correctamente.",
        userid: user.email,
      });
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
    } catch (error) {
      next(error);
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
      next(error);
    }
  };
}
