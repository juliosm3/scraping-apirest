const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const port = 3002;

app.get('/', async (req, res) => {
  try {
    const url = 'https://elpais.com/ultimas-noticias/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const elementos = $('.b-st_a article.c.c-d.c--m');
    const noticias = [];

    elementos.each((_, elemento) => {
      const titulo = $(elemento).find('header.c_h').text().trim();
      const imagen = $(elemento).find('img').attr('src');
      const descripcion = $(elemento).find('p.c_d').text().trim();
      const enlace = $(elemento).find('a').attr('href');

      const noticia = {
        titulo: titulo,
        imagen: imagen,
        descripcion: descripcion,
        enlace: enlace,
      };

      noticias.push(noticia);
    });

    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));

    res.send('Scraping completado. Datos guardados en noticias.json');
  } catch (error) {
    console.error('Error al realizar la solicitud:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
