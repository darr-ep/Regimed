const contenedorEditarHistorial = document.getElementById("fondo__editarHistorial");
const ventanaEditarHistorial = document.getElementById("modal__editarHistorial");
const abrirEditarHistorial = document.getElementById("abrir__editarHistorial");
const cerrarEditarHistorial = document.getElementById("cerrar__editarHistorial");

abrirEditarHistorial.addEventListener("click", () => {
    contenedorEditarHistorial.classList.add("mostrar-ventana");
    ventanaEditarHistorial.classList.add("agrandar-ventana");
});

cerrarEditarHistorial.addEventListener("click", () => {
    contenedorEditarHistorial.classList.remove("mostrar-ventana");
  ventanaEditarHistorial.classList.remove("agrandar-ventana");
});

document
  .getElementById("modal__editarHistorial")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const datos = {};
    formData.forEach((value, key) => {
      datos[key] = value;
    });

    document.getElementById("fondo__loader").classList.add("mostrar-ventana");

    enviarHistorial(datos);
})

function enviarHistorial(datos) {
    console.log("Datos a enviar:", datos);
    fetch("/editarHistorial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((response) => {
        if (response.ok) {
          document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
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
        document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron guardar los datos",
          showConfirmButton: true,
        });
        console.log(error);
      });
  }