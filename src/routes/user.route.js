// importamos lo necesario para poder usar las rutas de la página del administrador para el CRUD de categorías
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as usersCtrl from "../controllers/user.controller.js";

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
router.get("/", requireToken, usersCtrl.getUsers);
router.post("/", requireToken, usersCtrl.create);
router.get("/:Id", requireToken, usersCtrl.getUserById);
router.put("/:Id", requireToken, usersCtrl.set);
router.patch("/:Id", requireToken, usersCtrl.set);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;