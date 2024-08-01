const { ejecutarConsulta } = require('../config/database');

async function consultarVacunas(idUsuario) {
  const query = `SELECT * FROM vacuna WHERE usuario_id = ?`;
  return ejecutarConsulta(query, [idUsuario]);
}

async function pacienteVerificado(curp) {
  const query = `
  SELECT datos_usuario.*, verificados.*
  FROM datos_usuario
  INNER JOIN verificados
  ON datos_usuario.usuario_id = verificados.usuario_id
  WHERE datos_usuario.curp = ?`;
  return ejecutarConsulta(query, [curp]);
}

module.exports = {
  consultarVacunas,
  pacienteVerificado
};
