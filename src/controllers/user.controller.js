// para generar id encriptados
import crypto from "crypto";
import { User } from "../models/user.model.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todos los usuarios existentes en la BD
export const getUsers = async (req, res) => {
  const user = req.session;
  try {
    const users = await User.getUsers();
    res.render("users/index", { user, users });
  } catch (error) {
    console.log(error.message);
    res.render("users/index", { user });
  }
};

// función para traer desde la base de datos la información del usuario que se quiere editar
export const getUserById = async (req, res) => {
  const { Id } = req.params;
  const user = req.session;
  try {
    const [users] = await User.getUserById({ Id });
    res.render("users/update", { user, users });
  } catch (error) {
    res.redirect("/usuario");
  }
};

// para crear nuevos usuarios
export const create = (req, res) => {
  const { nameUser, dni, passwordForm } = req.body;
};

// para actualizar datos de usuario
export const set = (req, res) => {
  const { Id } = req.params;
  const { nameUser, dni, _method } = req.body;
};
