let desc;
let startTime;
async function obtenerPalabraAleatoria() {
    try {
        const response = await fetch('http://localhost:3000/api');
        const data = await response.json();
        console.log(data);
        const title = data.word;
        const description = data.def;
        desc = description;
        document.getElementById('palabra').textContent = title;
        document.getElementById('descripcion').textContent = description;
        const boton1 = document.getElementById('button1');
        boton1.disabled = true;
        const boton2 = document.getElementById('button2');
        boton2.disabled = true;
        cambiarColorGris(description); // Llama a cambiarColorGris después de que se establezca la descripción
    } catch (error) {
        console.error('Error al obtener la palabra aleatoria:', error);
    }
}

function generarPalabraAleatoria() {
    obtenerPalabraAleatoria();
}

function VolverAEscribir() {
    const boton1 = document.getElementById('button1');
    boton1.disabled = true;
    const boton2 = document.getElementById('button2');
    boton2.disabled = true;
    const descr = document.getElementById('descripcion');
    descr.innerHTML = descr.textContent; 
    const timer = document.getElementById('timer');
    timer.innerHTML = ''; 
    const fallos = document.getElementById('fallos');
    fallos.innerHTML = ''; 
    cambiarColorGris(desc);
}

function cambiarColorGris(letras) {
    const descripcion = document.getElementById("descripcion");
    const fraseOriginal = letras.trim().toLowerCase();
    let fraseRestante = fraseOriginal;
    let fallos = 0; // Variable para contar los fallos
    let startTime = 0;

    // Función para cambiar el color de las letras a gris
    function cambiarColor(letra) {
        return `<span style="color: gray;">${letra}</span>`;
    }

    document.addEventListener("keydown", function(event) {
        const letraIngresada = event.key.toLowerCase();
        if (fraseRestante.startsWith(letraIngresada)) {
            if (!startTime) {
                startTime = performance.now();
            }
            descripcion.innerHTML = cambiarColor(fraseOriginal.substring(0, fraseOriginal.length - fraseRestante.length + 1)) + fraseRestante.substring(1);
            fraseRestante = fraseRestante.substring(1);

            // Verificar si toda la frase está en gris
            if (fraseRestante.length === 0) {
                // Si la frase está completamente en gris, habilitar los botones
                const boton1 = document.getElementById('button1');
                boton1.disabled = false;
                const boton2 = document.getElementById('button2');
                boton2.disabled = false;
                
                const endTime = performance.now();
                const tiempoTranscurrido = endTime - startTime;
                const tiempoEnSegundos = tiempoTranscurrido / 1000;
                const tiempoRedondeado = tiempoEnSegundos.toFixed(2);
                const timer = document.getElementById('timer');
                timer.innerHTML = `Tiempo transcurrido: ${tiempoRedondeado} seg`;

                // Mostrar el número de fallos
                const fallosElement = document.getElementById('fallos');
                fallosElement.innerHTML = `Fallos: ${fallos}`;
            }
        } else {
            // Si la tecla ingresada no es correcta, aumentar el contador de fallos
            fallos++;
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
    // Ejecutar lógica de obtenerPalabraAleatoria() cuando se cargue el DOM
    obtenerPalabraAleatoria();
});
