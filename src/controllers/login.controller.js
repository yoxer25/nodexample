// importamos el modelo usuario
import { formatUser } from "../models/user.model.js";
// para generar el token de usuario
import jwt from "jsonwebtoken";
// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
export const getLogIn = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    res.redirect("/private");
  } else {
    res.render("login/login");
  }
};
// función para crear un usuario
/* export const registerUser = async (req, res) => {
  const { username, dni, userpassword } = req.body;
  await formatUser.registerUser(username, dni, userpassword);
}; */

export const logIn = async (req, res) => {
  const { dni, userpassword } = req.body;
  try {
    const user = await formatUser.login({ dni, userpassword });
    const token = jwt.sign(
      { id: user.id, nombres: user.nombre },
      "palabrasecreta",
      {
        expiresIn: "1h",
      }
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .redirect("/private");
  } catch (error) {
    const msg = error.message;
    res.render("login/login");
  }
};
