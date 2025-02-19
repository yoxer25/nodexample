import {createPool} from "mysql2/promise";
const configMysql = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "yoxer99",
  database: "bd_grupo_cortez",
};
const pool = createPool(configMysql);
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("LA CONEXIÓN DE LA BASE DE DATOS SE CERRÓ");
      return;
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("LA BASE DE DATOS TIENE MUCHAS CONEXIONES");
      return;
    }
    if (err.code === "ECONNREFUSED") {
      console.error("LA CONEXIÓN A LA BASE DE DATOS FUE RECHAZADA");
      return;
      
    }
  }

  if (connection) connection.release();
  console.log("CONECTADO A LA BASE DE DATOS");
  return;
});

export default pool;
