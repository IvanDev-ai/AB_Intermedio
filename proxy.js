const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', function(req, res) {
    const request = require('request');
    let word = "";
    let def = "";

    request.get({
        url: 'https://api.api-ninjas.com/v1/randomword',
        headers: {'X-Api-Key': 'YEBrft4Rq/1zfW2aa2m6Ug==JP3LfbWMmVVAUe7j'},
    }, function(error, response, body) {
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

                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                    .then(response2 => response2.json())
                    .then(definition => {
                        if (definition[0].meanings && definition[0].meanings[0].definitions && definition[0].meanings[0].definitions[0]) {
                            def = definition[0].meanings[0].definitions[0].definition;
                            console.log(def);
                        } else {
                            console.log('No se encontró una definición para la palabra ingresada.');
                        }    
                console.log(def)
                        res.json({ word, def });
                    })
                    .catch(error => {
                        console.error('Error fetching definition:', error);
                        return res.status(500).json({ error: 'Error al obtener la definición de la palabra' });
                    });
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return res.status(500).json({ error: 'Error al procesar la palabra aleatoria' });
            }
        }
    });
});

app.listen(3000, function() {
    console.log('Proxy escuchando en el puerto 3000');
});