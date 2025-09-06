import { Types } from "mongoose";

// DTO para crear un item de orden
export interface CreateOrderItemDTO {
  _id?: Types.ObjectId;
  productId?: Types.ObjectId | null;
  custom_product_id?: Types.ObjectId | null;
  quantity: number;
  total: number;
  price: number;
}

// Documento completo
export interface OrderItem extends CreateOrderItemDTO {
  created_at?: Date;
  updated_at?: Date;
}
