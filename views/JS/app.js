// const express = require('express');
// const mysql = require('mysql');



// function nuevoQR() {
//     new QRCode(document.getElementById("contenedorQR"), {
//         text: usuario_id,
//         width: 150,
//         height: 150,
//         colorDark : "#000000",
//         colorLight : "#ffffff",
//         correctLevel : QRCode.CorrectLevel.H
//     });
// }

// new QRCode(document.getElementById("contenedorQR"), {
// 	text: "https://www.youtube.com/watch?v=SQCENEglsSc",
// 	width: 150,
// 	height: 150,
// 	colorDark : "#000000",
// 	colorLight : "#ffffff",
// 	correctLevel : QRCode.CorrectLevel.H
// });

// window.addEventListener('beforeunload', e => {
//     // Envía una solicitud al servidor para notificar el cierre de sesión
//     // Aquí puedes usar XMLHttpRequest, Fetch API o cualquier otra técnica de solicitud de red.
//     // Por ejemplo:
//     fetch('/logout', { method: 'POST' });
// });

const inputs = document.querySelectorAll('.digit-input');

inputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const value = event.target.value;
        if (value !== '') {
            input.classList.add('filled');
            // En lugar de mover el foco al siguiente campo solo si hay un valor, 
            // movemos el foco al siguiente campo en cualquier caso.
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        } else {
            input.classList.remove('filled');
        }
    });

    input.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'Backspace' && index > 0 && event.target.value === '') {
            inputs[index - 1].focus();
        }
    });

    input.addEventListener('focus', () => {
        for (let i = index - 1; i >= 0; i--) {
            if (inputs[i].value === '') {
                inputs[i].focus();
                break;
            }
        }
    });
});

// * Token

// const crypto = require('crypto');

// // Función para generar un token aleatorio de 6 dígitos
// function generarToken() {
//   // Generar un número aleatorio de 6 dígitos
//   const codigo = Math.floor(100000 + Math.random() * 900000);

//     return codigo.toString();
// }

// // Función para generar un hash a partir de un valor dado
// function generarHash(valor) {
//     const hash = crypto.createHash('sha256');
//     hash.update(valor);
//     return hash.digest('hex');
// }

// // Valor previamente registrado (por ejemplo, una cadena aleatoria)
// const valorRegistrado = 'valor_secreto';

// // Generar un token basado en el hash del valor registrado
// const token = generarToken();
// const hashToken = generarHash(token + valorRegistrado);

// console.log('Token generado:', token);
// console.log('Hash del token:', hashToken);

// // Simulación de verificación del token después de 5 minutos
// setTimeout(() => {
//     const nuevoToken = generarToken();
//     const nuevoHashToken = generarHash(nuevoToken + valorRegistrado);

//     console.log('Nuevo token generado:', nuevoToken);
//     console.log('Nuevo hash del token:', nuevoHashToken);

//     if (nuevoHashToken === hashToken) {
//     console.log('El token original sigue siendo válido.');
//     } else {
//     console.log('El token original ha expirado.');
//     }
// }, 5 * 60 * 1000); // 5 minutos en milisegundos
  
// window.onload = function () {
//     iniciarTemporizador();
// };