import express from "express";
import { ProductController } from "./product.controller";

const router = express.Router();

router.post("/create", ProductController.createProducts);
router.get("/find", ProductController.getAllProducts);
router.delete("/deleteOne/:id", ProductController.deleteOneProduct);
router.patch("/editOne/:id", ProductController.editOneProduct);
export default router;
