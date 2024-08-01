const contenedorDatosPersonales = document.getElementById("fondo__informacion");
const ventanaDatosPersonales = document.getElementById("modal__informacion");
const abrirDatosPersonales = document.getElementById("abrir__informacion");
const cerrarDatosPersonales = document.getElementById("cerrar__informacion");

abrirDatosPersonales.addEventListener("click", () => {
  contenedorDatosPersonales.classList.add("mostrar-ventana");
  ventanaDatosPersonales.classList.add("agrandar-ventana");
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
  // Eliminar todos los caracteres que no sean dígitos
  var formatted = input.value.replace(/\D/g, "");

  // Agregar el símbolo de más (+) al principio del número
  formatted = "+" + formatted;

  // Aplicar el formato deseado: "+xx xxx xxx xxxx"
  if (formatted.length > 3) {
    formatted = formatted.substring(0, 3) + " " + formatted.substring(3);
  }
  if (formatted.length > 7) {
    formatted = formatted.substring(0, 7) + " " + formatted.substring(7);
  }
  if (formatted.length > 11) {
    formatted = formatted.substring(0, 11) + " " + formatted.substring(11);
  }

  // Establecer el valor formateado en el input
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

function formatoTexto(input) {
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
  .getElementById("guardar__informacion")
  .addEventListener("click", () => {
    document.getElementById("fondo__loader").classList.add("mostrar-ventana");
    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombreUsuario").value);
    formData.append("curp", document.getElementById("curpUsuario").value);
    formData.append("telefono",
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

    const imagenGuardada = document.getElementById("imagenGuardada");

    const inputImagenUsuario = document.getElementById("imagenUsuario");
    if (inputImagenUsuario.files.length > 0) {
      formData.append("imagen", inputImagenUsuario.files[0]);
    } else {
      const nombreImagen = imagenGuardada.src;
      var nombreDeLaImagen = obtenerNombreDeImagen(nombreImagen);
      formData.append("imagen", nombreDeLaImagen);
    }

    const nombreImagen = imagenGuardada.src;
    var nombreDeLaImagen = obtenerNombreDeImagen(nombreImagen);
    formData.append("imagenGuardada", nombreDeLaImagen);

    function obtenerNombreDeImagen(src) {
      var partesDeLaUrl = src.split("/");
      var nombreDelArchivo = partesDeLaUrl[partesDeLaUrl.length - 1];
      var partesDelNombre = nombreDelArchivo.split(".");
      var nombre = partesDelNombre[0];
      var extension = partesDelNombre[partesDelNombre.length - 1];
      return nombre + "." + extension;
    }

    fetch("/datosUsuario", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          contenedorDatosPersonales.classList.remove("mostrar-ventana");
          ventanaDatosPersonales.classList.remove("agrandar-ventana");
          document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
          Swal.fire({
            title: "Los datos han sido guardados",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          
          setTimeout(function () {
            location.reload();
          }, 1500);
        } else {
          return response.json().then((data) => {
            throw new Error(data.mensaje);
          });
        }
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
        contenedorDatosPersonales.classList.remove("mostrar-ventana");
        ventanaDatosPersonales.classList.remove("agrandar-ventana");
        document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron guardar los datos",
          showConfirmButton: true,
        });
      });
  });