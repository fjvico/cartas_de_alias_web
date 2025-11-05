document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  fetch("YOUR_SCRIPT_URL", {
    method: "POST",
    mode: "cors",
    body: new FormData(this)
  })
  .then(() => {
    document.getElementById("form-msg").innerText = "Mensaje enviado. Gracias.";
    this.reset();
  })
  .catch(() => {
    document.getElementById("form-msg").innerText = "Error al enviar. Intenta más tarde.";
  });
});
