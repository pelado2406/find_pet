
const validCodes = ["ABC123", "XYZ789", "QWE456", "M688136", "R75648"];

document.getElementById("registroForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const code = document.getElementById("codigo").value.trim().toUpperCase();
    if (validCodes.includes(code)) {
        window.location.href = `formulario.html?codigo=${code}`;
    } else {
        document.getElementById("respuesta").innerHTML = "<p style='color:red;'>Código inválido.</p>";
    }
});
