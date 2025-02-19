// importamos la conexión a la base de datos
import pool from "../bd.js";

// constructor con los campos de la tabla productos en la base de datos
class SchemaProduct {
  constructor(
    id,
    idCategorie,
    nameProduct,
    brand,
    detail,
    price,
    stock,
    image,
    created,
    updated,
    status
  ) {
    this.idProducto = id;
    this.idCategoria = idCategorie;
    this.nombreProducto = nameProduct;
    this.marca = brand;
    this.detalle = detail;
    this.precio = price;
    this.stock = stock;
    this.imagen = image;
    this.fechaCreacion = created;
    this.fechaActualizacion = updated;
    this.estado = status;
  }
}

// exportamos la clase "Product" para usarla en cualquier controlador
export class Product {
  // si el usuario nos está ingresando un producto, se verifica si ya existe
  static async searchBdProduct(nameProduct) {
    const [dataName] = await pool.query(
      "SELECT * FROM productos p WHERE p.nombreProducto = ?",
      [nameProduct]
    );
    if (dataName) {
      return dataName[0];
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer el número total de productos registrados en la BD
  static async countProducts() {
    const [products] = await pool.query(
      "SELECT COUNT(*) AS products FROM productos p WHERE p.estado != 0"
    );
    if (products) {
      return products;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer todos los productos registrados en la BD
  static async getProducts() {
    const [products] = await pool.query(
      "SELECT p.idProducto, p.nombreProducto, p.marca, p.precio, p.stock, c.nombreCategoria AS categoria FROM productos p INNER JOIN categorias c ON p.idCategoria = c.idCategoria WHERE p.estado = 1"
    );
    if (products) {
      return products;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer todos los productos registrados en la BD de una categoría en específico
  static async getProductsByCategorie({ Id }) {
    const [products] = await pool.query(
      "SELECT p.idProducto, p.nombreProducto, p.marca, p.precio, p.imagen FROM productos p INNER JOIN categorias c ON p.idCategoria = c.idCategoria WHERE c.idCategoria = ?",
      [Id]
    );
    if (products) {
      return products;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para crear nuevo producto
  static async create({
    id,
    categorie,
    nameProduct,
    brand,
    detail,
    price,
    stock,
    image,
    created,
    updated,
    status,
  }) {
    const newProduct = new SchemaProduct(
      id,
      categorie,
      nameProduct,
      brand,
      detail,
      price,
      stock,
      image,
      created,
      updated,
      status
    );
    await pool.query("INSERT INTO productos SET ?", [newProduct]);
  }
  // para mostrar los datos de un producto seleccionada
  static async getProductById({ Id }) {
    const [productById] = await pool.query(
      "SELECT p.idProducto, p.nombreProducto, p.marca, p.detalle, p.precio, p.stock, p.imagen, p.fechaCreacion, c.nombreCategoria AS categoria, c.idCategoria FROM productos p INNER JOIN categorias c ON p.idCategoria = c.idCategoria WHERE p.idProducto = ?",
      [Id]
    );
    if (productById) {
      return productById;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para actualizar datos de un producto
  static async updateById({
    Id,
    categorie,
    nameProduct,
    brand,
    detail,
    price,
    stock,
    image,
    created,
    updated,
    status,
  }) {
    const newProduct = new SchemaProduct(
      Id,
      categorie,
      nameProduct,
      brand,
      detail,
      price,
      stock,
      image,
      created,
      updated,
      status
    );
    await pool.query("UPDATE productos p set ? WHERE p.idProducto = ?", [
      newProduct,
      Id,
    ]);
  }
  // para eliminar los datos de un producto(no se borrarán los datos, solo cambiará el estado a 0 para aparecer como inactivo)
  static async deleteById({
    Id,
    categorie,
    nameProduct,
    brand,
    detail,
    price,
    stock,
    image,
    created,
    updated,
    status,
  }) {
    const newProduct = new SchemaProduct(
      Id,
      categorie,
      nameProduct,
      brand,
      detail,
      price,
      stock,
      image,
      created,
      updated,
      status
    );
    await pool.query("UPDATE productos p set ? WHERE p.idProducto = ?", [
      newProduct,
      Id,
    ]);
  }
}
