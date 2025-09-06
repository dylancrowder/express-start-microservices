// order.schema.ts
import { Schema, model, HydratedDocument } from "mongoose";
import { PruebaProductoDTO } from "./pruebaDTO";

export type PruebaProductDocument = HydratedDocument<PruebaProductoDTO>;

const OrderSchema = new Schema<PruebaProductoDTO>({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
});

const PruebaProductoModel = model<PruebaProductoDTO>(
  "PruebaProducto",
  OrderSchema
);

export default PruebaProductoModel;
