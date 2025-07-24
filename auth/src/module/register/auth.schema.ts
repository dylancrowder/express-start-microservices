import mongoose, { Document } from "mongoose";
import { IUser } from "./auth.interface";

const UserSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

// Tipar el modelo: documento y modelo
export type UserDocument = IUser & Document;
const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
