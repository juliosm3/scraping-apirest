const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

let noticias = [];

function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

app.get('/noticias', (req, res) => {
  leerDatos();
  res.json(noticias);
});

app.get('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  leerDatos();

  if (indice >= 0 && indice < noticias.length) {
    res.json(noticias[indice]);
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

app.post('/noticias', (req, res) => {
  leerDatos();

  const nuevaNoticia = req.body;
  noticias.push(nuevaNoticia);

  guardarDatos();
  res.json({ mensaje: 'Noticia creada', noticia: nuevaNoticia });
});

app.put('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  leerDatos();

  if (indice >= 0 && indice < noticias.length) {
    const noticiaActualizada = req.body;
    noticias[indice] = noticiaActualizada;

    guardarDatos();
    res.json({ mensaje: 'Noticia actualizada', noticia: noticiaActualizada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

app.delete('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  leerDatos();

  if (indice >= 0 && indice < noticias.length) {
    const noticiaEliminada = noticias.splice(indice, 1);

    guardarDatos();
    res.json({ mensaje: 'Noticia eliminada', noticia: noticiaEliminada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});