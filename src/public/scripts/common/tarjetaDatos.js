var boton = document.getElementById('abrir__tarjetaDatos');

    // Agregar un evento 'click' al botón
    boton.addEventListener('click', function() {
        // Abrir una nueva ventana con la ruta '/modificar'
        window.open("/tarjeta", "_blank");
    });