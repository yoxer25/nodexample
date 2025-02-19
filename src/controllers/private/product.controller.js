// para generar id encriptados
import crypto from "crypto";
// para cambiar nombre del excel a guardar
import fs from "node:fs";
// importamos el módulo "xlsx-populate" para poder leer archivos .xlsx
import xlsxPopulate from "xlsx-populate";
// importamos el modelo del producto y categoría
import { Product } from "../../models/product.model.js";
import { Categorie } from "../../models/categorie.model.js";

// para formatear fechas
import { helpers } from "../../libraries/helpers.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todos los productos existentes en la BD
export const getProducts = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      const products = await Product.getProducts();
      res.render("private/products/index", { user, products });
    } catch (error) {
      const msg = error.message;
      res.render("private/products/index", { user });
    }
  } else {
    res.redirect("/");
  }
};

// función para mostrar la página de crear un nuevo producto
export const getCreate = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      const { Id } = req.params;
      const categorie = await Categorie.getCategories({ Id });
      res.render("private/products/create", { user, categorie });
    } catch (error) {
      const msg = error.message;
      res.render("private/products/create", { user, categorie });
    }
  } else {
    res.redirect("/");
  }
};

// función para crear nuevo producto
export const create = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    const { nameProduct, brand, price, stock, categorie, image, detail } =
      req.body;
    try {
      validationInput(
        nameProduct,
        brand,
        price,
        stock,
        categorie,
        image,
        detail
      );
      const data = await Product.searchBdProduct(nameProduct);
      if (data) {
        throw new Error("Datos ya existen");
      } else {
        const id = crypto.randomUUID();
        const created = helpers.formatDate();
        const updated = null;
        const status = 1;
        await Product.create({
          id,
          categorie,
          nameProduct,
          brand,
          detail,
          price,
          stock,
          image,
          created,
          updated,
          status,
        });
      }
      res.redirect("/private/producto");
    } catch (error) {
      const msg = error.message;
      console.log(msg);
      res.redirect("/private/producto/create");
    }
  } else {
    res.redirect("/");
  }
};

// función para traer desde la base de datos la información del producto que se quiere editar
export const getProductById = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    const { Id } = req.params;
    try {
      const product = await Product.getProductById({ Id });
      const categorie = await Categorie.getSelectCategories({ Id });
      res.render("private/products/update", {
        user,
        product: product[0],
        categorie,
      });
    } catch (error) {
      const msg = error.message;
      res.redirect("/private/producto");
    }
  } else {
    res.redirect("/");
  }
};

// función para actualizar la información del producto seleccionado
export const updateProductById = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    const { Id } = req.params;
    const { nameProduct, brand, price, stock, categorie, image, detail } =
      req.body;
    try {
      validationInput(
        nameProduct,
        brand,
        price,
        stock,
        categorie,
        image,
        detail
      );
      const data = await Product.searchBdProduct(nameProduct);
      if (data) {
        if (nameProduct === data.nombreProducto && Id === data.idProducto) {
          const [createdDate] = await Product.getProductById({ Id });
          const created = createdDate.fechaCreacion;
          const updated = helpers.formatDate();
          const status = 1;
          await Product.updateById({
            Id,
            categorie,
            nameProduct,
            brand,
            detail,
            price,
            stock,
            image,
            created,
            updated,
            status,
          });
          res.redirect("/private/producto");
        }
        if (nameProduct === data.nombreProducto && Id !== data.idProducto) {
          throw new Error("Datos ya existen");
        }
      } else {
        const [createdDate] = await Product.getProductById({ Id });
        const created = createdDate.fechaCreacion;
        const updated = helpers.formatDate();
        const status = 1;
        await Product.updateById({
          Id,
          categorie,
          nameProduct,
          brand,
          detail,
          price,
          stock,
          image,
          created,
          updated,
          status,
        });
        res.redirect("/private/producto");
      }
    } catch (error) {
      const msg = error.message;
      res.redirect(`/private/producto/update/${Id}`);
    }
  } else {
    res.redirect("/");
  }
};

// función para eliminar la información del producto seleccionado
export const deleteProductById = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    const { Id } = req.params;
    try {
      const [product] = await Product.getProductById({ Id });
      const categorie = product.idCategoria;
      const nameProduct = product.nombreProducto;
      const brand = product.marca;
      const detail = product.detalle;
      const price = product.precio;
      const stock = product.stock;
      const image = product.imagen;
      const created = product.fechaCreacion;
      const updated = helpers.formatDate();
      const status = 0;
      await Product.deleteById({
        Id,
        categorie,
        nameProduct,
        brand,
        detail,
        price,
        stock,
        image,
        created,
        updated,
        status,
      });
      res.redirect("/private/producto");
    } catch (error) {
      const msg = error.message;
      res.redirect("/private/producto");
    }
  } else {
    res.redirect("/");
  }
};

// fucnión que permite importar la información del excel a la base datos
export const importBD = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
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
            const detail = listProduct[3];
            const price = listProduct[4];
            const stock = listProduct[5];
            const image = listProduct[6];
            // hacemos otro for para insertar producto por producto en la base de datos
            for (let j = 0; j < nameProduct.length; j++) {
              // traemos desde la base de datos el id de la categoria que tiene nuestro producto y lo guardamos en una constante
              const consultaId = await Categorie.searchBdCategorie(
                nameCategorie
              );
              // si la categoría existe en la BD, registramos el producto
              if (consultaId) {
                // creamos una constante para acceder especificamente al idcategoria(contiene el valor del id)
                const categorie = consultaId.idCategoria;
                const id = crypto.randomUUID();
                const created = helpers.formatDate();
                const updated = null;
                const status = 1;
                await Product.create({
                  id,
                  categorie,
                  nameProduct,
                  brand,
                  detail,
                  price,
                  stock,
                  image,
                  created,
                  updated,
                  status,
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
          res.redirect("/private/producto");
        } else {
          res.redirect("/private/producto");
          throw new Error("Seleccione un archivo .xlsx");
        }
      } else {
        res.redirect("/private/producto");
        throw new Error("Seleccione un archivo .xlsx");
      }
    } catch (error) {
      const msg = error.message;
      console.log(msg);
      res.redirect("/private/producto");
    }
  } else {
    res.redirect("/");
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
  price,
  stock,
  categorie,
  image,
  detail
) {
  if (
    nameProduct === "" ||
    brand === "" ||
    price === "" ||
    stock === "" ||
    categorie === "" ||
    image === "" ||
    detail === ""
  )
    throw new Error("Todos los campos son obligatorios");
}
