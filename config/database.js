const mysql = require('mysql2');
require('dotenv').config();

const connectionUrl = process.env.DB_URL;

const pool = mysql.createPool(connectionUrl);

function obtenerConexion() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('La conexión con la base de datos se cerró.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('La base de datos tiene demasiadas conexiones.');
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('La conexión a la base de datos fue rechazada.');
        }
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

async function ejecutarConsulta(query, params) {
  try {
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
  } catch (err) {
    console.error('Error al obtener conexión:', err);
    throw err;
  }
}

module.exports = {
  ejecutarConsulta,
  pool
};