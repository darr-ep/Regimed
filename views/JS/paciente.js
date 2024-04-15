function formatoTelefono(input) {
  var formatted = input.value.replace(/\D/g, "");

  formatted = "+" + formatted;

  if (formatted.length > 3) {
    formatted = formatted.substring(0, 3) + " " + formatted.substring(3);
  }
  if (formatted.length > 7) {
    formatted = formatted.substring(0, 7) + " " + formatted.substring(7);
  }
  if (formatted.length > 11) {
    formatted = formatted.substring(0, 11) + " " + formatted.substring(11);
  }

  input.value = formatted;
}

function formatoNumerico(input) {
  var formatted = input.value.replace(/\D/g, "");

  input.value = formatted;
}

const contenedorPaciente = document.getElementById("fondo__paciente");
const ventanaPaciente = document.getElementById("ventana__paciente");
const abrirPaciente = document.getElementById("abrir__paciente");
const cerrarPaciente = document.getElementById("cerrar__paciente");
const consultarPaciente = document.getElementById("consultar__paciente");

abrirPaciente.addEventListener("click", () => {
  contenedorPaciente.classList.add("mostrar-ventana");
  ventanaPaciente.classList.add("agrandar-ventana");

  const formData = new FormData(document.getElementById("consultarPaciente"));
  const telefonoPaciente = formData.get("telefonoPaciente");

  fetch("/verificarNumeroTelefonicoPaciente/" + encodeURI(telefonoPaciente), {
    method: "POST",
  })
});

cerrarPaciente.addEventListener("click", () => {
  contenedorPaciente.classList.remove("mostrar-ventana");
  ventanaPaciente.classList.remove("agrandar-ventana");
});

consultarPaciente.addEventListener("click", () => {
  const formData = new FormData();

  const telefono = document.getElementById("telefonoPaciente").value;
  const codigoSMS = document.getElementById("codigoSMS").value;

  if (codigoSMS.length < 6) {
    alert("El código debe tener al menos 6 dígitos.");
    return;
  }

  formData.append("telefono", telefono);
  formData.append("codigoSMS", codigoSMS);

  const telefonoPaciente = formData.get("telefono");
  const codigo = formData.get("codigoSMS");

  fetch(
    "/verificarCodigoTelefonoPaciente/" +
      encodeURI(telefonoPaciente) +
      "/" +
      encodeURI(codigo),
    {
      method: "POST",
      body: formData,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.codigo === "Erroneo") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código de confirmación es erroneo, intentelo de nuevo.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (data.codigo === "Valido") {
        console.log(data.telefono)
        window.open('/paciente/' + data.telefono, "_self");
      }
    });
});
