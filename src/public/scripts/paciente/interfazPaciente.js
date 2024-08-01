document
  .getElementById("botonGuardarInformacion")
  .addEventListener("click", () => {
    const formularioVacunasPreestablecidas = document.getElementById(
      "formularioVacunasPreestablecidas"
    );
    const datosVacunasPreestablecidas = new FormData(
      formularioVacunasPreestablecidas
    );

    const formularioHistorialMedico = document.getElementById(
      "formularioHistorialMedico"
    );
    const datosHistorialMedico = new FormData(formularioHistorialMedico);

    const formularioOtrasVacunas = document.getElementById(
      "formularioOtrasVacunas"
    );
    const datosOtrasVacunas = new FormData(formularioOtrasVacunas);

    const url = window.location.href;
    const partesUrl = url.split('/');
    const telefono = partesUrl.pop();

    const datosCombinados = {
      telefono: telefono,
      vacunasPreestablecidas: Object.fromEntries(
        datosVacunasPreestablecidas.entries()
      ),
      historialMedico: Object.fromEntries(datosHistorialMedico.entries()),
      otrasVacunas: Object.fromEntries(datosOtrasVacunas.entries()),
    };

    console.log(telefono);
    console.log(datosCombinados);
    console.log(datosVacunasPreestablecidas);
    console.log(datosOtrasVacunas);
    console.log(datosHistorialMedico);

    fetch("/guardarDatosPaciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCombinados),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al enviar los datos al servidor");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos guardados correctamente en el servidor:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
