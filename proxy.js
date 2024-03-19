const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', async (req, res) => {
    try {
        const request = require('request');
        let word = "";
        let def = "";

        request.get({
            url: 'https://api.api-ninjas.com/v1/randomword',
            headers: {'X-Api-Key': 'YEBrft4Rq/1zfW2aa2m6Ug==JP3LfbWMmVVAUe7j'},
        }, async function(error, response, body) {
            if (error) {
                console.error('Request failed:', error);
                return res.status(500).json({ error: 'Error al obtener la palabra aleatoria' });
            } else if (response.statusCode != 200) {
                console.error('Error:', response.statusCode, body.toString('utf8'));
                return res.status(response.statusCode).json({ error: 'Error al obtener la palabra aleatoria' });
            } else {
                try {
                    const jsonData = JSON.parse(body);
                    word = jsonData.word;
                    console.log('Word:', word);

                    const response2 = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                    const definition = await response2.json();

                    if (definition[0].meanings && definition[0].meanings[0].definitions && definition[0].meanings[0].definitions[0]) {
                        def = definition[0].meanings[0].definitions[0].definition;
                        console.log(def);
                    } else {
                        console.log('No se encontró una definición para la palabra ingresada.');
                    }    
                    console.log(def)
                    res.json({ word, def });
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                    return res.status(500).json({ error: 'Error al procesar la palabra aleatoria' });
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener la palabra aleatoria:', error);
        res.status(500).json({ error: 'Error al obtener la palabra aleatoria' });
    }
});


app.listen(3000, () => {
    console.log('Proxy escuchando en el puerto 3000');
});