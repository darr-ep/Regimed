const contrasenia = document.getElementById("contrasenia")
const icono = document.getElementById("icono")

icono.addEventListener("click", () => {
    if (contrasenia.type === "password") {
        contrasenia.type = "text"
        icono.classList.add('fa-eye-slash')
        icono.classList.remove('fa-eye')
    } else {
        contrasenia.type = "password"
        icono.classList.remove('fa-eye-slash')
        icono.classList.add('fa-eye')
    }
})