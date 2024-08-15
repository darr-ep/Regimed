document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".abrir__estudio").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const estudioId = event.target.getAttribute("data-estudio-id");
            document.getElementById("fondo__loader").classList.add("mostrar-ventana");


            try {
                const response = await fetch(`/estudio/${estudioId}`);
                if (!response.ok) {
                    document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
                    throw new Error("Network response was not ok");
                }

                document.getElementById("fondo__loader").classList.remove("mostrar-ventana");
                const datos = await response.json();

                const estudio = {
                    tipoEstudio: datos[0].tipoEstudio,
                    motivoEstudio: datos[0].motivoEstudio,
                    descripcion: datos[0].descripcion,
                    resultados: datos[0].resultados
                };

                mostrarModalEstudio(estudio);
            } catch (error) {
                console.error("Error al obtener el estudio:", error);
            }
        });
    });

    document.getElementById("cerrar__estudio").addEventListener("click", () => {
        document.getElementById("fondo__estudio").classList.remove("mostrar-ventana");
        document.getElementById("ventana__estudio").classList.remove("agrandar-ventana");
    });
});

function mostrarModalEstudio(estudio) {
    document.getElementById("estudio__datos").innerHTML = '';
    const datosContainer = document.getElementById("estudio__datos");

    datosContainer.innerHTML = `
        <div class="estudio__dato">
            <h2>Tipo de Estudio</h2>
            <p>${estudio.tipoEstudio}</p>
        </div>
        <div class="estudio__dato">
            <h2>Motivo</h2>
            <p>${estudio.motivoEstudio}</p>
        </div>
        <div class="estudio__dato">
            <h2>Descripcion</h2>
            <p>${estudio.descripcion}</p>
        </div>
    `;

    if (estudio.resultados) {
        datosContainer.innerHTML += `
        <div class="estudio__dato">
            <h2>Resultados</h2>
            <p>${estudio.resultados}</p>
        </div>
        `
    }

    document.getElementById("fondo__estudio").classList.add("mostrar-ventana");
    document.getElementById("ventana__estudio").classList.add("agrandar-ventana");
}
