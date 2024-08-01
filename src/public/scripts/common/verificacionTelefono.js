const verificarNumero = document.getElementById("enviarSMS");
const contenedorVerificarTelefono = document.getElementById(
  "fondo__verificarTelefono"
);
const ventanaVerificarTelefono = document.getElementById(
  "ventana__verificarTelefono"
);
const cerrarVerificarTelefono = document.getElementById(
  "cerrar__verificarTelefono"
);
const verificarTelefono = document.getElementById(
  "verificar__verificarTelefono"
);

if (verificarNumero) {
  verificarNumero.addEventListener("click", () => {
    contenedorVerificarTelefono.classList.add("mostrar-ventana");
    ventanaVerificarTelefono.classList.add("agrandar-ventana");

    fetch("/verificarNumeroTelefonico", {
      method: "POST",
    });
  });
}

cerrarVerificarTelefono.addEventListener("click", () => {
  contenedorVerificarTelefono.classList.remove("mostrar-ventana");
  ventanaVerificarTelefono.classList.remove("agrandar-ventana");
});

verificarTelefono.addEventListener("click", () => {
  const codigoSMS = document.getElementById("codigoSMS").value;

  console.log(codigoSMS);

  if (codigoSMS.length < 6) {
    alert("El código debe tener al menos 6 dígitos.");
    return;
  }

  document.getElementById("loader__container").style.opacity = 1;

  const inputCodigo = document.getElementById("codigoSMS").value;

  fetch("/verificarCodigoTelefono/" + encodeURI(inputCodigo), {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("loader__container").style.opacity = 0;
      if (data.codigo === "Valido") {
        Swal.fire({
          icon: "success",
          title: "Verificado",
          text: "El número de teléfono ha sido verificado",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {
          location.reload();
        }, 1500);
      } else if (data.codigo === "Erroneo") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código de confirmación es erroneo, intentelo de nuevo.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
});
