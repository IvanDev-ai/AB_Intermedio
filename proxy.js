const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', async (req, res) => {
    try {
        const response = await fetch('https://es.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json');
        const data = await response.json();
        const randomPage = data.query.random[0];
        const title = randomPage.title;
        const description = randomPage.snippet;

        res.json({ title, description });
    } catch (error) {
        console.error('Error al obtener la palabra aleatoria:', error);
        res.status(500).json({ error: 'Error al obtener la palabra aleatoria' });
    }
});

app.listen(3000, () => {
    console.log('Proxy escuchando en el puerto 3000');
});