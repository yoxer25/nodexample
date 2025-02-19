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
    this.estado = status;
  }
}

// exportamos la clase "SaleDetail" para usarla en cualquier controlador
export class SaleDetail {
  // para agregar un nuevo ítem de la venta
  static async create({
    id,
    idSale,
    idProduct,
    quantity,
    unitPrice,
    totalPrice,
    status,
  }) {
    const newSaleDetail = new SchemaSaleDetail(
      id,
      idSale,
      idProduct,
      quantity,
      unitPrice,
      totalPrice,
      status
    );
    await pool.query("INSERT INTO detalle_venta SET ?", [newSaleDetail]);
  }
}
