import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "@ecomerce/common";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const URI = process.env.DB_URI;

export const initMongo = async () => {
  if (!URI) {
    logger.error("❌ DB_URI is not defined in environment variables.");
    process.exit(1);
  }
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });

    logger.info("✅ Base de datos conectada correctamente");
  } catch (error) {
    logger.error("❌ Error al intentar conectarse a la base de datos:", error);
    process.exit(1);
  }
};
