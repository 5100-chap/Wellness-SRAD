//Operaciones de la base de datos
var DB = require('./API/dboperations.js');
//Entidades de las bases de datos
var Generic = require('./API/generic.js');

//importar librerias
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = require('router');

DB.getGeneric().then(result => {
    console.log(result);
})