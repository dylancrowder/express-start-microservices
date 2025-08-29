// orderDTO.ts

import { CreateOrderItemDTO } from "../order_items/order.itemsDTO";

export interface CreateOrderDTO {
  user_id: number;
  admin_id?: number; // opcional
  status?: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  amount_paid?: number;
  items?: Array<CreateOrderItemDTO>;
  payment_type?: "card" | "cash" | "pix" | "crypto";
  payment_status?: "debt" | "paid";
}

export type UpdateOrderDTO = Partial<CreateOrderDTO>;
