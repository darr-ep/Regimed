document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".abrir__consulta").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const consultaId = event.target.getAttribute("data-consulta-id");
        document.getElementById("fondo__loader").classList.add("mostrar-ventana");
  
        try {
          const response = await fetch(`/medicamentos/${consultaId}`);
          if (!response.ok) {
            document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
            throw new Error("Network response was not ok");
          }
          
        document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
          const datos = await response.json();
  
          // Separar los datos de la consulta y los medicamentos
          const consulta = {
            observaciones: datos[0].observaciones,
            pronostico: datos[0].pronostico,
            planTerapeutico: datos[0].planTerapeutico
          };
          const medicamentos = datos.map(med => ({
            nombre: med.nombre,
            viaAdministracion: med.viaAdministracion,
            dosis: med.dosis,
            frecuencia: med.frecuencia,
            duracion: med.duracion
          }));
  
          mostrarModalConsulta(consulta, medicamentos);
        } catch (error) {
          console.error("Error al obtener medicamentos:", error);
        }
      });
    });
  
    document.getElementById("cerrar__consulta").addEventListener("click", () => {
      document.getElementById("fondo__consulta").classList.remove("mostrar-ventana");
      document.getElementById("ventana__consulta").classList.remove("agrandar-ventana");
    });
  });
  
  function mostrarModalConsulta(consulta, medicamentos) {
    document.getElementById("consulta__datos").innerHTML = '';
    document.getElementById("consulta__medicamentos").innerHTML = '';
    const datosContainer = document.getElementById("consulta__datos");
    const medicamentosContainer = document.getElementById("consulta__medicamentos");

    datosContainer.innerHTML = `
      <div class="consulta__dato">
        <h2>Observaciones</h2>
        <p>${consulta.observaciones}</p>
      </div>
      <div class="consulta__dato">
        <h2>Pronostico</h2>
        <p>${consulta.pronostico}</p>
      </div>
      <div class="consulta__dato">
        <h2>Plan Terapeutico</h2>
        <p>${consulta.planTerapeutico}</p>
      </div>
    `;

    console.log(medicamentos)

    const medicamentosValidos = medicamentos.filter(med => 
      med.nombre && med.viaAdministracion && med.dosis && med.frecuencia && med.duracion
    );
  
    console.log(medicamentosValidos)
  
    if (medicamentosValidos.length > 0) {
      medicamentosContainer.innerHTML = `
        <h2>Medicamentos</h2>
        <div class="consulta__medicamentos">
          <table>
            <tbody id="medicamentosTabla">
              
            </tbody>
          </table>
        </div>
      `;

      const medicamentosTabla = document.getElementById("medicamentosTabla");

    medicamentosValidos.forEach((medicamento) => {
      const medicamentosTemplate = `
        <tr>
            <td><span>Nombre</span></td>
            <td><span>Administración</span></td>
            <td><span>Dosis</span></td>
            <td><span>Frecuencia</span></td>
            <td><span>Duración</span></td>
        </tr>
        <tr>
            <td>${medicamento.nombre}</td>
            <td>${medicamento.viaAdministracion}</td>
            <td>${medicamento.dosis}</td>
            <td>${medicamento.frecuencia} hrs.</td>
            <td>${medicamento.duracion} días</td>
        </tr>
      `;
      medicamentosTabla.insertAdjacentHTML("beforeend", medicamentosTemplate);
    });
  }
  
    document.getElementById("fondo__consulta").classList.add("mostrar-ventana");
    document.getElementById("ventana__consulta").classList.add("agrandar-ventana");
  }
  