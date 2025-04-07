document.querySelectorAll("aside li a").forEach((link) => {
  link.addEventListener("click", function () {
    if (
      this.id !== "abrir__tarjetaDatos" &&
      this.id !== "abrir__registroDoctor" &&
      this.id !== "abrir__tarjetaPerdida"
    ) {
      document
        .querySelectorAll("aside li a")
        .forEach((link) => link.classList.remove("seleccionado"));
      this.classList.add("seleccionado");
    }
  });
});

const cerrarAside = () => {
  document.getElementById("aside").style.left = "-250px";
  document.getElementById("dark_background").style.opacity = "0";
  document.getElementById("dark_background").style.pointerEvents = "none";
}

const abrirAside = () => {
  document.getElementById("aside").style.left = "0";
  document.getElementById("dark_background").style.opacity = "0.5";
  document.getElementById("dark_background").style.pointerEvents = "auto";
}