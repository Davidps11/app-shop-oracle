import { Request, Response } from "express";
import { getConnection } from "../database/oracle";

export async function loginCustomer(req: Request, res: Response) {
  const { customer_id } = req.body;

  if (!customer_id) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT * FROM CUSTOMERS_MODIFIED WHERE "customer_id" = :id`,
      { id: customer_id }
    );

    await conn.close();

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal error", error });
  }
}
