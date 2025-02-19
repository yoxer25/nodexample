// importamos lo necesario para poder usar las rutas de la página que muestra toda la información del producto que se seleccione
import { Router } from "express";
const router = Router();

import * as productsCtrl from "../controllers/products.controller.js";

router.get('/:Id', productsCtrl.getProductById)

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;