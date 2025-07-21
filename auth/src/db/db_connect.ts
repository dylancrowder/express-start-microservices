import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const URI = process.env.DB_URI;

export const initMongo = async () => {
  if (!URI) {
    console.error("❌ DB_URI is not defined in environment variables.");
    process.exit(1);
  }
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ Base de datos conectada correctamente");
  } catch (error) {
    console.error("❌ Error al intentar conectarse a la base de datos:", error);
    process.exit(1);
  }
};
