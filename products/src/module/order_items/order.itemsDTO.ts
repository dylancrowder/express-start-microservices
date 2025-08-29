import { Types } from "mongoose";

// DTO para crear un item de orden
export interface CreateOrderItemDTO {
  product_id?: Types.ObjectId;
  custom_product_id?: Types.ObjectId;
  quantity: number;
  total: number;
}

// Documento completo
export interface OrderItem extends CreateOrderItemDTO {
  created_at?: Date;
  updated_at?: Date;
}
