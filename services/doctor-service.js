const { ejecutarConsulta } = require("../config/database");

async function consultarDoctor(idUsuario) {
  const query = `SELECT * FROM doctor WHERE usuario_id = ?`;
  return await ejecutarConsulta(query, [idUsuario]);
}

module.exports = {
  consultarDoctor,
};
