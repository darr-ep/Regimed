const contenedorRegistroUsuarios = document.getElementById("fondo__agregarRegistro");
const ventanaRegistroUsuarios = document.getElementById("ventana__agregarRegistro");
const abrirRegistroUsuarios = document.getElementById("abrir__agregarRegistro");
const cerrarRegistroUsuarios = document.getElementById("cerrar__agregarRegistro");

let contenedorQR = document.getElementById("contenedorQR");

abrirRegistroUsuarios.addEventListener("click", () => {
  contenedorRegistroUsuarios.classList.add("mostrar-ventana");
  ventanaRegistroUsuarios.classList.add("agrandar-ventana");

  iniciarTemporizador(tiempoRestante);
});

cerrarRegistroUsuarios.addEventListener("click", () => {
  contenedorRegistroUsuarios.classList.remove("mostrar-ventana");
  ventanaRegistroUsuarios.classList.remove("agrandar-ventana");
});

let intervalo;

function iniciarTemporizador(tiempoRestante) {
  document.getElementById("temporizadorCodigo").style.display = "initial";
  document.getElementById("regenerarCodigo").style.display = "none";

  fetch("/generarTokenRegistro")
    .then((response) => response.json())
    .then((data) => {
      tokenRegistroPendiente = data.token;
      tiempoRestante = data.tiempoRestante !== undefined ? data.tiempoRestante : 900;

      // Eliminar el código QR anterior si existe
      if (contenedorQR.firstChild) {
        contenedorQR.removeChild(contenedorQR.firstChild);
      }

      // Crear un nuevo elemento para el código QR
      let nuevoContenedorQR = document.createElement("div");
      nuevoContenedorQR.id = "contenedorQR";

      // Agregar el nuevo código QR al contenedor
      contenedorQR.appendChild(nuevoContenedorQR);

      // Generar el nuevo código QR
      new QRCode(nuevoContenedorQR, {
        text: `${tokenRegistroPendiente}`,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      mostrarTiempo(tiempoRestante);
    });

  contenedorQR.style.filter = "blur(0)";
  contenedorQR.style.border = "2px solid black";

  intervalo = setInterval(function () {
    tiempoRestante--;

    mostrarTiempo(tiempoRestante);

    if (tiempoRestante <= 0) {
      clearInterval(intervalo);

      document.getElementById("temporizadorCodigo").style.display = "none";
      document.getElementById("regenerarCodigo").style.display = "initial";

      contenedorQR.style.filter = "blur(5px)";
      contenedorQR.style.border = "none";
    }
  }, 1000);
}

function mostrarTiempo(segundos) {
  let minutos = Math.floor(segundos / 60);
  let segundosMostrar = segundos % 60;

  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundosMostrar = segundosMostrar < 10 ? "0" + segundosMostrar : segundosMostrar;

  document.getElementById("tiempoRestante").innerHTML = minutos + ":" + segundosMostrar;
}
