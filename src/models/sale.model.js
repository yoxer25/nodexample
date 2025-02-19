// importamos la conexión a la base de datos
import pool from "../bd.js";

// constructor con los campos de la tabla ventas en la base de datos
class SchemaSale {
  constructor(id, customer, receipt, amountPay, created, status) {
    this.idVenta = id;
    this.cliente = customer;
    this.comprobante = receipt;
    this.montoPagar = amountPay;
    this.fechaCreacion = created;
    this.estado = status;
  }
}

// exportamos la clase "Sale" para usarla en cualquier controlador
export class Sale {
  // para traer el número total de ventas registrados en la BD
  static async countSales() {
    const [sales] = await pool.query(
      "SELECT COUNT(*) AS sales FROM ventas v WHERE v.estado != 0"
    );
    if (sales) {
      return sales;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer las ventas registradas en la BD
  static async getSales() {
    const [sales] = await pool.query(
      "SELECT * FROM ventas v WHERE v.estado != 0"
    );
    return sales;
  }
  // para crear nueva venta
  static async create({ id, customer, receipt, amountPay, created, status }) {
    const newSale = new SchemaSale(
      id,
      customer,
      receipt,
      amountPay,
      created,
      status
    );
    await pool.query("INSERT INTO ventas SET ?", [newSale]);
  }
  // para traer el id de la última venta registrada
  static async SaleId() {
    const [sale] = await pool.query(
      "SELECT idVenta FROM ventas ORDER BY fechaCreacion DESC LIMIT 1"
    );
    return sale;
  }
}
