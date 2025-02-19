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
// para generar el token de usuario
import jwt from "jsonwebtoken";
// para peoder usar todos los métodos HTTP (GET, POST, PUT, DELETE)
import methodOverride from "method-override";
// para conectar con el front
import cors from "cors";
// para especificar en la configuración de las vistas donde se encuentran los helpers
import { helpers } from "./libraries/helpers.js";

// desde la carpeta "routes" todos los archivos para poder establecer las rutas de la web
import homeRoutes from "./routes/home.route.js";
import servicesRoutes from "./routes/services.route.js";
import categoriesRoutes from "./routes/categories.route.js";
import productsRoutes from "./routes/products.route.js";
import loginRoutes from "./routes/login.route.js";
import privateRoutes from "./routes/private/home.route.js";
import priProductsRoutes from "./routes/private/product.route.js";
import priCategoriesRoutes from "./routes/private/categorie.route.js";
import priSalesRoutes from "./routes/private/sale.route.js";
import priShoppingRoutes from "./routes/private/shopping.route.js"

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

app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };
  try {
    const data = jwt.verify(token, "palabrasecreta");
    req.session.user = data;
  } catch (error) {}
  next();
});
app.use(methodOverride("_method"));
app.use(cors());

// rutas de la web
app.use(homeRoutes);
app.use("/servicios", servicesRoutes);
app.use("/categoria", categoriesRoutes);
app.use("/producto", productsRoutes);
app.use("/myaccount", loginRoutes);
app.use("/private", privateRoutes);
app.use("/private/categoria", priCategoriesRoutes);
app.use("/private/producto", priProductsRoutes);
app.use("/private/venta", priSalesRoutes);
app.use("/private/compra", priShoppingRoutes);

// exportamos la constante "app" para poder utilizarla en otras parte del proyecto
export default app;
