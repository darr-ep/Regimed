document.querySelectorAll('.borrar__registroCompartido').forEach(boton => {
    boton.addEventListener('click', () => {
        Swal.fire({
            icon: "warning",
            title: "Eliminar registro",
            text: "¿Estás seguro de eliminar este registro?",

            showCancelButton: true,

            confirmButtonText: "Eliminar",
            confirmButtonColor: "#d1302f",

            cancelButtonText: "Cancelar",
            cancelButtonColor: "#1976d2",
          
        }).then((result) => {
            if (result.isConfirmed) {
                const usuarioId = boton.getAttribute('data-borrarRegistro-id');

                fetch("/eliminarRegistro/" + encodeURI(usuarioId), {
                    method: "POST",
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
                      if (data.codigo === "Valido") {
                        Swal.fire({
                          icon: "success",
                          title: "Verificado",
                          text: "El registro ha sido eliminado exitosamente",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        setTimeout(function () {
                          location.reload();
                        }, 1500);
                      } else if (data.codigo === "Erroneo") {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: "El código de confirmación es erroneo, intentelo de nuevo.",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      }
                    });
            }
          });
    });
});

document.querySelectorAll('.botonRegistro').forEach(boton => {
    boton.addEventListener('click', () => {
        const usuarioId = boton.getAttribute('data-registro-id');
        window.open(`/usuario/${usuarioId}`, '_blank');
    });
});
