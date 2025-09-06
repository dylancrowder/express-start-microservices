/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@ecomerce/common";
import { PruebaItemsDTO, PruebaOrderDTO, PruebaProductoDTO } from "./pruebaDTO";

import PruebaOrder from "./prueba.order.schema";
import PruebaProductoModel from "./prueba.producto.schema";
import PruebaItemsModel from "./prueba.items.schema";
import PruebaOrderModel from "./prueba.order.schema";

export class PruebaService {
  // CREAR ORDEN
  static async createOrder(body: PruebaOrderDTO): Promise<PruebaOrderDTO> {
    try {
      const newPrueba = await PruebaOrder.create(body);
      return await newPrueba.save();
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
  static async createProduct(
    body: PruebaProductoDTO
  ): Promise<PruebaProductoDTO> {
    try {
      const newPrueba = await PruebaProductoModel.create(body);
      return await newPrueba.save();
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

  static async createItem(body: PruebaItemsDTO): Promise<PruebaItemsDTO> {
    try {
      const newPrueba = await PruebaItemsModel.create(body);
      return await newPrueba.save();
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

  // service
  static async createManyItems(
    bodies: PruebaItemsDTO[]
  ): Promise<PruebaItemsDTO[]> {
    try {
      const newItems = await PruebaItemsModel.insertMany(bodies);
      return newItems;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al crear múltiples items.",
        true
      );
    }
  }

  static async getProduct(): Promise<PruebaProductoDTO[]> {
    try {
      return await PruebaProductoModel.find();
    } catch (error) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al crear múltiples items.",
        true
      );
    }
  }

  static async getOrders() {
    try {
      const orders = await PruebaOrderModel.find().populate({
        path: "item", // populate del array de items
        populate: {
          path: "producto", // populate del producto dentro del item
          select: "nombre precio", // solo los campos necesarios
        },
      });
      return orders;
    } catch (error: any) {
      throw new Error("Error al traer las órdenes con productos", error);
    }
  }
}
