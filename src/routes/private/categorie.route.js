// importamos lo necesario para poder usar las rutas de la página del administrador para el CRUD de categorías
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as categoriesCtrl from "../../controllers/private/categorie.controller.js";
const router = Router();

// rutas de la página privada de categorías
router.get("/", categoriesCtrl.getCategories);
router.post("/create", categoriesCtrl.create);
router.get("/update/:Id", categoriesCtrl.getCategorieById);
router.put("/update/:Id", categoriesCtrl.updateCategorieById);
router.delete("/delete/:Id", categoriesCtrl.deleteCategorieById);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;
