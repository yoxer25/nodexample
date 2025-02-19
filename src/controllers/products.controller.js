// importamos el modelo categorías y productos
import { Categorie } from "../models/categorie.model.js";
import { Product } from "../models/product.model.js";
// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
export const getProductById = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    res.redirect("/private");
  } else {
    try {
      const { Id } = req.params;
      const categorias = await Categorie.getCategories();
      const productos = await Product.getProductById({ Id });
      res.render("products/products", { productos, categorias });
    } catch (error) {
      const msg = error.message;
      res.render("products/products");
    }
  }
};
