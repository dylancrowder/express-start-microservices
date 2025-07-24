/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import User, { UserDocument } from "./auth.schema";
import { logger } from "../../utilities/winsdom";
import { RegisterDTO } from "./auth.interface";

export class AuthModel {
  // Method to register a new user
  static async register({
    email,
    password,
  }: RegisterDTO): Promise<UserDocument | undefined> {
    try {
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
