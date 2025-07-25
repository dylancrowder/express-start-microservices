import { Schema, model } from "mongoose";
import { Product } from "../../interfaces/product.interface";

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      maxlength: [100, "Máximo 100 caracteres"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0.01, "El precio debe ser mayor a 0"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero",
      },
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      maxlength: [500, "Máximo 500 caracteres"],
    },
  },
  { timestamps: true }
);

const ProductModel = model<Product>("Product", productSchema);

export default ProductModel;
