// importamos lo necesario para poder usar las rutas de la página principal
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as shoppingCtrl from "../../controllers/private/shopping.controller.js";
const router = Router();

// rutas de la página privada de compras
router.get("/", shoppingCtrl.getShopping);
router.get("/create", shoppingCtrl.getCreateShopping);
router.post("/create", shoppingCtrl.createShopping);
// router.get("/update/:Id", productstrl.getProductById);
// router.put("/update/:Id", productstrl.updateProductById);
// router.delete("/delete/:Id", productstrl.deleteProductById);
// router.post("/importbd", upload.single("excel"), productstrl.importBD);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;