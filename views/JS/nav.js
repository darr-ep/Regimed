document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos el nombre del archivo actual
    var path = window.location.pathname;
    var currentPage = path.split('/').pop();

    // Obtenemos el enlace correspondiente a la página actual
    var navLinks = document.querySelectorAll('.nav__enlace');
    for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i].getAttribute('href').indexOf(currentPage) !== -1) {
            navLinks[i].classList.add('activo');
            break;
        }
    }
});
