// importamos la conexión a la base de datos
import pool from "../bd.js";
// para generar id encriptados
import crypto from "crypto";

// constructor con los campos de la tabla detalle_venta en la base de datos
class SchemaSaleDetail {
  constructor(id, idSale, idProduct, quantity, unitPrice, totalPrice, status) {
    this.idDetalleVenta = id;
    this.idVenta = idSale;
    this.idProducto = idProduct;
    this.cantidad = quantity;
    this.precioUnitario = unitPrice;
    this.montoTotal = totalPrice;
  }
}

// exportamos la clase "SaleDetail" para usarla en cualquier controlador
export class SaleDetail {
  // para traer todos los productos registrados en una venta en específico
  static async getSaleDetail({ Id }) {
    const [products] = await pool.query(
      "SELECT p.nombreProducto, p.marca, dv.cantidad, dv.precioUnitario, dv.montoTotal FROM detalle_venta dv INNER JOIN productos p ON dv.idProducto = p.idProducto WHERE dv.idVenta = ?",
      [Id]
    );
    if (products) {
      return products;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para agregar un nuevo ítem de la venta
  static async create({
    id,
    idSale,
    idProduct,
    quantity,
    unitPrice,
    totalPrice,
  }) {
    const newSaleDetail = new SchemaSaleDetail(
      id,
      idSale,
      idProduct,
      quantity,
      unitPrice,
      totalPrice
    );
    await pool.query("INSERT INTO detalle_venta SET ?", [newSaleDetail]);
  }
}
