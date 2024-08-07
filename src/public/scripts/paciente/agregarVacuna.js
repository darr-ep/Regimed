const contenedorAgregarVacuna = document.getElementById("fondo__agregarVacuna");
const ventanaAgregarVacuna = document.getElementById("modal__agregarVacuna");
const abrirAgregarVacuna = document.getElementById("abrir__agregarVacuna");
const cerrarAgregarVacuna = document.getElementById("cerrar__agregarVacuna");

abrirAgregarVacuna.addEventListener("click", () => {
  contenedorAgregarVacuna.classList.add("mostrar-ventana");
  ventanaAgregarVacuna.classList.add("agrandar-ventana");
});

cerrarAgregarVacuna.addEventListener("click", () => {
  contenedorAgregarVacuna.classList.remove("mostrar-ventana");
  ventanaAgregarVacuna.classList.remove("agrandar-ventana");
});

document
  .getElementById("modal__agregarVacuna")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const datos = {};
    formData.forEach((value, key) => {
      datos[key] = value;
    });

    const requiredFields = [
      "vacunaAplicada",
      "fabricante",
      "numeroLote",
      "numeroSerie",
      "dosisAdministrada",
      "lugarAdministacion",
    ];
    let valid = true;

    requiredFields.forEach((field) => {
      if (!datos[field]) {
        valid = false;
      }
    });

    const siguienteDosis = document.getElementById("siguienteDosis");
    if (!siguienteDosis.disabled && !datos["siguienteDosis"]) {
      valid = false;
    }

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

    enviarVacuna(datos);
  });

function enviarVacuna(datos) {
  console.log("Datos a enviar:", datos);
  fetch("/agregarVacuna", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (response.ok) {
        contenedorAgregarVacuna.classList.remove("mostrar-ventana");
        ventanaAgregarVacuna.classList.remove("agrandar-ventana");
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
  const fechaInput = document.getElementById("fechaAplicacion");
  const today = new Date().toISOString().split("T")[0];
  fechaInput.value = today;
});

document
  .getElementById("dosisAdministrada")
  .addEventListener("change", function () {
    const siguienteDosis = document.getElementById("siguienteDosis");
    const asteriskSiguienteDosis = document.querySelector(
      ".asterisk-siguienteDosis"
    );
    const selectedOption = this.value;
    const dosis = ["1ª dosis", "2ª dosis", "3ª dosis", "4ª dosis"];

    if (dosis.includes(selectedOption)) {
      siguienteDosis.removeAttribute("disabled");
      asteriskSiguienteDosis.style.display = "inline";
    } else {
      siguienteDosis.setAttribute("disabled", true);
      asteriskSiguienteDosis.style.display = "none";
    }
  });
