import { Schema, model, HydratedDocument } from "mongoose";
import { PruebaOrderDTO } from "./pruebaDTO";

export type PruebaOrderDocument = HydratedDocument<PruebaOrderDTO>;

const OrderSchema = new Schema<PruebaOrderDTO>({
  user: { type: String, required: true },
  item: [{ type: Schema.Types.ObjectId, ref: "PruebaItems", required: true }],
});

const PruebaOrderModel = model<PruebaOrderDTO>("PruebaOrder", OrderSchema);

export default PruebaOrderModel;
