// importamos las herramientas necesarias para desarrollar toda la web
// framework
import express from "express";
// para las vistas
import { engine } from "express-handlebars";
// para establecer la ruta de los archivos handlebars
import path from "path";
// facilitar la posibilidad de modificar las cookies
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
// para peoder usar todos los métodos HTTP (GET, POST, PUT, DELETE)
import methodOverride from "method-override";
// para especificar en la configuración de las vistas donde se encuentran los helpers
import { helpers } from "./libraries/helpers.js";

// desde la carpeta "routes" todos los archivos para poder establecer las rutas de la web
import myaccountRoutes from "./routes/myaccount.route.js";
import homeRoutes from "./routes/home.route.js";
import categoriesRoutes from "./routes/categorie.route.js";
import productsRoutes from "./routes/product.route.js";
import salesRoutes from "./routes/sale.route.js";
import shoppingRoutes from "./routes/shopping.route.js";
import userRouttes from "./routes/user.route.js";

//constantes
// para iniciar el servidor
const app = express();

// para establecer la ruta hasta la carpeta "src"
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// para especificar que solo se trabajarán con datos soncillos como datos string
app.use(express.urlencoded({ extended: false }));

// estructura para los archivos handlebars donde le especificamos que la extención utilizada para los archivos será ".hbs" y el archivo principal será "main.hbs"
app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: helpers,
  })
);
app.set("view engine", ".hbs");
app.set("views", path.resolve(_dirname + "/views"));

// especificamos la ruta pública
app.use(express.static(path.resolve(_dirname + "/public")));

// para leer datos json
app.use(express.json());
// modificar cookies
app.use(cookieParser());
app.use(methodOverride("_method"));

// rutas de la web
app.use(homeRoutes);
app.use("/myaccount", myaccountRoutes);
app.use("/categoria", categoriesRoutes);
app.use("/producto", productsRoutes);
app.use("/venta", salesRoutes);
app.use("/compra", shoppingRoutes);
app.use("/usuario", userRouttes);

// exportamos la constante "app" para poder utilizarla en otras parte del proyecto
export default app;
