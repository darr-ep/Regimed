document.querySelectorAll('.registro').forEach(boton => {
    boton.addEventListener('click', () => {

        const usuarioId = boton.id.split('_')[1];

        window.open(`/usuario/${usuarioId}`, '_blank')
    });
});