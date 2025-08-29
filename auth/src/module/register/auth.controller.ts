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
        { userId: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3600000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 3600000, // 7 días
      });

      res.status(200).json({
        message: "Autenticación exitosa.",
        accessToken: token,
        refreshToken: refreshToken,
        email: user.email,
        role: user.role,
      });
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

  // REFRESH TOKEN
  static refresh = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(401).json({ error: "No refresh token" });

      const JWT_SECRET = process.env.JWT_SECRET;
      const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
      if (!JWT_SECRET || !JWT_REFRESH_SECRET)
        throw new Error("JWT secrets deben estar definidos");

      // Verificar refresh token
      const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // Crear nuevo access token
      const newAccessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  };
}
