document.getElementById('buscar').addEventListener('keyup', function() {
    let filter = this.value.toLowerCase();
    let vacunas = document.querySelectorAll('.vacuna');

    vacunas.forEach(function(vacuna) {
        let nombre = vacuna.querySelector('.vacuna__nombre').textContent.toLowerCase();
        if (nombre.includes(filter)) {
            vacuna.style.display = '';
        } else {
            vacuna.style.display = 'none';
        }
    });
});

document.getElementById('ordenarPor').addEventListener('change', function() {
    let ordenarPor = this.value;
    let vacunas = Array.from(document.querySelectorAll('.vacuna'));
    let contenedorVacunas = document.querySelector('.seccion__contenido--vacunas');

    vacunas.sort(function(a, b) {
        let valorA, valorB;

        if (ordenarPor === 'nombre') {
            valorA = a.querySelector('.vacuna__nombre').textContent;
            valorB = b.querySelector('.vacuna__nombre').textContent;
        } else if (ordenarPor === 'fecha') {
            valorA = new Date(a.querySelector('.vacuna--informacion p:nth-child(2)').textContent.split(': ')[1]);
            valorB = new Date(b.querySelector('.vacuna--informacion p:nth-child(2)').textContent.split(': ')[1]);
        } else if (ordenarPor === 'profesional') {
            valorA = a.querySelector('.vacuna--informacion p:last-child').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:last-child').textContent.split(': ')[1];
        }

        if (valorA < valorB) {
            return -1;
        }
        if (valorA > valorB) {
            return 1;
        }
        return 0;
    });

    contenedorVacunas.innerHTML = '';
    vacunas.forEach(function(vacuna) {
        contenedorVacunas.appendChild(vacuna);
    });
});