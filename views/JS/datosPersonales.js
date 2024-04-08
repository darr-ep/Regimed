const abrirDatosPersonales = document.getElementById("abrir__datosPersonales");
const contenedorDatosPersonales = document.getElementById(
  "fondo__datosPersonales"
);
const cerrarDatosPersonales = document.getElementById(
  "cerrar__datosPersonales"
);
const ventanaDatosPersonales = document.getElementById(
  "ventana__datosPersonales"
);

abrirDatosPersonales.addEventListener("click", () => {
  contenedorDatosPersonales.classList.add("mostrar-ventana");
  ventanaDatosPersonales.classList.add("agrandar-ventana");
  iniciarTemporizador();
});

cerrarDatosPersonales.addEventListener("click", () => {
  contenedorDatosPersonales.classList.remove("mostrar-ventana");
  ventanaDatosPersonales.classList.remove("agrandar-ventana");
});

const inputImagenUsuario = document.getElementById("imagenUsuario");
const imagenPrevisualizada = document.getElementById("imagenPrevisualizada");

inputImagenUsuario.addEventListener("change", (e) => {
  if (e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagenPrevisualizada.src = e.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

document
  .getElementById("guardar__datosPersonales")
  .addEventListener("click", () => {
    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombreUsuario").value);
    formData.append("curp", document.getElementById("curpUsuario").value);
    formData.append(
      "telefono",
      document.getElementById("telefonoUsuario").value
    );
    formData.append(
      "nacimiento",
      document.getElementById("nacimientoUsuario").value
    );
    formData.append("peso", document.getElementById("pesoUsuario").value);
    formData.append(
      "nacionalidad",
      document.getElementById("nacionalidadUsuario").value
    );
    formData.append(
      "estatura",
      document.getElementById("estaturaUsuario").value
    );
    formData.append("sexo", document.getElementById("sexoUsuario").value);
    formData.append("sangre", document.getElementById("sangreUsuario").value);

    const inputImagenUsuario = document.getElementById("imagenUsuario");
    if (inputImagenUsuario.files.length > 0) {
      formData.append("imagen", inputImagenUsuario.files[0]);
    }

    fetch("/datosPersonales", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Respuesta del servidor:", response);
      })
      .catch((error) => {
        // Manejar errores
        console.error("Error al enviar el formulario:", error);
      });
  });