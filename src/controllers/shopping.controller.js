//importamos la clase Product para poder usar sus métodos
import { Product } from "../models/product.model.js";
// para generar PDF
import PDFDocument from "pdfkit";
// para ver la ruta del logo para el comprobante
import path from "path";
import { fileURLToPath } from "url";
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
    let amountPay = 0;
    shopping.map((productShopping) => {
      amountPay += productShopping.totalPrice;
    });
    await Shopping.create({
      id,
      customer,
      receipt,
      amountPay,
      receiptDate,
    });
    // recorremos los productos de la lista, para agregarlos en compra_detalle
    shopping.map(async (productShopping) => {
      const id = crypto.randomUUID();
      const shopping = await Shopping.ShoppingId();
      const idShopping = shopping[0].idCompra;
      await ShoppingDetail.create({
        id,
        idShopping,
        idProduct: productShopping.idProduct,
        quantity: productShopping.quantity,
        unitPrice: productShopping.unitPrice,
        totalPrice: productShopping.totalPrice,
      });
    });
    // recorremos los productos de la lista para ir aumentando el stock
    shopping.map(async (productShopping) => {
      const Id = productShopping.idProduct;
      const product = await Product.getProductById({ Id });
      const categorie = product[0].idCategoria;
      const nameProduct = product[0].nombreProducto;
      const brand = product[0].marca;
      const priceUnit = product[0].precio_unitario;
      const priceWholesale = product[0].precio_mayor;
      const quantity = product[0].stock;
      const quantityForm = Number(productShopping.quantity);
      const stock = quantity + quantityForm;
      await Product.updateById({
        Id,
        categorie,
        nameProduct,
        brand,
        priceUnit,
        priceWholesale,
        stock,
      });
    });
    res.redirect("/compra");
  } catch (error) {
    res.redirect("/compra/create");
  }
};

// función para ver el comprobante de la venta
export const viewShopping = async (req, res) => {
  const { Id } = req.params;
  try {
    const [shopping] = await Shopping.getShoppingById({ Id });
    const dateTime = helpers.formatDateView(shopping.fechaComprobante);
    const shoppingDetail = await ShoppingDetail.getShoppingDetail({ Id });
    // Crear un documento PDF
    const doc = new PDFDocument();

    // Configurar las cabeceras para que el navegador lo muestre como PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Comprobante_${shopping.comprobante}.pdf"`
    );

    // Pasa el stream del documento PDF directamente a la respuesta
    doc.pipe(res);

    // para establecer la ruta hasta la carpeta "src"
    const _filename = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_filename);

    // Agregar contenido al PDF
    // Ruta de la imagen a agregar (puedes cambiarla a la ruta local o url que prefieras)
    const imagePath = path.resolve(
      _dirname + "../../public/assets/img/logo.jpg"
    );
    // Agregar la imagen al PDF (esto va a la posición 100, 150 en el PDF)
    doc.image(imagePath, {
      fit: [100, 100], // Ajusta el tamaño de la imagen
      align: "center", // Alineación
    });
    doc
      .fontSize(15)
      .font("Courier-Bold")
      .text(`CABSAN CORPORATION E.I.R.L.`, 220, 90);
    doc.fontSize(15).font("Courier").text(`Construcción y diseño`, 240, 115);
    doc.fontSize(15).text(`Venta de materiales en general`, 200, 130);

    doc.fontSize(15).text(`COMPROBANTE: ${shopping.comprobante}`, 220, 200);
    doc.fontSize(10).text(`DOCUMENTO_CLIENTE: ${shopping.cliente}`, 70, 240);
    doc.text(`FECHA: ${dateTime}`, 70, 260);
    doc.text(`PRODUCTO`, 70, 300);
    doc.text(`CANTIDAD`, 310, 300);
    doc.text(`PRECIO(u)`, 380, 300);
    doc.text(`PRECIO(t)`, 470, 300, { align: "right" });
    doc.text(
      `______________________________________________________________________________`,
      70,
      303
    );

    for (let i = 0; i < shoppingDetail.length; i++) {
      const element = shoppingDetail[i];
      const espace = 320 + 20 * i;
      const espace2 = 320 + 20 * shoppingDetail.length;
      doc.font("Courier").text(`${element.nombreProducto}`, 70, espace);
      doc.font("Courier").text(`${element.cantidad}`, 310, espace);
      doc.font("Courier").text(`${element.precioUnitario}`, 380, espace);
      doc
        .font("Courier")
        .text(`${element.montoTotal}`, 470, espace, { align: "right" });
      doc.font("Courier-Bold").text(`TOTAL A PAGAR: S/.`, 310, espace2);
      doc
        .font("Courier-Bold")
        .text(`${shopping.montoPagar}`, 470, espace2, { align: "right" });
    }
    // Finalizar el documento
    doc.end();
  } catch (error) {
    res.redirect("/venta");
  }
};

// función para validar que el usuario llene completamente el formulario de registrar nueva compra
function validationInput(customer, receipt, receiptDate) {
  if (customer === "" || receipt === "" || receiptDate === "")
    throw new Error("Todos los campos son obligatorios");
}
