const contenedorAgregarConsulta = document.getElementById(
  "fondo__agregarConsulta"
);
const ventanaAgregarConsulta = document.getElementById(
  "modal__agregarConsulta"
);
const abrirAgregarConsulta = document.getElementById("abrir__agregarConsulta");
const cerrarAgregarConsulta = document.getElementById(
  "cerrar__agregarConsulta"
);

abrirAgregarConsulta.addEventListener("click", () => {
  contenedorAgregarConsulta.classList.add("mostrar-ventana");
  ventanaAgregarConsulta.classList.add("agrandar-ventana");
});

cerrarAgregarConsulta.addEventListener("click", () => {
  contenedorAgregarConsulta.classList.remove("mostrar-ventana");
  ventanaAgregarConsulta.classList.remove("agrandar-ventana");
});

document
  .getElementById("agregarMedicamento")
  .addEventListener("click", function () {
    var medicamentoTemplate = `
      <div class="modal__medicamento">
          <div class="medicamento__nombre">
              <label class="label">Nombre <span class="asterisk">*</span></label>
              <input name="medicamento__nombre" type="text" class="input">
          </div>
          <div class="medicamento__datos">
              <label class="label">Vía administración <span class="asterisk">*</span></label>
              <input name="medicamento__viaAdministracion" type="text" class="input">
              <label class="label">Dosis <span class="asterisk">*</span></label>
              <input name="medicamento__dosis" type="text" class="input">
              <label class="label">Frecuencia <span class="asterisk">*</span></label>
              <div class="medicamento__extra">
                  <input name="medicamento__frecuencia" type="text" class="input">
                  <p>hrs.</p>
              </div>
              <label class="label">Duración <span class="asterisk">*</span></label>
              <div class="medicamento__extra">
                  <input name="medicamento__duracion" type="text" class="input">
                  <p>día(s)</p>
              </div>
          </div>
      </div>
  `;
    var container = document.getElementById("medicamentosContainer");
    container.insertAdjacentHTML("beforeend", medicamentoTemplate);
  });

  document.getElementById("modal__agregarConsulta").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const datosConsulta = {};
    formData.forEach((value, key) => {
      if (!key.startsWith("medicamento")) {
        datosConsulta[key] = value;
      }
    });
  
    const medicamentos = [];
    const medicamentoElements = document.querySelectorAll('.modal__medicamento');
    medicamentoElements.forEach((element, index) => {
      const medicamentoData = {};
      const inputs = element.querySelectorAll('.input');
      inputs.forEach(input => {
        medicamentoData[input.name] = input.value;
      });
      medicamentos.push(medicamentoData);
    });
  
    const requiredConsultaFields = ["observaciones", "pronostico", "planTerapeutico"];
    let validConsulta = true;
  
    requiredConsultaFields.forEach((field) => {
      if (!datosConsulta[field]) {
        validConsulta = false;
      }
    });
  
    if (!validConsulta) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Completa todos los campos de la consulta.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  
    let validMedicamentos = true;
    medicamentos.forEach((medicamento) => {
      const requiredMedicamentoFields = ["medicamento__nombre", "medicamento__viaAdministracion", "medicamento__dosis", "medicamento__frecuencia", "medicamento__duracion"];
      requiredMedicamentoFields.forEach((field) => {
        if (!medicamento[field]) {
          validMedicamentos = false;
        }
      });
    });
  
    if (!validMedicamentos) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Completa todos los campos de los medicamentos.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  
    document.getElementById("fondo__loader").classList.add("mostrar-ventana");

    enviarConsulta({ datosConsulta, medicamentos });
  });

function enviarConsulta(datos) {
  console.log("Datos a enviar:", datos);
  fetch("/agregarConsulta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
        contenedorAgregarConsulta.classList.remove("mostrar-ventana");
        ventanaAgregarConsulta.classList.remove("agrandar-ventana");
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
