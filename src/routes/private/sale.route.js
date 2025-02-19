// importamos lo necesario para poder usar las rutas de la página principal
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as salesCtrl from "../../controllers/private/sale.controller.js";
const router = Router();

// rutas de la página privada de ventas
router.get("/", salesCtrl.getSales);
router.get("/create", salesCtrl.getCreateSale);
router.post("/create", salesCtrl.createSale);
// router.get("/update/:Id", productstrl.getProductById);
// router.put("/update/:Id", productstrl.updateProductById);
// router.delete("/delete/:Id", productstrl.deleteProductById);
// router.post("/importbd", upload.single("excel"), productstrl.importBD);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;