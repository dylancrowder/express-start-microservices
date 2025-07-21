import { Product } from "../../interfaces/product.interface";
import ProductModel from "./product.schema";
import logger from "../../utilities/pino.logger";
export class ProductService {
  static async createProduct(body: Product) {
    try {
      const newProduct = await ProductModel.create(body);
      return await newProduct.save();
    } catch (error) {
      logger.error("❌ Error al crear producto:", error);
    }
  }
}
