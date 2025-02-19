// importamos el modelo categorías
import { Categorie } from "../models/categorie.model.js";
// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
export const getServices = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    res.redirect("/private");
  } else {
    try {
      const categorias = await Categorie.getCategories();
      res.render("services/services", { categorias });
    } catch (error) {
      const msg = error.message;
      res.render("services/services");
    }
  }
};
