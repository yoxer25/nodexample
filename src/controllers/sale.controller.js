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
import { Sale } from "../models/sale.model.js";
import { SaleDetail } from "../models/saledetail.model.js";
import { helpers } from "../libraries/helpers.js";
import { Receipt } from "../models/receipt.model.js";

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
    const { customer } = req.body;
    validationInput(customer);
    const sale = JSON.parse(req.body.sale);
    const id = crypto.randomUUID();
    let receipt = await generateCorrelativo();;
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

    doc.fontSize(15).text(`COMPROBANTE: ${sale.comprobante}`, 220, 200);
    doc.fontSize(10).text(`DOCUMENTO_CLIENTE: ${sale.cliente}`, 70, 240);
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

    for (let i = 0; i < saleDetail.length; i++) {
      const element = saleDetail[i];
      const espace = 320 + 20 * i;
      const espace2 = 320 + 20 * saleDetail.length;
      doc.font("Courier").text(`${element.nombreProducto}`, 70, espace);
      doc.font("Courier").text(`${element.cantidad}`, 310, espace);
      doc.font("Courier").text(`${element.precioUnitario}`, 380, espace);
      doc
        .font("Courier")
        .text(`${element.montoTotal}`, 470, espace, { align: "right" });
      doc.font("Courier-Bold").text(`TOTAL A PAGAR: S/.`, 310, espace2);
      doc
        .font("Courier-Bold")
        .text(`${sale.montoPagar}`, 470, espace2, { align: "right" });
    }
    // Finalizar el documento
    doc.end();
  } catch (error) {
    res.redirect("/venta");
  }
};

// función para validar que el usuario llene completamente el formulario de registrar nueva venta
function validationInput(customer) {
  if (customer === "") throw new Error("Todos los campos son obligatorios");
}

// Función para obtener y actualizar el correlativo
const generateCorrelativo = async () => {
  // Primero obtenemos el último correlativo
  const [results] = await Receipt.getReceipts();
  let nuevoCorrelativo = results.ultimoComprobante + 1; // Incrementamos el correlativo

  // Formateamos el correlativo con ceros a la izquierda
  const formattedCorrelativo = `NV-${String(nuevoCorrelativo).padStart(
    4,
    "0"
  )}`;

  // Actualizamos el correlativo en la base de datos
  await Receipt.updateReceipts(nuevoCorrelativo);

  return formattedCorrelativo; // Devolvemos el correlativo formateado
};
