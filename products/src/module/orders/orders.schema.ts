// order.schema.ts
import { Schema, model, HydratedDocument } from "mongoose";
import { CreateOrderDTO } from "./orderDTO";
import OrderItemModel from "../order_items/order.items.schema";

export type OrderDocument = HydratedDocument<CreateOrderDTO>;

const OrderSchema = new Schema<CreateOrderDTO>(
  {
    user_id: { type: Number, required: true },
    admin_id: { type: Number, default: null },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    items: [OrderItemModel.schema], // ✅ Esto está perfecto
    total: { type: Number, required: true, min: 0 },
    amount_paid: { type: Number, default: 0, min: 0 },
    payment_type: {
      type: String,
      enum: ["card", "cash", "pix", "crypto"],
      default: null,
    },
    payment_status: {
      type: String,
      enum: ["debt", "paid"],
      default: "debt",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const OrderModel = model<CreateOrderDTO>("Order", OrderSchema);

export default OrderModel;
