const port = 8000;
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const exp = require('constants');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/client', (req, res) => {
    res.send('Servidor corriendo correctamente!!!');
});

app.listen(port);
console.log(`http://localhost:${port}/`);