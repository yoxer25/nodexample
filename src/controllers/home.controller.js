// importamos el modelo de categorías, producto y ventas
import { Categorie } from "../models/categorie.model.js";
import { Product } from "../models/product.model.js";
import { Sale } from "../models/sale.model.js";
import { Shopping } from "../models/shopping.model.js";
import { User } from "../models/user.model.js";
// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función que muestra lo que se debe mostrar al momento de vistar la página principal
export const getHome = async (req, res) => {
  const user = req.session;
  try {
    const totalCategories = await Categorie.countCategories();
    const totalProducts = await Product.countProducts();
    const totalSales = await Sale.countSales();
    const totalShopping = await Shopping.countShopping();
    res.render("home", {
      user,
      totalCategories,
      totalProducts,
      totalSales,
      totalShopping,
    });
  } catch (error) {
    const msg = error.message;
    res.render("home", { user });
  }
};

// función para mostrar la página de cambiar contraseña
export const getConfig = async (req, res) => {
  res.render("config");
};

// función para cambiar contraseña
export const updatePassword = async (req, res) => {
  const user = req.session;
  const { newPassword } = req.body;
  const id = user.user.id;
  try {
    await User.updatePass({ id, newPassword });
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.redirect("/configuracion");
  }
};
