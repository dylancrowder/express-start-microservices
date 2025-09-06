// order.schema.ts
import { Schema, model, HydratedDocument } from "mongoose";
import { PruebaItemsDTO } from "./pruebaDTO";

export type PruebaDocument = HydratedDocument<PruebaItemsDTO>;

const ItemSchema = new Schema<PruebaItemsDTO>({
  cantidad: { type: Number, required: true },
  producto: {
    type: Schema.Types.ObjectId,
    ref: "PruebaProducto",
    required: true,
  },
});

const PruebaItemsModel = model<PruebaItemsDTO>("PruebaItems", ItemSchema);

export default PruebaItemsModel;
