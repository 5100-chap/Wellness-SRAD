const rutas = require('express').Router();
// Importar las consultas desde el archivo queries.js
const queries = require('./queries');
//Rutas a usar de la API
rutas.get('/', function(req, res){
    res.send('api works!')
})

module.exports = rutas;
