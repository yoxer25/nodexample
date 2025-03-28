// importamos lo necesario para poder usar las rutas de la página del administrador para el CRUD de categorías
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as categoriesCtrl from "../controllers/categorie.controller.js";

/* para proteger nuestras rutas
privadas, se verificará el
token que nos están
enviando a través de las
cookies */
/* si el token es verdadero,
podrá acceder a estas rutas;
caso contrario, no podrá acceder */
import { requireToken } from "../middlewares/requireToken.js";
const router = Router();

// rutas de la prequireToken,ágina privada de categorías
router.get("/", requireToken, categoriesCtrl.getCategories);
router.post("/create", requireToken, categoriesCtrl.create);
router.get("/update/:Id", requireToken, categoriesCtrl.getCategorieById);
router.put("/update/:Id", requireToken, categoriesCtrl.updateCategorieById);
router.delete("/delete/:Id", requireToken, categoriesCtrl.deleteCategorieById);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;
