document.getElementById('buscar__vacuna').addEventListener('keyup', function() {
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

document.getElementById('buscar__consulta').addEventListener('keyup', function() {
    let filter = this.value.toLowerCase();
    let consultas = document.querySelectorAll('.consulta');

    consultas.forEach(function(consulta) {
        let nombre = consulta.querySelector('.observaciones').textContent.toLowerCase();
        if (nombre.includes(filter)) {
            consulta.style.display = '';
        } else {
            consulta.style.display = 'none';
        }
    });
});

document.getElementById('buscar__estudio').addEventListener('keyup', function() {
    let filter = this.value.toLowerCase();
    let estudios = document.querySelectorAll('.estudio');

    estudios.forEach(function(estudio) {
        let nombre = estudio.querySelector('.vacuna__nombre').textContent.toLowerCase();
        if (nombre.includes(filter)) {
            estudio.style.display = '';
        } else {
            estudio.style.display = 'none';
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
            valorA = new Date(a.querySelector('.vacuna--informacion p:nth-child(3)').textContent.split(': ')[1]);
            valorB = new Date(b.querySelector('.vacuna--informacion p:nth-child(3)').textContent.split(': ')[1]);
        } else if (ordenarPor === 'profesional') {
            valorA = a.querySelector('.vacuna--informacion p:nth-last-child(3)').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:nth-last-child(3)').textContent.split(': ')[1];
        } else if (ordenarPor === 'fabricante') {
            valorA = a.querySelector('.vacuna--informacion p:nth-child(2)').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:nth-child(2)').textContent.split(': ')[1];
        } else if (ordenarPor === 'lote') {
            valorA = a.querySelector('.vacuna--informacion p:nth-child(4)').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:nth-child(4)').textContent.split(': ')[1];
        } else if (ordenarPor === 'serie') {
            valorA = a.querySelector('.vacuna--informacion p:nth-child(5)').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:nth-child(5)').textContent.split(': ')[1];
        } else if (ordenarPor === 'dosis') {
            valorA = a.querySelector('.vacuna--informacion p:nth-child(6)').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:nth-child(6)').textContent.split(': ')[1];
        } else if (ordenarPor === 'lugar') {
            valorA = a.querySelector('.vacuna--informacion p:nth-child(7)').textContent.split(': ')[1];
            valorB = b.querySelector('.vacuna--informacion p:nth-child(7)').textContent.split(': ')[1];
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
