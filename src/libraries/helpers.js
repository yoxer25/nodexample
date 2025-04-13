// importamos day.js para formatear fechas
import dayjs from "dayjs";
// para encriptar y descifrar la contraseña del usuario
import bcrytp from "bcrypt";

// exportamos helpers para poder usar en todo el proyecto
export const helpers = {};

// función para convertir a json el objeto que tenemos en la vista de registrar una nueva venta
helpers.convertJson = (obj) => {
  return JSON.stringify(obj);
};

// función para formatear fecha de creación y actualización al guardar en la base de daros
helpers.formatDate = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

// función para formatear fecha del comprobante en el archivo PDF
helpers.formatDateTime = (dateTime) =>
  dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");

// función para formatear fechas para las vistas
helpers.formatDateView = (date) => dayjs(date).format("YYYY-MM-DD");

//para encriptar las contraseñas
helpers.encryptPassword = async (password) => {
  const salt = await bcrytp.genSalt(10);
  const hash = await bcrytp.hash(password, salt);
  return hash;
};

// para comparar la contraseña que ingresa el user con la que est guardada en la BD
helpers.matchPassword = async (password, savePassword) => {
  return await bcrytp.compare(password, savePassword);
};

/* para verificar poner limitaciones en las vistas
cuando el usuario no es admin */
helpers.eq = (a, b) => a === b;