const abrirTarjeta = document.getElementById("abrir__tarjetaPerdida");
const fondoTarjeta = document.getElementById("fondo__tarjetaPerdida");
const modalTarjeta = document.getElementById("modal__tarjetaPerdida");
const cerrarTarjeta = document.getElementById("cerrar__tarjetaPerdida");

abrirTarjeta.addEventListener("click", () => {
  fondoTarjeta.classList.add("mostrar-ventana");
  modalTarjeta.classList.add("agrandar-ventana");
});

cerrarTarjeta.addEventListener("click", () => {
  fondoTarjeta.classList.remove("mostrar-ventana");
  modalTarjeta.classList.remove("agrandar-ventana");
});

document
  .getElementById("generar__tarjetaPerdida")
  .addEventListener("click", () => {
    document.getElementById("fondo__loader").classList.add("mostrar-ventana");

    fetch("/tarjetaPerdida", {
      method: "POST"
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/cerrarSesion";
        } else {
          return response.json().then((data) => {
            throw new Error(data.mensaje);
          });
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el id:", error);
        fondoTarjeta.classList.remove("mostrar-ventana");
        modalTarjeta.classList.remove("agrandar-ventana");
        document
          .getElementById("fondo__loader")
          .classList.remove("mostrar-ventana");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la tarjeta",
          showConfirmButton: true,
        });
      });
  });
