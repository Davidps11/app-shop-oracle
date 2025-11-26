import { Request, Response } from "express";
import { getProductsService } from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await getProductsService();

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      error: "Error fetching products",
    });
  }
}
