// importamos la conexión a la base de datos
import pool from "../bd.js";

// constructor con los campos de la tabla detalle_compra en la base de datos
class SchemaShoppingDetail {
  constructor(id, idShopping, idProduct, quantity, unitPrice, totalPrice) {
    this.idDetalleCompra = id;
    this.idCompra = idShopping;
    this.idProducto = idProduct;
    this.cantidad = quantity;
    this.precioUnitario = unitPrice;
    this.montoTotal = totalPrice;
  }
}

// exportamos la clase "ShoppingDetail" para usarla en cualquier controlador
export class ShoppingDetail {
  // para crear un nuevo ítem de la compra
  static async create({
    id,
    idShopping,
    idProduct,
    quantity,
    unitPrice,
    totalPrice,
  }) {
    const newShoppingDetail = new SchemaShoppingDetail(
      id,
      idShopping,
      idProduct,
      quantity,
      unitPrice,
      totalPrice,
    );
    await pool.query("INSERT INTO detalle_compra SET ?", [newShoppingDetail]);
  }
}
