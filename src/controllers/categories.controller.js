// importamos los modelos de categorías y productos
import { Categorie } from "../models/categorie.model.js";
import { Product } from "../models/product.model.js";
// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
export const getCategories = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    res.redirect("/private");
  } else {
    try {
      const { Id } = req.params;
      const categorias = await Categorie.getCategories();
      const productos = await Product.getProductsByCategorie({ Id });
      res.render("categories/categories", { productos, categorias });
    } catch (error) {
      const msg = error.message;
      res.render("categories/categories");
    }
  }
};
