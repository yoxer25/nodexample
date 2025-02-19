// para subir archivos a la web
import multer from "multer";

// importamos lo necesario para poder usar las rutas de la página principal
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as productsCtrl from "../../controllers/private/product.controller.js";
const router = Router();

const upload = multer({ dest: "src/archives/" });

// rutas de la página privada de productos
router.get("/", productsCtrl.getProducts);
router.get("/create", productsCtrl.getCreate);
router.post("/importbd", upload.single("excel"), productsCtrl.importBD);
router.post("/create", productsCtrl.create);
router.get("/update/:Id", productsCtrl.getProductById);
router.put("/update/:Id", productsCtrl.updateProductById);
router.delete("/delete/:Id", productsCtrl.deleteProductById);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;