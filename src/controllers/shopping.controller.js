//importamos la clase Product para poder usar sus métodos
import { Product } from "../models/product.model.js";
// para generar id encriptados
import crypto from "crypto";
// importamos el modelo de venta y detalle de venta
import { Shopping } from "../models/shopping.model.js";
import { ShoppingDetail } from "../models/shoppingdetail.model.js";
// importamos helpers para usar su función de formatear fechas
import { helpers } from "../libraries/helpers.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todas las compras existentes en la BD
export const getShopping = async (req, res) => {
  const user = req.session;
  try {
    const shopping = await Shopping.getShopping();
    res.render("shopping/index", { user, shopping });
  } catch (error) {
    const msg = error.message;
    res.render("shopping/index", { user });
  }
};

// función para ver la página de crear nueva compra
export const getCreateShopping = async (req, res) => {
  const user = req.session;
  try {
    const products = await Product.getProducts();
    res.render("shopping/create", { user, products });
  } catch (error) {
    const msg = error.message;
    res.render("shopping/create", { user });
  }
};

// función para generar una nueva compra
export const createShopping = async (req, res) => {
  try {
    //registro de la nueva compra
    const { customer, receipt, receiptDate } = req.body;
    validationInput(customer, receipt, receiptDate);
    const shopping = JSON.parse(req.body.shopping);
    const id = crypto.randomUUID();
    const created = helpers.formatDate();
    let amountPay = 0;
    shopping.map((productShopping) => {
      amountPay += productShopping.totalPrice;
    });
    const status = 1;
    await Shopping.create({
      id,
      customer,
      receipt,
      amountPay,
      receiptDate,
      created,
      status,
    });
    // recorremos los productos de la lista, para agregarlos en compra_detalle
    shopping.map(async (productShopping) => {
      const id = crypto.randomUUID();
      const shopping = await Shopping.ShoppingId();
      const idShopping = shopping[0].idCompra;
      const status = 1;
      await ShoppingDetail.create({
        id,
        idShopping,
        idProduct: productShopping.idProduct,
        quantity: productShopping.quantity,
        unitPrice: productShopping.unitPrice,
        totalPrice: productShopping.totalPrice,
        status,
      });
    });
    // recorremos los productos de la lista para ir aumentando el stock
    shopping.map(async (productShopping) => {
      const Id = productShopping.idProduct;
      const product = await Product.getProductById({ Id });
      const categorie = product[0].idCategoria;
      const nameProduct = product[0].nombreProducto;
      const brand = product[0].marca;
      const detail = product[0].detalle;
      const price = product[0].precio;
      const quantity = product[0].stock;
      const image = product[0].imagen;
      const created = product[0].fechaCreacion;
      const updated = helpers.formatDate();
      const quantityForm = Number(productShopping.quantity);
      const status = 1;
      const stock = quantity + quantityForm;
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
    });
    res.redirect("/compra");
  } catch (error) {
    const msg = error.message;
    console.log(msg);
    res.redirect("/compra/create");
  }
};

// función para validar que el usuario llene completamente el formulario de registrar nueva compra
function validationInput(customer, receipt, receiptDate) {
  if (customer === "" || receipt === "" || receiptDate === "")
    throw new Error("Todos los campos son obligatorios");
}
