const { ejecutarConsulta } = require('../config/database');
const { obtenerFechaFormateada } = require('../utils/utils');

async function registrarUsuario(idUsuario, nombre_comp, nombre, apellido_paterno, apellido_materno, correo, contrasenia) {
  const query = `INSERT INTO datos_usuario (usuario_id, nombre_comp, nombre, apellido_paterno, apellido_materno, imagen, correo, contrasenia) VALUES (?, ?, ?, ?, ?, 'usuario.png', ?, ?)`;
  await ejecutarConsulta(query, [idUsuario, nombre_comp, nombre, apellido_paterno, apellido_materno, correo, contrasenia]);
}

async function consultarUsuario(idUsuario) {
  const query = `SELECT * FROM datos_usuario WHERE usuario_id = ?`;
  const rows = await ejecutarConsulta(query, [idUsuario]);
  const row = rows[0];
  return {
    nombre_comp: row.nombre_comp,
    nombre: row.nombre,
    apellido_paterno: row.apellido_paterno,
    apellido_materno: row.apellido_materno,
    curp: row.curp,
    nacimiento: obtenerFechaFormateada(row.nacimiento),
    estatura: row.estatura,
    peso: row.peso,
    sexo: row.sexo,
    sangre: row.sangre,
    telefono: row.telefono,
    nacionalidad: row.nacionalidad,
    imagen: row.imagen ? row.imagen : "usuario.png"
  };
}

async function consultarUsuarioPorCorreo(correo) {
  const query = `SELECT * FROM datos_usuario WHERE correo = ?`;
  return ejecutarConsulta(query, [correo]);
}

async function consultarUsuarioPorCurp(curp) {
  const query = `SELECT * FROM datos_usuario WHERE curp = ?`;
  const rows = await ejecutarConsulta(query, [curp]);
  const row = rows[0];
  return {
    usuario_id: row.usuario_id,
    nombre_comp: row.nombre_comp,
    imagen: row.imagen ? row.imagen : "usuario.png",
    telefono: row.telefono,
    nacimiento: obtenerFechaFormateada(row.nacimiento),
    peso: row.peso,
    estatura: row.estatura,
    sexo: row.sexo,
    nacionalidad: row.nacionalidad,
    sangre: row.sangre,
  };
}

async function actualizarUsuario(
  idUsuario,
  nombre,
  curp,
  telefono,
  nacimiento,
  peso,
  estatura,
  sexo,
  nacionalidad,
  sangre,
  imagen
) {
  const query = `
      UPDATE datos_usuario
      SET nombre_comp = ?, 
          curp = ?, 
          telefono = ?, 
          nacimiento = ?, 
          peso = ?, 
          estatura = ?, 
          sexo = ?, 
          nacionalidad = ?, 
          sangre = ?, 
          imagen = ?
      WHERE usuario_id = ?`;

  await ejecutarConsulta(query, [
    nombre,
    curp,
    telefono,
    nacimiento,
    peso,
    estatura,
    sexo,
    nacionalidad,
    sangre,
    imagen,
    idUsuario
  ]);
}

module.exports = {
  registrarUsuario,
  consultarUsuario,
  consultarUsuarioPorCorreo,
  consultarUsuarioPorCurp,
  actualizarUsuario
};