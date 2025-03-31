// importamos la conexión a la base de datos
import pool from "../bd.js";
// para generar id encriptados
import crypto from "crypto";
import { helpers } from "../libraries/helpers.js";

// constructor con los campos de la tabla categorias en la base de datos
class SchemaCategorie {
  constructor(id, name) {
    this.idCategoria = id;
    this.nombreCategoria = name;
  }
}

// exportamos la clase "Categorie" para usarla en cualquier controlador
export class Categorie {
  // si el usuario nos está ingresando una categoría, se verifica si ya existe
  static async searchBdCategorie(nameCategorie) {
    const [dataName] = await pool.query(
      "SELECT * FROM categorias c WHERE c.nombreCategoria = ?",
      [nameCategorie]
    );
    if (dataName) {
      return dataName[0];
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer el número total de categorías registradas en la BD
  static async countCategories() {
    const [categories] = await pool.query(
      "SELECT COUNT(*) AS categories FROM categorias c WHERE c.estado != 0"
    );
    if (categories) {
      return categories;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer todas las categorías registradas en la BD
  static async getCategories() {
    const [categories] = await pool.query(
      "SELECT c.idCategoria, c.nombreCategoria FROM categorias c WHERE c.estado = 1"
    );
    if (categories) {
      return categories;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer todas las categorías registradas en la BD en el formulario de productos
  static async getSelectCategories({ Id }) {
    const [categories] = await pool.query(
      "SELECT c.idCategoria, c.nombreCategoria FROM categorias c WHERE NOT EXISTS (SELECT * FROM productos p WHERE c.idCategoria = p.idCategoria AND c.estado = 1 AND p.idProducto = ?)",
      [Id]
    );
    if (categories) {
      return categories;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para crear nueva categoría
  static async create({ nameCategorie }) {
    const id = crypto.randomUUID();
    const newCategorie = new SchemaCategorie(id, nameCategorie);
    newCategorie.fechaCreacion = helpers.formatDate();
    await pool.query("INSERT INTO categorias SET ?", [newCategorie]);
  }
  // para mostrar los datos de una categoría seleccionada por su id
  static async getCategorieById({ Id }) {
    const [categorieById] = await pool.query(
      "SELECT * FROM categorias c WHERE c.idCategoria = ?",
      [Id]
    );
    if (categorieById) {
      return categorieById;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para actualizar datos de una categoría
  static async updateById({ Id, nameCategorie }) {
    const newCategorie = new SchemaCategorie(Id, nameCategorie);
    newCategorie.fechaActualizacion = helpers.formatDate();
    await pool.query("UPDATE categorias c set ? WHERE c.idCategoria = ?", [
      newCategorie,
      Id,
    ]);
  }
  // para eliminar los datos de una categoría(no se borrarán los datos, solo cambiará el estado a 0 para aparecer como inactivo)
  static async deleteById({ Id }) {
    const [categorie] = await Categorie.getCategorieById({ Id });
    const newCategorie = new SchemaCategorie(Id, categorie.nombreCategoria);
    newCategorie.fechaActualizacion = helpers.formatDate();
    newCategorie.estado = 0;
    await pool.query("UPDATE categorias c set ? WHERE c.idCategoria = ?", [
      newCategorie,
      Id,
    ]);
  }
}
