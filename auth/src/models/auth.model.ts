import bcrypt from "bcryptjs";
import User from "../db/schema/auth.schema";
import logger from "../utilities/pino.logger";

export class AuthModel {
  // Method to register a new user
  static async register(email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      return await newUser.save();
    } catch (error) {
      logger.error("❌ Error al registrar usuario:", error);
      throw new Error("Error al registrar usuario");
    }
  }

  // Method to authenticate a user
  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }
}
