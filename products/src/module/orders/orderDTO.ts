// orderDTO.ts

import { Types } from "mongoose";

export interface CreateOrderDTO {
  user_id: Types.ObjectId;
  admin_id?: Types.ObjectId; // opcional
  status?: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  amount_paid?: number;
  items?: Array<OrderItemsDTO>;
  payment_type?: "card" | "cash" | "pix" | "crypto";
  payment_status?: "debt" | "paid";
}
export interface OrderItemsDTO {
  id: string;
}

export type UpdateOrderDTO = Partial<CreateOrderDTO>;
