/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import User from "./auth.schema";
import { logger } from "../../utilities/winsdom";

export class AuthModel {
  // Method to register a new user
  static async register(email: string, password: string) {
    try {
      const is_register = await this.findByEmail(email);

      if (is_register) {
        logger.debug("⚠️ Email ya registrado:", email);
        throw new Error("El email ya está registrado");
      }

      if (typeof password !== "string") {
        throw new Error("Password debe ser string");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ email, password: hashedPassword });
      return await newUser.save();
    } catch (error: unknown) {
      logger.error("Error al registrar usuario:", error);
    }
  }

  // Method to authenticate a user
  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }
}
