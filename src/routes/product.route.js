// para subir archivos a la web
import multer from "multer";

// importamos lo necesario para poder usar las rutas de la página principal
import { Router } from "express";

// importamos todas las funciones para asignar cada función a una ruta de la web
import * as productsCtrl from "../controllers/product.controller.js";

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

const upload = multer({ dest: "src/archives/" });

// rutas de la página privada de productos
router.get("/", requireToken, productsCtrl.getProducts);
router.get("/create", requireToken, productsCtrl.getCreate);
router.post("/importbd", requireToken, upload.single("excel"), productsCtrl.importBD);
router.post("/create", requireToken, productsCtrl.create);
router.get("/update/:Id", requireToken, productsCtrl.getProductById);
router.put("/update/:Id", requireToken, productsCtrl.updateProductById);
router.delete("/delete/:Id", requireToken, productsCtrl.deleteProductById);

// exportamos la constante "router" para llamarla desde "app.js" que es el archivo donde se configura toda la web
export default router;