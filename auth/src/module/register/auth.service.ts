/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import User, { UserDocument } from "./auth.schema";
import { RegisterDTO } from "./auth.interface";
import { AppError } from "@ecomerce/common";

export class AuthModel {
  static async register({
    email,
    password,
  }: RegisterDTO): Promise<UserDocument> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      return await newUser.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // Error de duplicado en MongoDB
        throw new AppError(
          "ConflictError",
          409,
          error,
          "Ya existe un usuario con este correo.",
          true
        );
      }

      throw new AppError(
        "InternalServiceError",
        500,
        error,
        "Hubo un problema al registrar el usuario.",
        true
      );
    }
  }

  static async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const usuario = await User.findOne({ email });
      return usuario;
    } catch (error: any) {
      throw new AppError(
        "InternalServiceError",
        500,
        error,
        "Hubo un error al buscar el usuario por correo.",
        true
      );
    }
  }
}
