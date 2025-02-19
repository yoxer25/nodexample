// importamos la conexión a la base de datos
import pool from "../bd.js";

// constructor con los campos de la tabla compras en la base de datos
class SchemaShopping {
  constructor(id, customer, receipt, amountPay, receiptDate, created, status) {
    this.idCompra = id;
    this.cliente = customer;
    this.comprobante = receipt;
    this.montoPagar = amountPay;
    this.fechaComprobante = receiptDate;
    this.fechaCreacion = created,
    this.estado = status;
  }
}

// exportamos la clase "Shopping" para usarla en cualquier controlador
export class Shopping {
  // para traer el número total de compras registrados en la BD
  static async countShopping() {
    const [shopping] = await pool.query(
      "SELECT COUNT(*) AS shopping FROM compras c WHERE c.estado != 0"
    );
    if (shopping) {
      return shopping;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer las compras registradas en la BD
  static async getShopping() {
    const [shopping] = await pool.query(
      "SELECT * FROM compras c WHERE c.estado != 0"
    );
    return shopping;
  }
  // para crear nueva compra
  static async create({ id, customer, receipt, amountPay, receiptDate, created, status }) {
    const newShopping = new SchemaShopping(
      id,
      customer,
      receipt,
      amountPay,
      receiptDate,
      created,
      status
    );
    await pool.query("INSERT INTO compras SET ?", [newShopping]);
  }
  // para traer el id de la última compra registrada
  static async ShoppingId() {
    const [shopping] = await pool.query(
      "SELECT idCompra FROM compras ORDER BY fechaCreacion DESC LIMIT 1"
    );
    return shopping;
  }
}
