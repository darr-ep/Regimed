const contenedorRegistroDoctor = document.getElementById(
  "fondo__registroDoctor"
);
const ventanaRegistroDoctor = document.getElementById(
  "ventana__registroDoctor"
);
const abrirRegistroDoctor = document.getElementById("abrir__registroDoctor");
const cerrarRegistroDoctor = document.getElementById("cerrar__registroDoctor");

abrirRegistroDoctor.addEventListener("click", () => {
  contenedorRegistroDoctor.classList.add("mostrar-ventana");
  ventanaRegistroDoctor.classList.add("agrandar-ventana");
});

cerrarRegistroDoctor.addEventListener("click", () => {
  contenedorRegistroDoctor.classList.remove("mostrar-ventana");
  ventanaRegistroDoctor.classList.remove("agrandar-ventana");
});

document
  .getElementById("guardar__registroDoctor")
  .addEventListener("click", function () {
    const formData = new FormData(
      document.getElementById("formularioRegistroDoctor")
    );
    const especialidad = formData.get("especialidad");
    const cedula = formData.get("cedula");
    const captcha = formData.get("g-recaptcha-response");

    if (!captcha) {
      alert("Por favor, completa el captcha.");
      return;
    }

    if (!cedula.length) {
      alert("Por favor, ingresa tu cédula.");
      return;
    }

    if (!especialidad.length) {
      alert("Por favor, ingresa tu especialidad.");
      return;
    }

    fetch(
      "/registroDoctor/" +
        encodeURI(cedula) +
        "/" +
        encodeURI(especialidad) +
        "/" +
        encodeURI(captcha),
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.medico === "Imagen") {
          Swal.fire({
            icon: "error",
            title: "Datos incompletos",
            text: "Agrega una imagen para enviar la solicitud.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (data.medico === "Enviado") {
          Swal.fire({
            icon: "success",
            title: "Datos enviados",
            text: "La solicitud ha sido enviada.",
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
  });
