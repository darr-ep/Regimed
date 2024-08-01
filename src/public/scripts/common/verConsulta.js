

const abrirReceta = document.getElementById("abrir__receta");
const fondoReceta = document.getElementById("fondo__receta");
const modalReceta = document.getElementById("modal__receta");
const cerrarReceta = document.getElementById("cerrar__receta");

// const abrirEstudio = document.getElementById("abrir__estudio");
// const fondoEstudio = document.getElementById("fondo__estudio");
// const modalEstudio = document.getElementById("modal__estudio");
// const cerrarEstudio = document.getElementById("cerrar__estudio");

abrirReceta.addEventListener("click", () => {
    fondoReceta.classList.add("mostrar-ventana");
    modalReceta.classList.add("agrandar-ventana");

});
  
cerrarReceta.addEventListener("click", () => {
    fondoReceta.classList.remove("mostrar-ventana");
    modalReceta.classList.remove("agrandar-ventana");
});