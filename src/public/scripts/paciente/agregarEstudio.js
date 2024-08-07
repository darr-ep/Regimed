const contenedorAgregarEstudio = document.getElementById(
  "fondo__agregarEstudio"
);
const ventanaAgregarEstudio = document.getElementById("modal__agregarEstudio");
const abrirAgregarEstudio = document.getElementById("abrir__agregarEstudio");
const cerrarAgregarEstudio = document.getElementById("cerrar__agregarEstudio");

abrirAgregarEstudio.addEventListener("click", () => {
  contenedorAgregarEstudio.classList.add("mostrar-ventana");
  ventanaAgregarEstudio.classList.add("agrandar-ventana");
});

cerrarAgregarEstudio.addEventListener("click", () => {
  contenedorAgregarEstudio.classList.remove("mostrar-ventana");
  ventanaAgregarEstudio.classList.remove("agrandar-ventana");
});

document
  .getElementById("modal__agregarEstudio")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const datos = {};
    formData.forEach((value, key) => {
      datos[key] = value;
    });

    const requiredFields = [
      "tipoEstudio",
      "motivoEstudio",
      "descripcion"
    ];
    let valid = true;

    requiredFields.forEach((field) => {
      if (!datos[field]) {
        valid = false;
      }
    });

    if (!valid) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Completa todos los campos.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    enviarEstudio(datos);
  });

function enviarEstudio(datos) {
  console.log("Datos a enviar:", datos);
  fetch("/agregarEstudio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (response.ok) {
        contenedorAgregarEstudio.classList.remove("mostrar-ventana");
        ventanaAgregarEstudio.classList.remove("agrandar-ventana");
        Swal.fire({
          title: "Los datos han sido guardados",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {
          location.reload();
        }, 1500);
      }
      return response.json();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar los datos",
        showConfirmButton: true,
      });
      console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const fechaInput = document.getElementById("fechaEstudio");
  const today = new Date().toISOString().split("T")[0];
  fechaInput.value = today;
});