const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', async (req, res) => {
    try {
        const request = require('request');
        const word = "";
        request.get({
            url: 'https://api.api-ninjas.com/v1/randomword',
            headers: {'X-Api-Key': 'YEBrft4Rq/1zfW2aa2m6Ug==JP3LfbWMmVVAUe7j'},
        }, function(error, response, body) {
            if(error) return console.error('Request failed:', error);
            else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
            else word = word = JSON.parse(body)[0];
        });

        const response2 = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const definition = await response2.json();
        const firstDefinition = definition[0].meanings[0].definitions[0].definition;
        console.log(firstDefinition); // Imprime la primera definición        

        res.json({word, firstDefinition});
    } catch (error) {
        console.error('Error al obtener la palabra aleatoria:', error);
        res.status(500).json({ error: 'Error al obtener la palabra aleatoria' });
    }
});

app.listen(3000, () => {
    console.log('Proxy escuchando en el puerto 3000');
});