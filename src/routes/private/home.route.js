// importamos lo necesario para poder usar las rutas de la página principal
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as homeCtrl from "../../controllers/private/home.controller.js";
const router = Router();

// rutas de la página principal
router.get("/", homeCtrl.getHome);
router.get("/configuracion", homeCtrl.getConfig);
router.post("/configuracion", homeCtrl.updatePassword);
router.get("/LogOut", homeCtrl.logOut);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;