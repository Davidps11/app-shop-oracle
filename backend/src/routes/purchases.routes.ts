import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../database/oracle";

const router = Router();

/**
 * GET /api/purchases?customerId=123
 */
router.get("/purchases", async (req, res) => {
  const customerId = req.query.customerId as string | undefined;

  if (!customerId) {
    return res
      .status(400)
      .json({ success: false, message: "customerId es requerido" });
  }

  let connection: any;

  try {
    connection = await getConnection();

    const sql = `
      SELECT
        "customer_id"   AS "customerId",
        "article_id"    AS "articleId",
        "price"         AS "price",
        "t_year"        AS "year",
        "t_month"       AS "month",
        "t_dayofweek"   AS "dayOfWeek",
        "t_day"         AS "day",
        "price_scaled"  AS "priceScaled",
        "channel_2"     AS "channel"
      FROM ADMIN.TRANSACTIONS_MODIFIED
      WHERE "customer_id" = :customerId
      ORDER BY "t_year" DESC, "t_month" DESC, "t_day" DESC, "article_id"
    `;

    const result = await connection.execute(
      sql,
      { customerId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // devuelve objetos {campo: valor}
      }
    );

    const rows = (result.rows || []) as any[];

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Error en /api/purchases:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Error interno del servidor",
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error cerrando conexión Oracle:", closeError);
      }
    }
  }
});

export default router;
