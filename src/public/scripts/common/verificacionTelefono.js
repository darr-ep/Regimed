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
  
  if (codigoSMS.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El código debe tener al menos 6 dígitos.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  
  document.getElementById("fondo__loader").classList.add("mostrar-ventana");

  const inputCodigo = document.getElementById("codigoSMS").value;

  fetch("/verificarCodigoTelefono/" + encodeURI(inputCodigo), {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
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
