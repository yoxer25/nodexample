// importamos lo necesario para poder usar las rutas de la página de servicios
import { Router } from "express";
const router = Router();

import * as servicesCtrl from "../controllers/services.controller.js";

router.get('/', servicesCtrl.getServices)

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;