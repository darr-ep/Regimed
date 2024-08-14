const mysql = require('mysql2');
require('dotenv').config();

const connectionUrl = process.env.DB_URL;

const pool = mysql.createPool({
  uri: connectionUrl,
  connectionLimit: 15,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0
});

function obtenerConexion() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('La conexión con la base de datos se cerró.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('La base de datos tiene demasiadas conexiones.');
        } else if (err.code === 'ECONNREFUSED') {
          console.error('La conexión a la base de datos fue rechazada.');
        } else if (err.code === 'ECONNRESET') {
          console.error('La conexión fue reiniciada. Reintentando...');
          setTimeout(() => obtenerConexion().then(resolve).catch(reject), 2000);
          return;
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
    let connection = await obtenerConexion();
    
    return new Promise((resolve, reject) => {
      const intentarConsulta = () => {
        connection.query(query, params, (err, results) => {
          if (err) {
            if (err.code === 'ECONNRESET') {
              console.error('La conexión fue reiniciada. Reintentando...');
              setTimeout(async () => {
                try {
                  connection = await obtenerConexion(); // Obtener una nueva conexión
                  intentarConsulta(); // Reintentar la consulta
                } catch (err) {
                  reject(err); // Si falla obtener la nueva conexión, rechaza la promesa
                }
              }, 2000);
              return;
            }
            connection.release(); // Libera la conexión antes de rechazar en caso de otro error
            reject(err);
          } else {
            connection.release(); // Libera la conexión en caso de éxito
            resolve(results);
          }
        });
      };
      
      intentarConsulta(); // Ejecuta la consulta por primera vez
    });
  } catch (err) {
    console.error('Error al obtener conexión:', err);
    throw err;
  }
}

setInterval(() => {
  pool.query('SELECT 1', (err) => {
    if (err) console.error('Error manteniendo la conexión activa:', err);
  });
}, 5000);

module.exports = {
  ejecutarConsulta,
  pool
};