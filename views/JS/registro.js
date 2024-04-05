document.addEventListener('DOMContentLoaded', function() {
    var primeraVez = sessionStorage.getItem('primeraVez');

    if (primeraVez) {
        localStorage.removeItem('formularioData'); // Elimina los datos guardados si es la primera vez
        sessionStorage.removeItem('primeraVez'); // Elimina la marca de "primera vez"
    } else {
        if(localStorage.getItem('formularioData')) {
            var formData = JSON.parse(localStorage.getItem('formularioData'));
            document.getElementById('nombre').value = formData.nombre;
            document.getElementById('apellido_paterno').value = formData.apellido_paterno;
            document.getElementById('apellido_materno').value = formData.apellido_materno;
            document.getElementById('email').value = formData.email;
            document.getElementById('contrasenia').value = formData.contrasenia;
            document.getElementById('conf_contrasenia').value = formData.conf_contrasenia;
        }
    }

    // Marcar que ya se ha visitado la página
    sessionStorage.setItem('primeraVez', 'false');
});

function guardarDatos() {
    var formData = {
        nombre: document.getElementById('nombre').value,
        apellido_paterno: document.getElementById('apellido_paterno').value,
        apellido_materno: document.getElementById('apellido_materno').value,
        email: document.getElementById('email').value,
        contrasenia: document.getElementById('contrasenia').value,
        conf_contrasenia: document.getElementById('conf_contrasenia').value,
    };
    localStorage.setItem('formularioData', JSON.stringify(formData));
}
