let startTime;

async function generarPalabraAleatoria() {
    try {
        const randomWordResponse = await fetch('https://api.api-ninjas.com/v1/randomword', {
            headers: {
                'X-Api-Key': 'YEBrft4Rq/1zfW2aa2m6Ug==JP3LfbWMmVVAUe7j'
            }
        });
        
        if (!randomWordResponse.ok) {
            throw new Error('Error al obtener la palabra aleatoria');
        }

        const randomWordData = await randomWordResponse.json();
        const word = randomWordData.word;
        
        const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!definitionResponse.ok) {
            alert('Se produjo un error al obtener la definición de la palabra. Por favor, recargue la página.');
            throw new Error('Error al obtener la definición de la palabra');
        }
        const definitionData = await definitionResponse.json();

        let def = '';
        if (definitionData[0].meanings && definitionData[0].meanings[0].definitions && definitionData[0].meanings[0].definitions[0]) {
            def = definitionData[0].meanings[0].definitions[0].definition;
            console.log(def);
        } else {
            console.log('No se encontró una definición para la palabra ingresada.');
        }

        document.getElementById('palabra').innerText = word;
        document.getElementById('descripcion').innerText = def;
        const boton1 = document.getElementById('button1');
        boton1.disabled = true;
        const boton2 = document.getElementById('button2');
        boton2.disabled = true;
        cambiarColorGris(def); 
    } catch (error) {
        console.error('Error al generar palabra aleatoria:', error);
    }
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

