import { genarateToken } from "../libraries/tokenManager.js";
import { User } from "../models/user.model.js";

/* exportamos todas las funciones para poder llamarlas desde
la carpeta "routes" que tienen todas las rutas de la web */

// controla lo que se debe mostrar al momento de visitar la página del login
export const getSignIn = async (req, res) => {
  res.render("login/login");
};

// función para crear un usuario
/* export const registerUser = async (req, res) => {
  const { username, dni, userpassword } = req.body;
  await formatUser.registerUser(username, dni, userpassword);
}; */


/* función para iniciar sesión, si las credenciales
son correctas, se le genera un token y se le
redirecciona a la página principal */
export const signIn = async (req, res) => {
  const { dni, userpassword } = req.body;
  try {
    const user = await User.login({ dni, userpassword });
    const { token, expiresIn } = genarateToken(user.id, user.nombre);
    res
      .cookie("access_token", token, expiresIn, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // la cookie durará 1h
      })
      .redirect("/");
  } catch (error) {
    console.log(error.message);
    res.redirect("/myaccount/signIn");
  }
};

// función para cerrar sesión
export const logOut = async (req, res) => {
  res.clearCookie("access_token").redirect("/myaccount/signIn");
};
