// importamos la conexión a la base de datos
import pool from "../bd.js";
import { helpers } from "../libraries/helpers.js";
class SchemaUser {
  constructor(id, username, dni) {
    this.idUsuario = id;
    this.nombreUsuario = username;
    this.documento = dni;
  }
}

export class User {
  // para traer el listado de los usuarios
  static async getUsers() {
    const [users] = await pool.query(
      "SELECT u.idUsuario, u.nombreUsuario, u.documento FROM usuarios u WHERE u.estado != 0"
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
      "SELECT u.idUsuario, u.nombreUsuario, u.documento FROM usuarios u WHERE u.estado != 0 AND u.idUsuario = ?",
      [Id]
    );
    if (users) {
      return users;
    } else {
      throw new Error("Datos no encontrados");
    }
  }

  static async set() {
    console.log("");
  }
  /* // para crear un nuevo usuario
  static async registerUser(username, dni, userpassword) {
    const id = await crypto.randomUUID();
    const password = await bcrytp.hash(userpassword, 10);
    const newUser = new SchemaUser(id, username, dni, password, 1);
    console.log(newUser);
    await pool.query("INSERT INTO usuarios SET ?", [newUser]);
    res.redirect("/private");
  } */
  // para iniciar sesión
  static async login({ dni, userpassword }) {
    const [user] = await pool.query(
      "SELECT * FROM usuarios u WHERE u.documento = ? AND u.estado != 0",
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
      const userData = user[0];
      const password = await helpers.encryptPassword(newPassword);
      const userUpdate = new SchemaUser(
        userData.idUsuario,
        userData.nombreUsuario,
        userData.documento
      );
      userUpdate.contrasena = password;
      await pool.query("UPDATE usuarios u set ? WHERE u.idUsuario = ?", [
        userUpdate,
        userData.idUsuario,
      ]);
    }
  }
}
