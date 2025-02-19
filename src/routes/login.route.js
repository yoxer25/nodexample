// importamos lo necesario para poder usar las rutas de la página principal
import { Router } from "express";
const router = Router();

import * as loginCtrl from "../controllers/login.controller.js";

router.get("/LogIn", loginCtrl.getLogIn);
// router.post('/LogIn', loginCtrl.registerUser)
router.post("/LogIn", loginCtrl.logIn);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;