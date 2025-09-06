import { Schema, model, HydratedDocument } from "mongoose";

// DTO para crear un producto personalizado
export interface CreateCustomProductDTO {
  name: string;
  price: number;
  description?: string;
}

// Documento completo
export interface CustomProduct extends CreateCustomProductDTO {
  created_at?: Date;
  updated_at?: Date;
}

export type CustomProductDocument = HydratedDocument<CustomProduct>;

const CustomProductSchema = new Schema<CustomProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const CustomProductModel = model<CustomProduct>(
  "CustomProduct",
  CustomProductSchema
);

export default CustomProductModel;
