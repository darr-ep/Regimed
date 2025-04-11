const contenedorRegistroUsuarios = document.getElementById("fondo__registro");
const ventanaRegistroUsuarios = document.getElementById("modal__registro");
const abrirRegistroUsuarios = document.getElementById("abrir__registro");
const cerrarRegistroUsuarios = document.getElementById("cerrar_registro");

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
  clearInterval(intervalo);
});

document.getElementById("regenerarCodigo").addEventListener("click", () => {
  clearInterval(intervalo);
  iniciarTemporizador();
})

let intervalo;

function iniciarTemporizador(tiempoRestante) {
  document.getElementById("loader__container").style.opacity = 1;
  document.getElementById("texto__codigo").style.opacity = 0;
  document.getElementById("contenedorCodigo").style.opacity = 0;
  document.getElementById("regenerarCodigo").style.display = "none";
  document.getElementById("temporizadorCodigo").style.display = "none";

  fetch("/generarTokenRegistro")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("loader__container").style.opacity = 0;
      document.getElementById("texto__codigo").style.opacity = 1;
      document.getElementById("contenedorCodigo").style.opacity = 1;
      document.getElementById("temporizadorCodigo").style.display = "initial";
      tiempoRestante =
        data.tiempoRestante !== undefined ? data.tiempoRestante : 180;

      mostrarTiempo(tiempoRestante);

      contenedorCodigo.textContent = data.numeroAleatorio;
    });

  intervalo = setInterval(function () {
    tiempoRestante--;

    mostrarTiempo(tiempoRestante);

    if (tiempoRestante <= 0) {
      clearInterval(intervalo);

      document.getElementById("temporizadorCodigo").style.display = "none";
      document.getElementById("regenerarCodigo").style.display = "initial";

      // contenedorQR.style.filter = "blur(5px)";
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

document.getElementById("modal__registro").onsubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(document.getElementById("modal__registro"));
  const codigo = formData.get("codigoRegistro");
  const captcha = formData.get("g-recaptcha-response");

  if (codigo.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El código debe tener al menos 6 dígitos.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  if (!captcha) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, completa el captcha.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  document.getElementById("fondo__loader").classList.add("mostrar-ventana");

  fetch("/verificarRegistro/" + encodeURI(codigo) + "/" + encodeURI(captcha), {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
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
        contenedorRegistroUsuarios.classList.remove("mostrar-ventana");
        ventanaRegistroUsuarios.classList.remove("agrandar-ventana");
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
  document.getElementById("modal__registro").reset();
  grecaptcha.reset();
};
