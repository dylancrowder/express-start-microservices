// src/modules/orders/orders.service.ts
import { AppError } from "@ecomerce/common";
import OrderModel, { OrderDocument } from "./orders.schema";
import { ProductService } from "../products/products.services";
import { CreateOrderDTO, OrderItemsDTO } from "./orderDTO";

export class OrderService {
  // CREAR ORDEN
  static async createOrder(orderBody: CreateOrderDTO): Promise<OrderDocument> {
    try {
      // extraer los IDs de los productos
      if (!orderBody.items || !Array.isArray(orderBody.items)) {
        throw new AppError(
          "BadRequest",
          400,
          "Items are required to create an order.",
          "No items provided in the order.",
          true
        );
      }
      console.log("la bodyyyyyyyyyyyyyyyy", orderBody);

      const ids = orderBody.items.map((id: OrderItemsDTO) => id.toString());
      console.log("estos son los ids ", ids);
      const products = await ProductService.getManyProductsByIds(ids);
      console.log("prodddddddddddddddddddddd", products);

      // calcular total
      const total = products.reduce((sum, product) => {
        const item = orderBody.items!.find(
          (i) => i.productId === product._id.toString()
        );
        return sum + (item ? item.quantity * product.price : 0);
      }, 0);

      const ord = {
        ...orderBody,
        total,
      };

      const newOrder = await OrderModel.create(ord);
      return await newOrder.save();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al crear la orden.",
        true
      );
    }
  }
}
