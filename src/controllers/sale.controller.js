//importamos la clase Product para poder usar sus métodos
import { Product } from "../models/product.model.js";
// para generar PDF
import PDFDocument from "pdfkit";
// para generar id encriptados
import crypto from "crypto";
// importamos el modelo de venta y detalle de venta
import { Sale } from "../models/sale.model.js";
import { SaleDetail } from "../models/saledetail.model.js";
import { helpers } from "../libraries/helpers.js";

// exportamos todas las constantes para poder llamarlas desde la carpeta "routes" que tienen todas las rutas de la web
// función para mostrar en el panel del administrador todas las ventas existentes en la BD
export const getSales = async (req, res) => {
  const user = req.session;
  try {
    const sales = await Sale.getSales();
    res.render("sales/index", { user, sales });
  } catch (error) {
    res.render("sales/index", { user });
  }
};

// función para ver la página de crear nueva venta
export const getCreateSale = async (req, res) => {
  const user = req.session;
  try {
    const products = await Product.getProducts();
    res.render("sales/create", { user, products });
  } catch (error) {
    res.render("sales/create", { user });
  }
};

// función para generar una nueva venta
export const createSale = async (req, res) => {
  try {
    //registro de la nueva venta
    const { customer, receipt } = req.body;
    validationInput(customer, receipt);
    const sale = JSON.parse(req.body.sale);
    const id = crypto.randomUUID();
    let amountPay = 0;
    sale.map((productSale) => {
      amountPay += productSale.totalPrice;
    });
    await Sale.create({
      id,
      customer,
      receipt,
      amountPay,
    });
    // recorremos los productos de la lista, para agregarlos en venta_detalle
    sale.map(async (productSale) => {
      const id = crypto.randomUUID();
      const sale = await Sale.SaleId();
      const idSale = sale[0].idVenta;
      await SaleDetail.create({
        id,
        idSale,
        idProduct: productSale.idProduct,
        quantity: productSale.quantity,
        unitPrice: productSale.unitPrice,
        totalPrice: productSale.totalPrice,
      });
    });
    // recorremos los productos de la lista para ir descontando el stock
    sale.map(async (productSale) => {
      const Id = productSale.idProduct;
      const product = await Product.getProductById({ Id });
      const categorie = product[0].idCategoria;
      const nameProduct = product[0].nombreProducto;
      const brand = product[0].marca;
      const priceUnit = product[0].precio_unitario;
      const priceWholesale = product[0].precio_mayor;
      const quantity = product[0].stock;
      try {
        const quantityForm = Number(productSale.quantity);
        if (quantity >= quantityForm) {
          const stock = quantity - quantityForm;
          await Product.updateById({
            Id,
            categorie,
            nameProduct,
            brand,
            priceUnit,
            priceWholesale,
            stock,
          });
        } else {
          throw new Error("Stock Insuficiente");
        }
      } catch (error) {
        res.redirect("/venta/create");
      }
    });
    res.redirect("/venta");
  } catch (error) {
    res.redirect("/venta/create");
  }
};

// función para ver el comprobante de la venta
export const viewSale = async (req, res) => {
  const { Id } = req.params;
  try {
    const [sale] = await Sale.getSaleById({ Id });
    const dateTime = helpers.formatDateTime(sale.fechaCreacion);
    const saleDetail = await SaleDetail.getSaleDetail({ Id });
    // Crear un documento PDF
    const doc = new PDFDocument();

    // Configurar las cabeceras para que el navegador lo muestre como PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Comprobante_${sale.comprobante}.pdf"`
    );

    // Pasa el stream del documento PDF directamente a la respuesta
    doc.pipe(res);

    // Agregar contenido al PDF
    doc
      .fontSize(15)
      .text(`COMPROBANTE: ${sale.comprobante}`, { align: "center" });
    doc.fontSize(10).text(`DOCUMENTO_CLIENTE: ${sale.cliente}`, 50, 140);
    doc.text(`FECHA: ${dateTime}`, 50, 170);
    doc.text(`---------------------------------------------------`, 50, 200);
    doc.text(`PRODUCTO`, 50, 230);
    doc.text(`CANTIDAD`, 310, 230);
    doc.text(`PRECIO(u)`, 380, 230);
    doc.text(`PRECIO(t)`, 470, 230);
    doc.text(
      `________________________________________________________________________________________`,
      50,
      233
    );

    for (let i = 0; i < saleDetail.length; i++) {
      const element = saleDetail[i];
      const espace = 250 + 20 * i;
      const espace2 = 250 + 20 * saleDetail.length;
      doc.text(`${element.nombreProducto}`, 50, espace);
      doc.text(`${element.cantidad}`, 310, espace);
      doc.text(`S/. ${element.precioUnitario}`, 380, espace);
      doc.text(`S/. ${element.montoTotal}`, 470, espace);
      doc.text(`TOTAL A PAGAR:`, 380, espace2);
      doc.text(`S/. ${sale.montoPagar}`, 470, espace2);
    }
    // Finalizar el documento
    doc.end();
  } catch (error) {
    res.redirect("/venta");
  }
};

// función para validar que el usuario llene completamente el formulario de registrar nueva venta
function validationInput(customer, receipt) {
  if (customer === "" || receipt === "")
    throw new Error("Todos los campos son obligatorios");
}
