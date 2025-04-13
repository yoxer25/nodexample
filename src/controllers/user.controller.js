// para generar id encriptados
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Rol } from "../models/rol.model.js";
import { helpers } from "../libraries/helpers.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todos los usuarios existentes en la BD
export const getUsers = async (req, res) => {
  const user = req.session;
  try {
    const users = await User.getUsers();
    const roles = await Rol.getRoles();
    res.render("users/index", { user, users, roles });
  } catch (error) {
    res.render("users/index", { user });
  }
};

// función para traer desde la base de datos la información del usuario que se quiere editar
export const getUserById = async (req, res) => {
  const { Id } = req.params;
  const user = req.session;
  try {
    const [users] = await User.getUserById({ Id });
    const roles = await Rol.getSelectRoles({ Id });
    res.render("users/update", { user, users, roles });
  } catch (error) {
    console.log(error.message);
    res.redirect("/usuario");
  }
};

// para crear nuevos usuarios
export const create = async (req, res) => {
  const { nameUser, dni, passwordForm, rol } = req.body;
  try {
    const id = await crypto.randomUUID();
    const password = await helpers.encryptPassword(passwordForm);
    await User.create(id, rol, nameUser, dni, password);
    res.redirect("/usuario");
  } catch (error) {
    res.redirect("/usuario");
  }
};

// para actualizar datos de usuario
export const set = async (req, res) => {
  const { Id } = req.params;
  const { nameUser, dni, rol, _method } = req.body;
  try {
    await User.set(Id, rol, nameUser, dni, _method);
    res.redirect("/usuario");
  } catch (error) {
    res.redirect(`/usuario/${Id}`);
  }
};
