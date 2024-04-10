const contenedorDatosPersonales = document.getElementById(
  "fondo__datosPersonales"
);
const ventanaDatosPersonales = document.getElementById(
  "ventana__datosPersonales"
);
const abrirDatosPersonales = document.getElementById("abrir__datosPersonales");
const cerrarDatosPersonales = document.getElementById(
  "cerrar__datosPersonales"
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

function formatoTelefono(input) {
  var formatted = input.value.replace(/\D/g, "");

  if (formatted.length > 3) {
    formatted = formatted.substring(0, 3) + " " + formatted.substring(3);
  }
  if (formatted.length > 7) {
    formatted = formatted.substring(0, 7) + " " + formatted.substring(7);
  }

  input.value = formatted;
}

function formatoEstatura(input) {
  var formatted = input.value.replace(/\D/g, "");

  input.value = formatted;
}

function formatoPeso(input) {
  var formatted = input.value.replace(/[^\d.]/g, "");

  var partes = formatted.split(".");
  if (partes.length > 1) {
    partes[0] = partes[0].slice(0, 3);
    partes[1] = partes[1].slice(0, 2);
    formatted = partes.join(".");
  } else {
    formatted = formatted.slice(0, 3);
  }

  input.value = formatted;
}

function formatoNombre(input) {
  var formatted = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

  input.value = formatted;
}

function formatoCURP(input) {
  var formatted = input.value.replace(/[^a-zA-Z0-9]/g, "");

  input.value = formatted.toUpperCase();
}

function formatoNacionalidad(input) {
  var formatted = input.value.replace(/[^a-zA-Z]/g, "");

  input.value = formatted;
}

document
  .getElementById("guardar__datosPersonales")
  .addEventListener("click", () => {
    contenedorDatosPersonales.classList.remove("mostrar-ventana");
    ventanaDatosPersonales.classList.remove("agrandar-ventana");
    Swal.fire({
      icon: "success",
      title: "Los datos han sido guardados",
      showConfirmButton: false,
      timer: 1500,
    });
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

    const imagenPrevisualizada = document.getElementById(
      "imagenPrevisualizada"
    );

    const imagenGuardada = document.getElementById("imagenGuardada");

    const inputImagenUsuario = document.getElementById("imagenUsuario");
    if (inputImagenUsuario.files.length > 0) {
      formData.append("imagen", inputImagenUsuario.files[0]);
    } else {
      const nombreImagen = imagenPrevisualizada.src;
      var nombreDeLaImagen = obtenerNombreDeImagen(nombreImagen);
      formData.append("imagen", nombreDeLaImagen);
    }

    const nombreImagen = imagenGuardada.src;
    var nombreDeLaImagen = obtenerNombreDeImagen(nombreImagen);
    formData.append("imagenGuardada", nombreDeLaImagen);

    function obtenerNombreDeImagen(src) {
      var partesDeLaUrl = src.split("/");

      var nombreDelArchivo = partesDeLaUrl[partesDeLaUrl.length - 1];

      return nombreDelArchivo;
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

    setTimeout(function () {
      location.reload();
    }, 1500);
  });
