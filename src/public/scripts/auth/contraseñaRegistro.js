const contrasenia = document.getElementById("contrasenia")
const conf_contrasenia = document.getElementById("conf_contrasenia")
const icono1 = document.getElementById("icono1")
const icono2 = document.getElementById("icono2")

icono1.addEventListener("click", () => {
    if (contrasenia.type === "password") {
        contrasenia.type = "text"
        conf_contrasenia.type = "text"
        icono1.classList.add('fa-eye-slash')
        icono1.classList.remove('fa-eye')
        icono2.classList.add('fa-eye-slash')
        icono2.classList.remove('fa-eye')
    } else {
        contrasenia.type = "password"
        conf_contrasenia.type = "password"
        icono1.classList.remove('fa-eye-slash')
        icono1.classList.add('fa-eye')
        icono2.classList.remove('fa-eye-slash')
        icono2.classList.add('fa-eye')
    }
})

icono2.addEventListener("click", () => {
    if (contrasenia.type === "password") {
        contrasenia.type = "text"
        conf_contrasenia.type = "text"
        icono1.classList.add('fa-eye-slash')
        icono1.classList.remove('fa-eye')
        icono2.classList.add('fa-eye-slash')
        icono2.classList.remove('fa-eye')
    } else {
        contrasenia.type = "password"
        conf_contrasenia.type = "password"
        icono1.classList.remove('fa-eye-slash')
        icono1.classList.add('fa-eye')
        icono2.classList.remove('fa-eye-slash')
        icono2.classList.add('fa-eye')
    }
})