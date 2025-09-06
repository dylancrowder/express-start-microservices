import { Types } from "mongoose";
export interface PruebaItemsDTO {
  _id: Types.ObjectId;
  producto: Types.ObjectId;
  cantidad: number;
}
export interface PruebaOrderDTO {
  user: string;
  item: Array<object>;
}

export interface PruebaProductoDTO {
  nombre: string;
  precio: number;
}
