const contenedorRegistroUsuarios = document.getElementById(
  "fondo__agregarRegistro"
);
const ventanaRegistroUsuarios = document.getElementById(
  "ventana__agregarRegistro"
);
const abrirRegistroUsuarios = document.getElementById("abrir__agregarRegistro");
const cerrarRegistroUsuarios = document.getElementById(
  "cerrar__agregarRegistro"
);

let contenedorQR = document.getElementById("contenedorQR");
let contenedorCodigo = document.getElementById("contenedorCodigo");

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
      tiempoRestante =
        data.tiempoRestante !== undefined ? data.tiempoRestante : 180;

      console.log(tiempoRestante);

      // Eliminar el código QR anterior si existe
      if (contenedorQR.firstChild) {
        contenedorQR.removeChild(contenedorQR.firstChild);
        contenedorCodigo.removeChild(contenedorCodigo.firstChild);
      }

      console.log(data.numeroAleatorio);

      let nuevoContenedorQR = document.createElement("div");
      nuevoContenedorQR.id = "contenedorQR";

      // Agregar el nuevo código QR al contenedor
      contenedorQR.appendChild(nuevoContenedorQR);

      contenedorCodigo.textContent = data.numeroAleatorio;

      // Generar el nuevo código QR
      new QRCode(nuevoContenedorQR, {
        text: `${tokenRegistroPendiente}`,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#f0f0f0",
        correctLevel: QRCode.CorrectLevel.H,
      });

      mostrarTiempo(tiempoRestante);
    });

  contenedorQR.style.filter = "blur(0)";

  intervalo = setInterval(function () {
    tiempoRestante--;

    mostrarTiempo(tiempoRestante);

    if (tiempoRestante <= 0) {
      clearInterval(intervalo);

      document.getElementById("temporizadorCodigo").style.display = "none";
      document.getElementById("regenerarCodigo").style.display = "initial";

      contenedorQR.style.filter = "blur(5px)";
      contenedorCodigo.textContent = "- - - - - -";
    }
  }, 1000);
}

function mostrarTiempo(segundos) {
  let minutos = Math.floor(segundos / 60);
  let segundosMostrar = segundos % 60;

  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundosMostrar =
    segundosMostrar < 10 ? "0" + segundosMostrar : segundosMostrar;

  document.getElementById("tiempoRestante").innerHTML =
    minutos + ":" + segundosMostrar;
}

function formatoNumerico(input) {
  var formatted = input.value.replace(/\D/g, "");

  input.value = formatted;
}

document.getElementById("formularioAgregarRegistro").onsubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(
    document.getElementById("formularioAgregarRegistro")
  );
  const codigo = formData.get("codigoRegistro");
  const captcha = formData.get("g-recaptcha-response");

  if (!captcha) {
    alert("Por favor, completa el captcha.");
    return;
  }

  if (codigo.length < 6) {
    alert("El código debe tener al menos 6 dígitos.");
    return;
  }

  fetch("/verificarRegistro/" + encodeURI(codigo) + "/" + encodeURI(captcha), {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.usuario === "Mismo") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código ingresado no debe ser el tuyo.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (data.usuario === "Inexistente") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código ingresado es erroneo, revisalo y vuelve a intentarlo.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (data.usuario === "Existente") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El registro ya esta registrado.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (data.usuario === "Ingresado") {
        Swal.fire({
          icon: "success",
          title: "Agregado",
          text: "El registro ha sido agregado exitosamente.",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {
          location.reload();
        }, 1500);

      }
    });
  document.getElementById("formularioAgregarRegistro").reset();
  grecaptcha.reset();
};
