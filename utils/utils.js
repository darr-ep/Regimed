function obtenerFechaFormateada(fecha) {
  if (fecha !== '0000-00-00') {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const año = date.getFullYear();
    return `${año}-${mes}-${dia}`;
  } else {
    return '0000-00-00'
  }
}

module.exports = {
  obtenerFechaFormateada,
};