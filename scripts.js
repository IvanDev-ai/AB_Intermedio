let startTime; // Variable global para almacenar el tiempo de inicio de la prueba
let desc; // Variable global para almacenar la descripción de la palabra

// Función async para generar una palabra aleatoria y su definición a traves de las APIs
async function generateRandomWord() {
    try {
        // Obtener una palabra aleatoria de la API
        const randomWordResponse = await fetch('https://api.api-ninjas.com/v1/randomword', {
            headers: {
                'X-Api-Key': 'YEBrft4Rq/1zfW2aa2m6Ug==JP3LfbWMmVVAUe7j'
            }
        });
        
        // Verificar si la solicitud fue bien
        if (!randomWordResponse.ok) {
            throw new Error('Error fetching random word');
        }

        // Obtener los datos de la palabra aleatoria
        const randomWordData = await randomWordResponse.json();
        const word = randomWordData.word; // Extraer la palabra

        // Obtener la definición de la palabra desde otra API
        const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!definitionResponse.ok) {
            // Manejar el error si no se puede obtener la definición
            alert('Se produjo un error al obtener la definición de la palabra. Por favor, recargue la página.');
            throw new Error('Error al obtener la definición de la palabra');
        }
        const definitionData = await definitionResponse.json();

        let def = ''; // Variable para almacenar la definición de la palabra
        // Verificar si hay una definición disponible para la palabra
        if (definitionData[0].meanings && definitionData[0].meanings[0].definitions && definitionData[0].meanings[0].definitions[0]) {
            def = definitionData[0].meanings[0].definitions[0].definition; // Extraer la definición
            console.log(def);
        } else {
            console.log('No se encontró una definición para la palabra ingresada.');
        }

        // Mostrar la palabra y su definición en la página
        document.getElementById('word').innerText = word;
        document.getElementById('description').innerText = def;

        // Deshabilitar el botón después de generar la palabra, sino, el teclado pillaba el boton y no podia escribir correctamente
        const button1 = document.getElementById('button1');
        button1.disabled = true;

        // Cambiar el color de las letras según la entrada del usuario
        changeGrayColor(def, word); 
        desc = def; // Almacenar la definición
    } catch (error) {
        // Manejar errores
        console.error('Error al generar palabra aleatoria:', error);
    }
}

// Función para cambiar el color de las letras según la entrada del usuario
function changeGrayColor(letters, word) {
    const description = document.getElementById("description");
    const originalPhrase = letters.trim().toLowerCase();
    let remainingPhrase = originalPhrase;
    let mistakes = 0; // Contador de errores
    let startTime = 0; // Variable para almacenar el tiempo de inicio

    // Función para cambiar el color de una letra
    function changeColor(letter) {
        return `<span style="color: gray;">${letter}</span>`;
    }

    // Evento de teclado para manejar la entrada del usuario
    document.addEventListener("keydown", function(event) {
        const enteredLetter = event.key.toLowerCase();
        if (remainingPhrase.startsWith(enteredLetter)) {
            if (!startTime) {
                startTime = performance.now(); // Registrar el tiempo de inicio si la primera letra pulsada coincide con la de la descripcion de la palabra
            }
            description.innerHTML = changeColor(originalPhrase.substring(0, originalPhrase.length - remainingPhrase.length + 1)) + remainingPhrase.substring(1);
            remainingPhrase = remainingPhrase.substring(1);

            if (remainingPhrase.length === 0) {
                // Mostrar estadísticas y habilitar el botón al completar la palabra correctamente
                const button1 = document.getElementById('button1');
                button1.disabled = false;
                showStatistics(mistakes, startTime, word, letters);
            }
        } else {
            mistakes++; // Incrementar el contador de errores si la letra ingresada es incorrecta
        }
    });
}

// Función para mostrar las estadísticas y redirigir a otra página
function showStatistics(mistakes, startTime, word, def) {
    const endTime = performance.now();
    const elapsedTime = endTime - startTime; // Calcular el tiempo transcurrido
    const timeInSeconds = elapsedTime / 1000; // Convertir el tiempo a segundos
    const roundedTime = timeInSeconds.toFixed(2); // Redondear el tiempo a 2 decimales

    // Obtener los intentos anteriores de la URL y actualizarlos
    const params = new URLSearchParams(window.location.search);
    let attempts = params.get('attempts')
    if (attempts !== null) {
        attempts = JSON.parse(decodeURIComponent(attempts));
    } else {
        attempts = [];
    }
    attempts.push(roundedTime);
    const attemptsString = JSON.stringify(attempts);

    // Redirigir a otra página con las estadísticas y los datos de la palabra
    window.location.href = `stats.html?mistakes=${mistakes}&time=${roundedTime}&word=${word}&def=${def}&attempts=${attemptsString}`;
}
