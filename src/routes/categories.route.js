// importamos lo necesario para poder usar las rutas de la página que muestra los productos de una categoría
import { Router } from "express";
const router = Router();

import * as categoriesCtrl from "../controllers/categories.controller.js";

router.get('/:Id', categoriesCtrl.getCategories)

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;