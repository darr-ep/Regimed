const contenedorTarjetaDatos = document.getElementById(
    "fondo__tarjetaDatos"
  );
  const ventanaTarjetaDatos = document.getElementById(
    "ventana__tarjetaDatos"
  );
  const abrirTarjetaDatos = document.getElementById("abrir__tarjetaDatos");
  const cerrarTarjetaDatos = document.getElementById(
    "cerrar__tarjetaDatos"
  );

  
  contenedorTarjetaDatos.classList.add("mostrar-ventana");
  ventanaTarjetaDatos.classList.add("agrandar-ventana");

  abrirTarjetaDatos.addEventListener("click", () => {
    contenedorTarjetaDatos.classList.add("mostrar-ventana");
    ventanaTarjetaDatos.classList.add("agrandar-ventana");
  
    iniciarTemporizador(tiempoRestante);
  });
  
  cerrarRegistroUsuarios.addEventListener("click", () => {
    contenedorRegistroUsuarios.classList.remove("mostrar-ventana");
    ventanaRegistroUsuarios.classList.remove("agrandar-ventana");
  });