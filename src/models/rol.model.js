// importamos la conexión a la base de datos
import pool from "../bd.js";

// exportamos la clase "Rol" para usarla en cualquier controlador
export class Rol {
  
  // para traer todos los roles registradas en la BD
  static async getRoles() {
    const [roles] = await pool.query(
      "SELECT * FROM rol r WHERE r.estado != 0"
    );
    if (roles) {
      return roles;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
  // para traer todas las roles registrados en la BD en el formulario de actualizar usuario
  static async getSelectRoles({ Id }) {
    const [roles] = await pool.query(
      "SELECT * FROM rol r WHERE NOT EXISTS (SELECT * FROM usuarios u WHERE r.idRol = u.idRol AND r.estado != 0 AND u.idUsuario = ?)",
      [Id]
    );
    if (roles) {
      return roles;
    } else {
      throw new Error("Datos no encontrados");
    }
  }
}
