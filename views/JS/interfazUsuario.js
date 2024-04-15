document.querySelectorAll('.registro').forEach(boton => {
    console.log('Botón seleccionado:', boton);
    boton.addEventListener('click', () => {
        // Extrae la ID de usuario del ID del botón
        const usuarioId = boton.id.split('_')[1];
        // Redirige a la página del usuario correspondiente
        window.location.href = `/usuario/${usuarioId}`;
    });
});

document.getElementById("abrir__interfazDoctor").addEventListener("click", function() {
    // Redireccionar a otra ventana en la misma página
    window.open("/doctor", "_self");
});