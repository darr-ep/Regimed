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
        let nombre = estudio.querySelector('.estudio__nombre').textContent.toLowerCase();
        if (nombre.includes(filter)) {
            estudio.style.display = '';
        } else {
            estudio.style.display = 'none';
        }
    });
});

// Ordenar por nombre, profesional y fecha en Vacunas
document.querySelector('#ordenarPorVacunas').addEventListener('change', function() {
    let ordenarPor = this.value;
    let vacunas = Array.from(document.querySelectorAll('#vacunas .vacuna'));
    let contenedorVacunas = document.querySelector('#vacunas .seccion__contenido--vacunas');

    ordenarElementos(vacunas, contenedorVacunas, ordenarPor);

    this.value = ''; // Restablecer select
});

// Mostrar por fecha en Vacunas
document.querySelector('#mostrarVacunas').addEventListener('change', function() {
    let mostrar = this.value;
    let vacunas = document.querySelectorAll('#vacunas .vacuna');

    mostrarElementosPorFecha(vacunas, mostrar, 3);

    this.value = ''; // Restablecer select
});

// Ordenar por nombre, profesional y fecha en Consultas
document.querySelector('#ordenarPorConsultas').addEventListener('change', function() {
    let ordenarPor = this.value;
    let consultas = Array.from(document.querySelectorAll('#consultas .consulta'));
    let contenedorConsultas = document.querySelector('#consultas .seccion__contenido--consultas');

    ordenarElementos(consultas, contenedorConsultas, ordenarPor);

    this.value = ''; // Restablecer select
});

// Mostrar por fecha en Consultas
document.querySelector('#mostrarConsultas').addEventListener('change', function() {
    let mostrar = this.value;
    let consultas = document.querySelectorAll('#consultas .consulta');

    mostrarElementosPorFecha(consultas, mostrar, 4);

    this.value = ''; // Restablecer select
});

// Ordenar por nombre, profesional y fecha en Estudios
document.querySelector('#ordenarPorEstudios').addEventListener('change', function() {
    let ordenarPor = this.value;
    let estudios = Array.from(document.querySelectorAll('#consultas .estudio'));
    let contenedorEstudios = document.querySelector('.seccion__contenido--estudios');

    ordenarElementos(estudios, contenedorEstudios, ordenarPor);

    this.value = ''; // Restablecer select
});

// Mostrar por fecha en Estudios
document.querySelector('#mostrarEstudios').addEventListener('change', function() {
    let mostrar = this.value;
    let estudios = document.querySelectorAll('#consultas .estudio');

    mostrarElementosPorFecha(estudios, mostrar, 5);

    this.value = ''; // Restablecer select
});

// Función para ordenar elementos
function ordenarElementos(elementos, contenedor, tipo, numeroHijo) {
    elementos.sort(function(a, b) {
        let valorA, valorB;

        if (tipo === 'nombre') {
            valorA = a.querySelector('.vacuna__nombre, .observaciones, .estudio__nombre').textContent.toLowerCase();
            valorB = b.querySelector('.vacuna__nombre, .observaciones, .estudio__nombre').textContent.toLowerCase();
        } else if (tipo === 'fecha') {
            valorA = new Date(a.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
            valorB = new Date(b.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
        } else if (tipo === 'profesional') {
            valorA = a.querySelector('p:nth-last-child(3)').textContent.split(': ')[1];
            valorB = b.querySelector('p:nth-last-child(3)').textContent.split(': ')[1];
        }

        return valorA < valorB ? -1 : (valorA > valorB ? 1 : 0);
    });

    contenedor.innerHTML = '';
    elementos.forEach(function(elemento) {
        contenedor.appendChild(elemento);
    });
}

// Función para mostrar elementos según la fecha
function mostrarElementosPorFecha(elementos, tipo, numeroHijo) {
    let ahora = new Date();

    elementos.forEach(function(elemento) {
        let fecha = new Date(elemento.querySelector(`p:nth-child(${numeroHijo})`).textContent.split(': ')[1]);
        let diferenciaTiempo = ahora - fecha;
        let mostrarElemento = false;

        if (tipo === 'cualquiera') {
            mostrarElemento = true;
        } else if (tipo === 'unDia' && diferenciaTiempo <= 24 * 60 * 60 * 1000) {
            mostrarElemento = true;
        } else if (tipo === 'unaSemana' && diferenciaTiempo <= 7 * 24 * 60 * 60 * 1000) {
            mostrarElemento = true;
        } else if (tipo === 'unMes' && diferenciaTiempo <= 30 * 24 * 60 * 60 * 1000) {
            mostrarElemento = true;
        } else if (tipo === 'unAño' && diferenciaTiempo <= 365 * 24 * 60 * 60 * 1000) {
            mostrarElemento = true;
        }

        elemento.style.display = mostrarElemento ? '' : 'none';
    });
}