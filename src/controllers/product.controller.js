// para generar id encriptados
import crypto from "crypto";
// para cambiar nombre del excel a guardar
import fs from "node:fs";
// importamos el módulo "xlsx-populate" para poder leer archivos .xlsx
import xlsxPopulate from "xlsx-populate";
// importamos el modelo del producto y categoría
import { Product } from "../models/product.model.js";
import { Categorie } from "../models/categorie.model.js";

// para formatear fechas
import { helpers } from "../libraries/helpers.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todos los productos existentes en la BD
export const getProducts = async (req, res) => {
  const user = req.session;
  try {
    const products = await Product.getProducts();
    res.render("products/index", { user, products });
  } catch (error) {
    const msg = error.message;
    res.render("products/index", { user });
  }
};

// función para mostrar la página de crear un nuevo producto
export const getCreate = async (req, res) => {
  const user = req.session;
  try {
    const { Id } = req.params;
    const categorie = await Categorie.getCategories({ Id });
    res.render("products/create", { user, categorie });
  } catch (error) {
    res.render("products/create", { user });
  }
};

// función para crear nuevo producto
export const create = async (req, res) => {
  const { nameProduct, brand, priceUnit, priceWholesale, stock, categorie } =
    req.body;
  try {
    validationInput(
      nameProduct,
      brand,
      priceUnit,
      priceWholesale,
      stock,
      categorie
    );
    const data = await Product.searchBdProduct(nameProduct);
    if (data) {
      throw new Error("Datos ya existen");
    } else {
      const id = crypto.randomUUID();
      await Product.create({
        id,
        categorie,
        nameProduct,
        brand,
        priceUnit: parseFloat(priceUnit),
        priceWholesale: parseFloat(priceWholesale),
        stock,
      });
    }
    res.redirect("/producto");
  } catch (error) {
    res.redirect("/producto/create");
  }
};

// función para traer desde la base de datos la información del producto que se quiere editar
export const getProductById = async (req, res) => {
  const { Id } = req.params;
  const user = req.session;
  try {
    const product = await Product.getProductById({ Id });
    const categorie = await Categorie.getSelectCategories({ Id });
    res.render("products/update", { user, product: product[0], categorie });
  } catch (error) {
    const msg = error.message;
    res.redirect("/producto");
  }
};

// función para actualizar la información del producto seleccionado
export const updateProductById = async (req, res) => {
  const { Id } = req.params;
  const { nameProduct, brand, priceUnit, priceWholesale, stock, categorie } =
    req.body;
  try {
    validationInput(
      nameProduct,
      brand,
      priceUnit,
      priceWholesale,
      stock,
      categorie
    );
    const data = await Product.searchBdProduct(nameProduct);
    if (data) {
      if (nameProduct === data.nombreProducto && Id === data.idProducto) {
        await Product.updateById({
          Id,
          categorie,
          nameProduct,
          brand,
          priceUnit: parseFloat(priceUnit),
          priceWholesale: parseFloat(priceWholesale),
          stock,
        });
        res.redirect("/producto");
      }
      if (nameProduct === data.nombreProducto && Id !== data.idProducto) {
        throw new Error("Datos ya existen");
      }
    } else {
      await Product.updateById({
        Id,
        categorie,
        nameProduct,
        brand,
        priceUnit: parseFloat(priceUnit),
        priceWholesale: parseFloat(priceWholesale),
        stock,
      });
      res.redirect("/producto");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect(`/producto/update/${Id}`);
  }
};

// función para eliminar la información del producto seleccionado
export const deleteProductById = async (req, res) => {
  const { Id } = req.params;
  try {
    const [product] = await Product.getProductById({ Id });
    const categorie = product.idCategoria;
    const nameProduct = product.nombreProducto;
    const brand = product.marca;
    const priceUnit = product.precio_unitario;
    const priceWholesale = product.precio_mayor;
    const stock = product.stock;
    await Product.deleteById({
      Id,
      categorie,
      nameProduct,
      brand,
      priceUnit: parseFloat(priceUnit),
      priceWholesale: parseFloat(priceWholesale),
      stock,
    });
    res.redirect("/producto");
  } catch (error) {
    res.redirect("/producto");
  }
};

// fucnión que permite importar la información del excel a la base datos
export const importBD = async (req, res) => {
  try {
    if (req.file) {
      const { mimetype } = req.file;
      if (
        mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        saveExcel(req.file);
        // especificamos el archivo excel que vamos a leer
        const workBook = await xlsxPopulate.fromFileAsync(
          "./src/archives/productos.xlsx"
        );
        // constante que contiene todos los datos de una hoja del excel
        const value = workBook.sheet("Hoja1").usedRange().value();
        // hacemos un for al resultado del excel para ir recorriendo dato por dato y guardarlo en la base de datos
        for (let i = 1; i < value.length; i++) {
          // constante que almacena un objeto con los datos de un solo producto
          const listProduct = value[i];
          // creamos constantes para almacenar los datos de cada columna del excel
          const nameProduct = listProduct[0];
          const brand = listProduct[1];
          const nameCategorie = listProduct[2];
          const priceUnit = listProduct[3];
          const priceWholesale = listProduct[4];
          const stock = listProduct[5];
          // hacemos otro for para insertar producto por producto en la base de datos
          for (let j = 0; j < nameProduct.length; j++) {
            // traemos desde la base de datos el id de la categoria que tiene nuestro producto y lo guardamos en una constante
            const consultaId = await Categorie.searchBdCategorie(nameCategorie);
            // si la categoría existe en la BD, registramos el producto
            if (consultaId) {
              // creamos una constante para acceder especificamente al idcategoria(contiene el valor del id)
              const categorie = consultaId.idCategoria;
              const id = crypto.randomUUID();
              await Product.create({
                id,
                categorie,
                nameProduct,
                brand,
                priceUnit: parseFloat(priceUnit),
                priceWholesale: parseFloat(priceWholesale),        
                stock,
              });
              // se le especifica que cuando termine de insertar el producto, se detenga y salga del bucle
              break;
            }
            // si la categoría no existe en la BD, se crea, y luego regresa a agregar el producto
            else {
              await Categorie.create({ nameCategorie });
              // se le especifica que debe continuar el bucle y pasar a registrar el producto
              continue;
            }
          }
          // se le especifica que debe continuar el bucle y pasar a registrar el siguiente producto
          continue;
        }
        res.redirect("/producto");
      } else {
        throw new Error("Seleccione un archivo .xlsx");
      }
    } else {
      throw new Error("Seleccione un archivo .xlsx");
    }
  } catch (error) {
    res.redirect("/producto");
  }
};

// función para que el excel subido se guarde con su nombre original dentro de la carpeta "src/archives"
function saveExcel(file) {
  try {
    const newPath = `./src/archives/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
  } catch (error) {
    const msg = error.message;
  }
}

// función para validar que el usuario llene completamente el formulario de crear y actualizar productos
function validationInput(
  nameProduct,
  brand,
  priceUnit,
  priceWholesale,
  stock,
  categorie
) {
  if (
    nameProduct === "" ||
    brand === "" ||
    priceUnit === "" ||
    priceWholesale === "" ||
    stock === "" ||
    categorie === ""
  )
    throw new Error("Todos los campos son obligatorios");
}