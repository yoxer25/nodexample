// importamos la conexión a la base de datos
import pool from "../bd.js";

export class Receipt {
  // para obtener el último correlativo
  static async getReceipts() {
    const [receipt] = await pool.query(
      'SELECT ultimoComprobante FROM comprobantes WHERE nombre = "NV"'
    );
    return receipt;
  }

  // para actualizar el último correlativo
  static async updateReceipts(lastReceipt) {
    const [receipt] = await pool.query(
      'UPDATE comprobantes SET ultimoComprobante = ? WHERE nombre = "NV"',
      [lastReceipt]
    );
    return receipt;
  }
}
