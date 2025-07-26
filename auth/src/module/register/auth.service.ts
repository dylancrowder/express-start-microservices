/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import User, { UserDocument } from "./auth.schema";
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
    } catch (error: any) {
      throw new Error("Error al registrar el usuario: " + error.message);
    }
  }

  // Method to authenticate a user
  static async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const usuario = await User.findOne({ email });
      return usuario;
    } catch (error) {
      throw new Error("Error al buscar el usuario:" + error);
    }
  }
}
