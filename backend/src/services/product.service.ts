import oracledb from "oracledb";
import { oracleConfig } from "../database/oracle";

export async function getProductsService() {
  let connection: any = null;

  try {
    connection = await oracledb.getConnection(oracleConfig);
    const query = `SELECT ARTICLE_NAME, IMG_URL_TEAM3 FROM ARTICLE_CONTENT_RAG`;

    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows ?? [];

    const products = rows.map((row: any) => ({
      name: row.ARTICLE_NAME,
      image: row.IMG_URL_TEAM3,
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products from Oracle:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing Oracle connection:", closeError);
      }
    }
  }
}
