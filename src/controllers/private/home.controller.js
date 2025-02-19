// importamos el modelo de categorías, producto y ventas
import { Categorie } from "../../models/categorie.model.js";
import { Product } from "../../models/product.model.js";
import { Sale } from "../../models/sale.model.js";
import {Shopping} from "../../models/shopping.model.js"
import { formatUser } from "../../models/user.model.js";
// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función que muestra lo que se debe mostrar al momento de vistar la página principal
export const getHome = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      const totalCategories = await Categorie.countCategories();
      const totalProducts = await Product.countProducts();
      const totalSales = await Sale.countSales();
      const totalShopping = await Shopping.countShopping();
      res.render("private/home", { user, totalCategories, totalProducts, totalSales, totalShopping });
    } catch (error) {
      const msg = error.message;
      res.render("private/home", { user });
    }
  } else {
    res.redirect("/");
  }
};

// función para mostrar la página de cambiar contraseña
export const getConfig = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      res.render("private/config", { user });
    } catch (error) {
      const msg = error.message;
      res.render("private/home", { user });
    }
  } else {
    res.redirect("/");
  }
};

// función para cambiar contraseña
export const updatePassword = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    const { newPassword } = req.body;
    const id = user.user.id;
    try {
      await formatUser.updatePass({ id, newPassword });
      res.redirect("/private");
    } catch (error) {
      const msg = error.message;
      res.render("private/home", { user });
    }
  } else {
    res.redirect("/");
  }
};

// función para cerrar sesión
export const logOut = async (req, res) => {
  res.clearCookie("access_token").redirect("/");
};
