// importamos la conexión a la base de datos
import pool from "../bd.js";
import { helpers } from "../libraries/helpers.js";
class SchemaUser {
  constructor(id, rol, username, dni) {
    this.idUsuario = id;
    this.idRol = rol;
    this.nombreUsuario = username;
    this.documento = dni;
  }
}

export class User {
  // para traer el listado de los usuarios
  static async getUsers() {
    const [users] = await pool.query(
      "SELECT u.idUsuario, u.nombreUsuario, u.documento, r.nombreRol FROM usuarios u INNER JOIN rol r ON u.idRol = r.idRol WHERE u.estado != 0"
    );
    if (users) {
      return users;
    } else {
      throw new Error("Datos no encontrados");
    }
  }

  // para traer la información de un usuario por ID
  static async getUserById({ Id }) {
    const [users] = await pool.query(
      "SELECT u.idUsuario, u.idRol, u.nombreUsuario, u.documento, r.nombreRol FROM usuarios u INNER JOIN rol r ON u.idRol = r.idRol WHERE u.estado != 0 AND u.idUsuario = ?",
      [Id]
    );
    if (users) {
      return users;
    } else {
      throw new Error("Datos no encontrados");
    }
  }

  static async set(id, rol, username, dni, _method) {
    if (_method === "PUT") {
      const newUser = new SchemaUser(id, rol, username, dni);
      newUser.fechaActualizacion = helpers.formatDate();
      await pool.query("UPDATE usuarios u set ? WHERE u.idUsuario = ?", [
        newUser,
        id,
      ]);
    } else if (_method === "PATCH") {
      const newUser = {
        estado: 0,
        fechaActualizacion: helpers.formatDate(),
      };
      await pool.query("UPDATE usuarios u set ? WHERE u.idUsuario = ?", [
        newUser,
        id,
      ]);
    }
  }
  // para crear un nuevo usuario
  static async create(id, rol, username, dni, password) {
    const newUser = new SchemaUser(id, rol, username, dni);
    newUser.contrasena = password;
    newUser.fechaCreacion = helpers.formatDate();
    await pool.query("INSERT INTO usuarios SET ?", [newUser]);
  }
  // para iniciar sesión
  static async login({ dni, userpassword }) {
    const [user] = await pool.query(
      "SELECT * FROM usuarios u INNER JOIN rol r ON u.idRol = r.idRol WHERE u.documento = ? AND u.estado != 0",
      [dni]
    );
    if (user.length > 0) {
      const userData = user[0];
      const validPassword = await helpers.matchPassword(
        userpassword,
        userData.contrasena
      );
      if (validPassword) {
        const usuario = {
          id: userData.idUsuario,
          nombre: userData.nombreUsuario,
          rol: userData.nombreRol,
        };
        return usuario;
      }
      throw new Error("Datos Incorrectos");
    }
    throw new Error("Datos Incorrectos");
  }
  // para cambiar contraseña del usuario
  static async updatePass({ id, newPassword }) {
    const [user] = await pool.query(
      "SELECT * FROM usuarios u WHERE u.idUsuario = ?",
      [id]
    );
    if (user.length > 0) {
      const password = await helpers.encryptPassword(newPassword);
      const userUpdate = {
        contrasena: password,
        fechaActualizacion: helpers.formatDate(),
      };
      await pool.query("UPDATE usuarios u set ? WHERE u.idUsuario = ?", [
        userUpdate,
        id,
      ]);
    }
  }
}
