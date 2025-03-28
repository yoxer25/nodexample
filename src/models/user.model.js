// importamos la conexión a la base de datos
import pool from "../bd.js";
import { helpers } from "../libraries/helpers.js";
class SchemaUser {
  constructor(id, username, dni, userpassword, estado) {
    this.idUsuario = id;
    this.nombreUsuario = username;
    this.documento = dni;
    this.contrasena = userpassword;
    this.estado = estado;
  }
}

export class User {
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
      "SELECT * FROM usuarios u WHERE u.documento = ?",
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
        userData.documento,
        password,
        userData.estado
      );
      await pool.query("UPDATE usuarios u set ? WHERE u.idUsuario = ?", [
        userUpdate,
        userData.idUsuario,
      ]);
    }
  }
}
