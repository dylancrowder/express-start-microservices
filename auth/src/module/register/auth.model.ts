/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import User from "./auth.schema";
import { logger } from "../../utilities/winsdom";

export class AuthModel {
  // Method to register a new user
  static async register(email: string, password: string) {
    try {
      if (typeof password !== "string") {
        throw new Error("Password debe ser string");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      return await newUser.save();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === 11000
      ) {
        logger.debug("⚠️ Email ya registrado:", (error as any).keyValue?.email);
        throw new Error("El email ya está registrado");
      }
      logger.debug("❌ Error al registrar usuario:", error);
      throw error;
    }
  }

  // Method to authenticate a user
  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }
}
