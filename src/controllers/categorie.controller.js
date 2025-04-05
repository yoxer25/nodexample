// importamos el modelo de la categoría
import { Categorie } from "../models/categorie.model.js";

// exportamos todas las funciones para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todas las categorías existentes en la BD
export const getCategories = async (req, res) => {
  const user = req.session;
  try {
    const categories = await Categorie.getCategories();
    res.render("categories/index", { user, categories });
  } catch (error) {
    const msg = error.message;
    res.redirect("/categoria");
  }
};

// función para crear nueva categoría
export const create = async (req, res) => {
  const { nameCategorie } = req.body;
  try {
    validationInput(nameCategorie);
    const data = await Categorie.searchBdCategorie(nameCategorie);
    if (data) {
      throw new Error("Datos ya existen");
    } else {
      await Categorie.create({ nameCategorie });
      res.redirect("/categoria");
    }
  } catch (error) {
    res.redirect("/categoria");
  }
};

// función para traer desde la base de datos la información de la categoría que se quiere editar
export const getCategorieById = async (req, res) => {
  const { Id } = req.params;
  const user = req.session;
  try {
    const categorie = await Categorie.getCategorieById({ Id });
    res.render("categories/update", { user, categorie: categorie[0] });
  } catch (error) {
    res.redirect("/categoria");
  }
};

// función para actualizar la información de la categoría seleccionada
export const updateCategorieById = async (req, res) => {
  const { Id } = req.params;
  const { nameCategorie } = req.body;
  try {
    const data = await Categorie.searchBdCategorie(nameCategorie);
    if (data) {
      if (data.nombreCategoria === nameCategorie && data.idCategoria === Id) {
        await Categorie.updateById({ Id, nameCategorie });
        res.redirect("/categoria");
      }
      if (data.nombreCategoria === nameCategorie && data.idCategoria !== Id) {
        throw new Error("Datos ya existen");
      }
    } else {
      await Categorie.updateById({ Id, nameCategorie });
      res.redirect("/categoria");
    }
  } catch (error) {
    const msg = error.message;
    res.redirect(`/categoria/update/${Id}`);
  }
};

// función para eliminar la información de la categoría seleccionada
export const deleteCategorieById = async (req, res) => {
  const { Id } = req.params;
  await Categorie.deleteById({ Id });
  res.redirect("/categoria");
  try {
  } catch (error) {
    const msg = error.message;
    res.redirect("/categoria");
  }
};

// función para validar que el usuario llene completamente el formulario de crear y actualizar categorías
function validationInput(nameCategorie) {
  if (nameCategorie === "")
    throw new Error("Ingrese un nombre para la categoría");
}
