import mysql from "mysql2/promise";

const configMysql = {
  host: process.env.HOSTBD,
  port: process.env.PORTBD,
  user: process.env.USERBD,
  password: process.env.PASSWORDBD,
  database: process.env.NAMEBD,
};
const pool = mysql.createPool(configMysql);

try {
  const connection = await pool.getConnection();
  // ... some query

  if (connection) {
    connection.release();
    console.log("CONECTADO A LA BASE DE DATOS");
  }
} catch (err) {
  console.log(err);
}

export default pool;

