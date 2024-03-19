// script.js
document.addEventListener("DOMContentLoaded", function() {
    const descripcion = document.getElementById("descripcion");
    const fraseOriginal = descripcion.textContent.trim().toLowerCase();
    let fraseRestante = fraseOriginal;

    // Función para cambiar el color de las letras a gris
    function cambiarColorGris(letras) {
        return letras.split('').map(letra => `<span style="color: gray;">${letra}</span>`).join('');
    }

    document.addEventListener("keydown", function(event) {
        const letraIngresada = event.key.toLowerCase();
        if (fraseRestante.startsWith(letraIngresada)) {
            descripcion.innerHTML = cambiarColorGris(fraseOriginal.substring(0, fraseOriginal.length - fraseRestante.length + 1)) + fraseRestante.substring(1);
            fraseRestante = fraseRestante.substring(1);
        }
    });
});
