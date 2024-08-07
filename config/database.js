const mysql = require('mysql2');
require('dotenv').config();

const connectionUrl = process.env.DB_URL;

const pool = mysql.createPool(connectionUrl);

function obtenerConexion() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

async function ejecutarConsulta(query, params) {
  const connection = await obtenerConexion();
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      connection.release();
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  ejecutarConsulta,
  pool
};