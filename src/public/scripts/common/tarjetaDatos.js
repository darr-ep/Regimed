var boton = document.getElementById('abrir__tarjetaDatos');

boton.addEventListener('click', function(event) {
    const usuarioId = event.target.getAttribute("data-usuario-id");

    if (!usuarioId) {
        console.error("Usuario ID no encontrado.");
        return;
    }

    console.log(usuarioId);
    window.open("/tarjeta?usuarioId=" + usuarioId, "_blank");
});