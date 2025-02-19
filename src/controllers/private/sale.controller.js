//importamos la clase Product para poder usar sus métodos
import { Product } from "../../models/product.model.js";
// para generar id encriptados
import crypto from "crypto";
// importamos el modelo de venta y detalle de venta
import { Sale } from "../../models/sale.model.js";
import { SaleDetail } from "../../models/saledetail.model.js";
// importamos helpers para usar su función de formatear fechas
import { helpers } from "../../libraries/helpers.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todas las ventas existentes en la BD
export const getSales = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      const sales = await Sale.getSales();
      res.render("private/sales/index", { user, sales });
    } catch (error) {
      const msg = error.message;
      res.render("private/sales/index", { user });
    }
  } else {
    res.redirect("/");
  }
};

// función para ver la página de crear nueva venta
export const getCreateSale = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      const products = await Product.getProducts();
      res.render("private/sales/create", { user, products });
    } catch (error) {
      const msg = error.message;
      res.render("private/sales/create");
    }
  } else {
    res.redirect("/");
  }
};

// función para generar una nueva venta
export const createSale = async (req, res) => {
  const user = req.session;
  if (user.user !== null) {
    try {
      //registro de la nueva venta
      const { customer, receipt } = req.body;
      validationInput(customer, receipt);
      const sale = JSON.parse(req.body.sale);
      const id = crypto.randomUUID();
      const created = helpers.formatDate();
      let amountPay = 0;
      sale.map((productSale) => {
        amountPay += productSale.totalPrice;
      });
      const status = 1;
      await Sale.create({
        id,
        customer,
        receipt,
        amountPay,
        created,
        status,
      });
      // recorremos los productos de la lista, para agregarlos en venta_detalle
      sale.map(async (productSale) => {
        const id = crypto.randomUUID();
        const sale = await Sale.SaleId();
        const idSale = sale[0].idVenta;
        const status = 1;
        await SaleDetail.create({
          id,
          idSale,
          idProduct: productSale.idProduct,
          quantity: productSale.quantity,
          unitPrice: productSale.unitPrice,
          totalPrice: productSale.totalPrice,
          status,
        });
      });
      // recorremos los productos de la lista para ir descontando el stock
      sale.map(async (productSale) => {
        const Id = productSale.idProduct;
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
        const status = 1;
        try {
          const quantityForm = Number(productSale.quantity);
          if (quantity >= quantityForm) {
            const stock = quantity - quantityForm;
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
          } else {
            throw new Error("Stock Insuficiente");
          }
        } catch (error) {
          const msg = error.message;
          res.redirect("/private/venta/create");
        }
      });
      res.redirect("/private/venta");
    } catch (error) {
      const msg = error.message;
      res.redirect("/private/venta/create");
    }
  } else {
    res.redirect("/");
  }
};

// función para validar que el usuario llene completamente el formulario de registrar nueva venta
function validationInput(customer, receipt) {
  if (customer === "" || receipt === "")
    throw new Error("Todos los campos son obligatorios");
}
