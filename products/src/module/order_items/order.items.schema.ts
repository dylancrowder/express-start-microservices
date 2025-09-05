import { Schema, model, HydratedDocument } from "mongoose";
import { OrderItem } from "./order.itemsDTO";

export type OrderItemDocument = HydratedDocument<OrderItem>;

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    custom_product_id: {
      type: Schema.Types.ObjectId,
      ref: "CustomProduct",
      default: null,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const OrderItemModel = model<OrderItem>("OrderItem", OrderItemSchema);

export default OrderItemModel;
