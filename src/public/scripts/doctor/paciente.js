function formatoCURP(input) {
  var formatted = input.value.replace(/[^a-zA-Z0-9]/g, "");

  input.value = formatted.toUpperCase();
}

function formatoNumerico(input) {
  var formatted = input.value.replace(/\D/g, "");

  input.value = formatted;
}

const contenedorPaciente = document.getElementById("fondo__paciente");
const ventanaPaciente = document.getElementById("modal__paciente");
const abrirPaciente = document.getElementById("abrir__paciente");
const cerrarPaciente = document.getElementById("cerrar__paciente");
const consultarPaciente = document.getElementById("consultar__paciente");

abrirPaciente.addEventListener("click", () => {
  const curpPaciente = document.getElementById("curpPaciente").value;

  if (curpPaciente.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ingresa un curp.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  if (curpPaciente.length !== 18) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ingresa un curp válido.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  
  const curpDoctor = document.getElementById("curp_doctor").innerHTML.trim();

  if (curpDoctor.length < 18) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se ha podido cargar el curp del doctor.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  console.log(curpPaciente)
  console.log(curpDoctor)

  if (curpPaciente === curpDoctor) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No puedes ingresar tu mismo curp.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  
  contenedorPaciente.classList.add("mostrar-ventana");
  ventanaPaciente.classList.add("agrandar-ventana");

  fetch("/verificarCurpPaciente/" + encodeURI(curpPaciente), {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.telefono) {
        window.telefonoPaciente = data.telefono;
      }
    });
});

cerrarPaciente.addEventListener("click", () => {
  contenedorPaciente.classList.remove("mostrar-ventana");
  ventanaPaciente.classList.remove("agrandar-ventana");
});

consultarPaciente.addEventListener("click", () => {
  const formData = new FormData();

  const curp = document.getElementById("curpPaciente").value;
  const telefono = window.telefonoPaciente;
  const codigoSMS = document.getElementById("codigoSMSPaciente").value;

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

  formData.append("curp", curp);
  formData.append("telefono", telefono);
  formData.append("codigoSMS", codigoSMS);

  const curpPaciente = formData.get("curp");
  const telefonoPaciente = formData.get("telefono");
  const codigo = formData.get("codigoSMS");

  document.getElementById("fondo__loader").classList.add("mostrar-ventana");

  fetch(
    "/verificarCodigoPaciente/" +
      encodeURI(telefonoPaciente) +
      "/" +
      encodeURI(codigo) +
      "/" +
      encodeURI(curpPaciente),
    {
      method: "POST",
      body: formData,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
      if (data.codigo === "Erroneo") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código de confirmación es erroneo, intentelo de nuevo.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (data.codigo === "Valido") {
        contenedorPaciente.classList.remove("mostrar-ventana");
        ventanaPaciente.classList.remove("agrandar-ventana");
        Swal.fire({
          icon: "success",
          title: "Verificado",
          text: "El perfil se abrirá en una ventana emergente.",
          showConfirmButton: false,
          timer: 1500,
        });
        window.open(`/paciente/${data.curp}`, '_blank')
      }
    });
});
